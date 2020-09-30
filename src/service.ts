import { CodeGen } from "./codegen";
import { ProvidedCodeGenOptions } from "./options/options";
import * as path from "path";
import * as fs from "fs";

export interface ServiceModuleConfig {
  moduleName: string;
  swaggerJson: ProvidedCodeGenOptions["swagger"];
  template: {
    nameSpace: string;
    type: string;
    index: string;
  };
}

function createDirIfNotExist(filePath: string) {
  const dir = path.parse(filePath).dir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function generateModuleService(
  moduleConf: ServiceModuleConfig,
  basePath: string,
  genOptions: ProvidedCodeGenOptions
) {
  // create namespace .d.ts
  genOptions = {
    beautify: true,
    beautifyOptions: {
      indent_size: 2,
      indent_char: " ",
      brace_style: "collapse"
    },
    ...genOptions
  };
  const tsCode = CodeGen.getTypescriptCode({
    ...genOptions,
    swagger: moduleConf.swaggerJson,
    moduleName: moduleConf.moduleName,
    template: {
      class: moduleConf.template ? moduleConf.template.nameSpace : undefined,
      type: moduleConf.template ? moduleConf.template.type : undefined
    }
  });
  const dPath = path.join(
    process.cwd(),
    basePath,
    moduleConf.moduleName,
    `${moduleConf.moduleName}.d.ts`
  );
  createDirIfNotExist(dPath);
  fs.writeFileSync(dPath, tsCode);

  const indexCode = CodeGen.getTypescriptCode({
    ...genOptions,
    swagger: moduleConf.swaggerJson,
    moduleName: moduleConf.moduleName,
    template: {
      class: moduleConf.template ? moduleConf.template.index : undefined
    }
  });
  const indexPath = path.join(
    process.cwd(),
    basePath,
    moduleConf.moduleName,
    `index.ts`
  );
  createDirIfNotExist(indexPath);
  fs.writeFileSync(indexPath, indexCode);
}
