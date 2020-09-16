import {
  ProvidedCodeGenOptions,
  makeOptions,
  validateOptions
} from "./options/options";
import { transformToCodeWithMustache } from "./transform/transformToCodeWithMustache";
import { Swagger2Gen } from "./generators/swagger2";
import { enhanceCode } from "./enhance";

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
  }
};
