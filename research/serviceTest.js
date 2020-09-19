var fs = require("fs");

var file = "./apis/swagger.json";

var CodeGen = require("../lib/codegen").CodeGen;

var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
var swaggerBigdata = JSON.parse(fs.readFileSync('./apis/bigdata.json', 'UTF-8'));

CodeGen.generateServiceCode({
    swagger: swaggerBigdata
})
