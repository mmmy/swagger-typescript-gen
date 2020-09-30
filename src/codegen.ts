import {
  ProvidedCodeGenOptions,
  makeOptions,
  validateOptions
} from "./options/options";
import { transformToCodeWithMustache } from "./transform/transformToCodeWithMustache";
import { Swagger2Gen } from "./generators/swagger2";
import { enhanceCode, repairSwaggerJson } from "./enhance";
import { splitSwaggerByTags } from "./getViewForSwagger2";
import { generateModuleService } from "./service";

interface ModuleConfig {
  basePath: string;
  modules: {
    moduleName: string;
    swaggerJson: ProvidedCodeGenOptions["swagger"];
    template: {
      nameSpace: string;
      type: string;
      index: string;
    };
  }[];
}

export const CodeGen = {
  transformToViewData: Swagger2Gen.getViewData,
  transformToCodeWithMustache,
  getTypescriptCode: function(opts: ProvidedCodeGenOptions) {
    const options = makeOptions(opts);
    // const viewData = Swagger2Gen.getViewData(options);
    // console.log("----viewData----");
    // console.log(JSON.stringify(viewData, null, 2));
    // return Swagger2Gen.getCode(options);
    // 去掉beautiful
    return enhanceCode(Swagger2Gen.getCode(options), options);
  },
  getCustomCode: function(opts: ProvidedCodeGenOptions) {
    validateOptions(opts);

    const options = makeOptions(opts);
    // return Swagger2Gen.getCode(options);
    // 去掉beautiful
    return enhanceCode(Swagger2Gen.getCode(options), options);
  },
  getDataAndOptionsForGeneration: function(opts: ProvidedCodeGenOptions) {
    const options = makeOptions(opts);
    const data = Swagger2Gen.getViewData(options);
    return { data, options };
  },
  generateServiceCode: function(
    options: ProvidedCodeGenOptions & {
      outputPath?: string;
      nameSpaceTemplate: string;
      typeTemplate: string;
      indexTemplate: string;
    }
  ) {
    repairSwaggerJson(options.swagger);
    // 1.解析tags
    const swaggerTagMap = splitSwaggerByTags(options.swagger);
    const tagList = Object.getOwnPropertyNames(swaggerTagMap);
    // console.log(swaggerTagMap)
    const moduleConfig: ModuleConfig = {
      basePath: options.outputPath || "./__codeGenService",
      modules: tagList.map(tag => ({
        moduleName: tag,
        swaggerJson: swaggerTagMap[tag],
        template: {
          nameSpace: options.nameSpaceTemplate,
          type: options.typeTemplate,
          index: options.indexTemplate
        }
      }))
    };

    moduleConfig.modules.forEach(m =>
      generateModuleService(m, moduleConfig.basePath, options)
    );
  }
};
