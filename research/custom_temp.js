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
var nameSpaceTemp = fs.readFileSync('./templates/d.mustache', 'UTF-8')
var typeTemp = fs.readFileSync('./templates/type.mustache', 'UTF-8')
var indexTemp = fs.readFileSync('./templates/index.mustache', 'UTF-8')

swaggerBigdata = fillSwaggerJson(swaggerBigdata)

const CONFIG = {
  basePath: './src/servicesGen',
  modules: [
    {
      moduleName: 'IDataWork',
      swaggerJson: swagger,
      template: {
        nameSpace: nameSpaceTemp,
        type: typeTemp,
        index: indexTemp,
      }
    }
  ]
}

function createDirIfNotExist(filePath) {
  const dir = path.parse(filePath).dir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function generateModuleService(moduleConf, basePath = './servicesGen') {
  // create namespace .d.ts
  var tsCode = CodeGen.getTypescriptCode({
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

// generateServices(CONFIG)

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
function fillSwaggerJson(swaggerData) {
  const dataType = Object.prototype.toString.call(swaggerData)
  if (dataType === '[object Object]') {
    Object.getOwnPropertyNames(swaggerData).forEach(key => {
      const child = swaggerData[key]
      fillSwaggerJson(child)
    })
    /** 没有items的array类型codegen会报错, 默认给string数组类型 */
    if (swaggerData.type === 'array' && !swaggerData.items) {
      swaggerData.items = { type: 'string' }
    }
  } else if (dataType === '[object Array]') {
    swaggerData.forEach(item => fillSwaggerJson(item))
  }
  return swaggerData
}
