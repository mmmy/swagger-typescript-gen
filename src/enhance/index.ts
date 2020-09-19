import { beautifyCode, Beautify, BeautifyOptions } from "./beautify";

export interface EnhanceOptions {
  beautify: Beautify;
  beautifyOptions: BeautifyOptions;
}

export function enhanceCode(source: string, opts: EnhanceOptions): string {
  return beautifyCode(opts.beautify, source, opts.beautifyOptions);
}
// definition中将 - 修改为 _
export function repairSwaggerJson(swaggerData: any) {
  const dataType = Object.prototype.toString.call(swaggerData);
  if (dataType === "[object Object]") {
    if (swaggerData.definitions) {
      Object.getOwnPropertyNames(swaggerData.definitions).forEach(k => {
        /** 将definitions中的key: xxxx-sss => xxxx_sss */
        if (k.indexOf("-") > -1) {
          const definition = swaggerData.definitions[k];
          const newK = k.replace(/-/g, "_");
          delete swaggerData.definitions[k];
          swaggerData.definitions[newK] = definition;
        }
      });
    }
    Object.getOwnPropertyNames(swaggerData).forEach(key => {
      const child = swaggerData[key];
      /** 1. 将definitions中的-换成_ */
      if (key === "$ref" && typeof swaggerData["$ref"] === "string") {
        swaggerData["$ref"] = swaggerData["$ref"].replace(/-/g, "_");
      }
      repairSwaggerJson(child);
    });
    /** 2.没有items的array类型codegen会报错, 默认给string数组类型 */
    if (swaggerData.type === "array" && !swaggerData.items) {
      swaggerData.items = { type: "string" };
    }
  } else if (dataType === "[object Array]") {
    swaggerData.forEach((item: any) => repairSwaggerJson(item));
  }
  return swaggerData;
}
