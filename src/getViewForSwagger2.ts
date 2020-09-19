import { merge, get, cloneDeep, set } from "lodash";
import { CodeGenOptions } from "./options/options";
import { Swagger, schemaAllowedHttpMethods } from "./swagger/Swagger";
import {
  makeMethod,
  makeMethodName,
  Method,
  getLatestVersionOfMethods
} from "./view-data/method";
import {
  Definition,
  makeDefinitionsFromSwaggerDefinitions
} from "./view-data/definition";
import {
  getHttpMethodTuplesFromSwaggerPathsObject,
  isAuthorizedAndNotDeprecated,
  isAuthorizedMethod
} from "./view-data/operation";

export type GenerationTargetType = "typescript" | "custom";

export interface ViewData {
  isES6: boolean;
  description: string;
  isSecure: boolean;
  moduleName: string;
  className: string;
  imports: ReadonlyArray<string>;
  domain: string;
  isSecureToken: boolean;
  isSecureApiKey: boolean;
  isSecureBasic: boolean;
  methods: Method[];
  definitions: Definition[];
}

export function getViewForSwagger2(opts: CodeGenOptions): ViewData {
  const swagger = normalizeResponseDefinitions(opts.swagger);

  const data: ViewData = {
    isES6: opts.isES6,
    description: swagger.info.description,
    isSecure: swagger.securityDefinitions !== undefined,
    isSecureToken: false,
    isSecureApiKey: false,
    isSecureBasic: false,
    moduleName: opts.moduleName,
    className: opts.className,
    imports: opts.imports,
    domain:
      swagger.schemes &&
      swagger.schemes.length > 0 &&
      swagger.host &&
      swagger.basePath
        ? `${swagger.schemes[0]}://${swagger.host}${swagger.basePath.replace(
            /\/+$/g,
            ""
          )}`
        : "",
    methods: [],
    definitions: []
  };

  data.methods = makeMethodsFromPaths(data, opts, swagger);

  const latestVersions = getLatestVersionOfMethods(data.methods);

  data.methods = data.methods.map(setIsLatestVersion(latestVersions));

  data.definitions = makeDefinitionsFromSwaggerDefinitions(
    swagger.definitions,
    swagger
  );

  return {
    ...data
  };
}

function normalizeResponseDefinitions(swagger: any): any {
  // ensure that the optional swagger.responses and swagger.definitions fields are present
  swagger.responses = swagger.responses || {};
  swagger.definitions = swagger.definitions || {};

  // inject swagger.response defs into swagger.definitions
  // prefixing them with "Response_" on name clashes with existing definitions
  Object.entries<any>(swagger.responses).forEach(([name, def]) => {
    if (!def.schema || def.schema.$ref) {
      return;
    }

    const defName = (swagger.definitions[name] ? "Response_" : "") + name;
    swagger.definitions[defName] = def.schema;
    def.schema = { $ref: `#/definitions/${defName}` };
  });

  // inject inline response definitions into swagger.definitions
  // the corresponding def name will be constructed like "Response_${opName}_${responseCode}"
  // in order to avoid name clashes
  getHttpMethodTuplesFromSwaggerPathsObject(swagger.paths).forEach(
    ([path, httpVerb, op]) => {
      const responses = op.responses;

      Object.entries<any>(responses).forEach(([resCode, resDef]) => {
        const schema = resDef.schema;
        if (schema && !schema.$ref) {
          const methodName = makeMethodName(path, httpVerb, op);
          const defName = `Response_${methodName}_${resCode}`;
          swagger.definitions[defName] = schema;
          resDef.schema = { $ref: `#/definitions/${defName}` };
        }
      });
    }
  );

  // remove one level of indirection (refs pointing to swagger.responses)
  // from the endpoint.responses defs by redirecting them directly to the
  // corresponding ref into swagger.definitions
  getHttpMethodTuplesFromSwaggerPathsObject(swagger.paths).forEach(
    ([_path, _httpVerb, op]) => {
      const responses = op.responses;

      Object.keys(responses).forEach(r => {
        const ref = responses[r].$ref;
        if (ref) {
          const def = get(swagger, ref.substring(2).split("/")); // remove leading "#/"
          (responses[r] as any) = def;
        }
      });
    }
  );

  // swagger.responses is not used/required anymore
  delete swagger.responses;

  return swagger;
}

function setIsLatestVersion(
  latestVersions: Method[]
): (method: Method) => Method {
  return method =>
    latestVersions.indexOf(method) > -1
      ? {
          ...method,
          isLatestVersion: true
        }
      : method;
}

const makeMethodsFromPaths = (
  data: ViewData,
  opts: CodeGenOptions,
  swagger: Swagger
): Method[] =>
  getHttpMethodTuplesFromSwaggerPathsObject(swagger.paths)
    .filter(
      method =>
        (opts.includeDeprecated && isAuthorizedMethod(method)) ||
        isAuthorizedAndNotDeprecated(method)
    )
    .map(([path, httpVerb, op, globalParams]) => {
      // TODO: Start of untested security stuff that needs fixing
      const secureTypes = [];

      if (
        swagger.securityDefinitions !== undefined ||
        op.security !== undefined
      ) {
        const mergedSecurity = merge([], swagger.security, op.security).map(
          security => Object.keys(security)
        );
        if (swagger.securityDefinitions) {
          for (const sk in swagger.securityDefinitions) {
            if (mergedSecurity.join(",").indexOf(sk) !== -1) {
              secureTypes.push(swagger.securityDefinitions[sk].type);
            }
          }
        }
      }
      // End of untested

      const method: Method = makeMethod(
        path,
        opts,
        swagger,
        httpVerb,
        op,
        secureTypes,
        globalParams
      );

      // TODO: It seems the if statements below are pretty weird...
      // This runs in a for loop which is run for every "method"
      // in every "api" but we modify the parameter passed in to the
      // function, therefore changing the global state by setting it to
      // the last api + method combination?
      // No test covers this scenario at the moment.
      if (method.isSecure && method.isSecureToken) {
        data.isSecureToken = method.isSecureToken;
      }

      if (method.isSecure && method.isSecureApiKey) {
        data.isSecureApiKey = method.isSecureApiKey;
      }

      if (method.isSecure && method.isSecureBasic) {
        data.isSecureBasic = method.isSecureBasic;
      }
      // End of weird statements

      return method;
    });

type Mutable<T> = { -readonly [key in keyof T]: T[key] };

type SwaggerVar = Mutable<Swagger>;

/**
 * 根据tag 将swagger的paths和definitions分离成多个swagger
 * @param swagger
 */
export function splitSwaggerByTags(swagger: Swagger) {
  const defaultTag = "defaultTag";
  const swaggerMap: { [key: string]: SwaggerVar } = {};
  const pathKeys = Object.getOwnPropertyNames(swagger.paths);
  const definitions = Object.assign({}, swagger.definitions);

  pathKeys.forEach(p => {
    const pathData = swagger.paths[p];
    // const methods: HttpMethod[] = ['get', '']// Object.getOwnPropertyNames(pathData)

    schemaAllowedHttpMethods.forEach(m => {
      const operationData = pathData[m];
      if (operationData) {
        let tag0 = (operationData.tags && operationData.tags[0]) || defaultTag;
        tag0 = tag0.trim();
        // 初始化
        if (!swaggerMap[tag0]) {
          const tagSwagger: SwaggerVar = cloneDeep(swagger);
          tagSwagger.definitions = {};
          tagSwagger.paths = {};
          swaggerMap[tag0] = tagSwagger;
        }

        const tagSwagger = swaggerMap[tag0];
        set(tagSwagger.paths, `${p}.${m}`, operationData);
        // 查找必要的definitions
        const relateDefinitionsInOperation = findAllRefDefinitions(
          operationData
        );
        // if (relateDefinitionsInOperation.length > 0) {
        //   console.log(tag0, p,m,relateDefinitionsInOperation)
        // }

        relateDefinitionsInOperation.forEach(dk => {
          const definitionData = definitions[dk];
          if (definitionData && !tagSwagger.definitions[dk]) {
            tagSwagger.definitions[dk] = definitionData;
            // findAllRelativeDefinitions in definitionData
            /*
                目前只查找一级
                tod: 递归查找出所有definition
             */
            const definitionsInDefinition = findAllRefDefinitions(
              definitionData
            );
            // if (definitionsInDefinition.length > 0) {
            //   console.log('    ',definitionsInDefinition)
            // }
            definitionsInDefinition.forEach(did => {
              const defData = definitions[did];
              if (defData && !tagSwagger.definitions[did]) {
                tagSwagger.definitions[did] = defData;
              }
            });
          }
        });
      }
    });
  });
  return swaggerMap;
}
// 查找所有的ref
function findAllRef(obj: any, result: string[]) {
  const dataType = Object.prototype.toString.call(obj);
  if (dataType === "[object Object]") {
    const keys = Object.getOwnPropertyNames(obj);
    keys.forEach(key => {
      const val = obj[key];
      if (key === "$ref" && typeof val === "string") {
        result.push(val);
      } else {
        findAllRef(obj[key], result);
      }
    });
  } else if (dataType === "[object Array]") {
    obj.forEach((o: any) => findAllRef(o, result));
  }
}
// 查找所有的ref中相关的definition
function findAllRefDefinitions(obj: any) {
  const result: string[] = [];
  findAllRef(obj, result);
  return result
    .map(ref => {
      const pathNames = ref.split("/");
      return pathNames[pathNames.length - 1];
    })
    .filter(s => !!s);
}
