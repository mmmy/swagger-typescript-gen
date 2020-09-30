var fs = require("fs");

var file = "./apis/swagger.json";

var CodeGen = require("../lib/codegen").CodeGen;
var nameSpaceTemp = fs.readFileSync('./templates/d.mustache', 'UTF-8')
var typeTemp = fs.readFileSync('./templates/type.mustache', 'UTF-8')
var indexTemp = fs.readFileSync('./templates/index.mustache', 'UTF-8')

var swagger = JSON.parse(fs.readFileSync(file, "UTF-8"));
var swaggerBigdata = JSON.parse(
  fs.readFileSync("./apis/bigdata.json", "UTF-8")
);

CodeGen.generateServiceCode({
  outputPath: './src/service',
  swagger: swaggerBigdata,
  typeTemplate: typeTemp,
  nameSpaceTemplate: nameSpaceTemp,
  indexTemplate: indexTemp,
  debug: true,
});
