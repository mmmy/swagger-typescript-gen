var assert = require("assert");
var vows = require("vows");
var fs = require("fs");
var ffs = require("final-fs");
var ts = require("typescript");
var tmp = require("tmp");
var path = require("path");

var CodeGen = require("../lib/codegen").CodeGen;

var file = "./apis/swagger.json"

var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
var swaggerBigdata = JSON.parse(fs.readFileSync('./apis/bigdata.json', 'UTF-8'));
var swaggerDMP = JSON.parse(fs.readFileSync('./apis/dmp.json', 'UTF-8'));
var nameSpaceTemp = fs.readFileSync('./templates/d.mustache', 'UTF-8')
var typeTemp = fs.readFileSync('./templates/type.mustache', 'UTF-8')
var indexTemp = fs.readFileSync('./templates/index.mustache', 'UTF-8')

swaggerBigdata = repaireSwaggerJson(swaggerBigdata)
swaggerDMP = repaireSwaggerJson(swaggerDMP)

const CONFIG = {
  basePath: './src/servicesGen',
  modules: [
    {
      moduleName: 'ISwaggerTest',
      swaggerJson: swagger,
      template: {
        nameSpace: nameSpaceTemp,
        type: typeTemp,
        index: indexTemp,
      }
    }
  ]
}

const CONFIG_DMP = {
  basePath: './src/DMPGen',
  modules: [
    {
      moduleName: 'IDMP',
      swaggerJson: swaggerDMP,
      template: {
        nameSpace: nameSpaceTemp,
        type: typeTemp,
        index: indexTemp,
      }
    }
  ]
}

generateServices(CONFIG_DMP)

function createDirIfNotExist(filePath) {
  const dir = path.parse(filePath).dir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function generateModuleService(moduleConf, basePath = './servicesGen') {
  // create namespace .d.ts
  var tsCode = CodeGen.getTypescriptCode({
    beautify: true,
    beautifyOptions: {
      indent_size: 2,
      indent_char: ' ',
      brace_style: 'collapse',
    },
    swagger: moduleConf.swaggerJson,
    moduleName: moduleConf.moduleName,
    template: {
      class: moduleConf.template ? moduleConf.template.nameSpace : null,
      type: moduleConf.template ? moduleConf.template.type : null,
    }
  })
  const dPath = path.join(__dirname, basePath, `${moduleConf.moduleName}.d.ts`)
  createDirIfNotExist(dPath)
  fs.writeFileSync(dPath, tsCode)

  var indexCode = CodeGen.getTypescriptCode({
    beautify: true,
    beautifyOptions: {
      indent_size: 2,
      indent_char: ' ',
      brace_style: 'collapse',
      wrap_line_length: 100,
    },
    swagger: moduleConf.swaggerJson,
    moduleName: moduleConf.moduleName,
    template: {
      class: moduleConf.template ? moduleConf.template.index : null,
    }
  })
  const indexPath = path.join(__dirname, basePath, `index.ts`)
  createDirIfNotExist(indexPath)
  fs.writeFileSync(indexPath, indexCode)
}

function generateServices(config) {
  config.modules.forEach(m => generateModuleService(m, config.basePath))
}

generateServices(CONFIG)

const CONFIG_BIGDATA = {
  basePath: './src/bigdataServicesGen',
  modules: [
    {
      moduleName: 'IBigData',
      swaggerJson: swaggerBigdata,
      template: {
        nameSpace: nameSpaceTemp,
        type: typeTemp,
        index: indexTemp,
      }
    }
  ]
}
generateServices(CONFIG_BIGDATA)

/** 处理不合法的数据 */
function repaireSwaggerJson(swaggerData) {
  const dataType = Object.prototype.toString.call(swaggerData)
  if (dataType === '[object Object]') {
    if (swaggerData.definitions) {
      Object.getOwnPropertyNames(swaggerData.definitions).forEach(k => {
        /** 将definitions中的key: xxxx-sss => xxxx_sss */
        if (k.indexOf('-') > -1) {
          const definition = swaggerData.definitions[k]
          const newK = k.replace(/-/g, '_')
          delete swaggerData.definitions[k]
          swaggerData.definitions[newK] = definition
        }
      })
    }
    Object.getOwnPropertyNames(swaggerData).forEach(key => {
      const child = swaggerData[key]
      /** 1. 将definitions中的-换成_ */
      if (key === '$ref' && typeof swaggerData['$ref'] === 'string') {
        swaggerData['$ref'] = swaggerData['$ref'].replace(/-/g, '_')
      }
      repaireSwaggerJson(child)
    })
    /** 2.没有items的array类型codegen会报错, 默认给string数组类型 */
    if (swaggerData.type === 'array' && !swaggerData.items) {
      swaggerData.items = { type: 'string' }
    }
  } else if (dataType === '[object Array]') {
    swaggerData.forEach(item => repaireSwaggerJson(item))
  }
  return swaggerData
}
