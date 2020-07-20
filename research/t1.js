
var assert = require("assert");
var vows = require("vows");
var fs = require("fs");
var ffs = require("final-fs");
var ts = require("typescript");
var tmp = require("tmp");

var CodeGen = require("../lib/codegen").CodeGen;

var file = "./apis/swagger.json"

var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));

var tsCode = CodeGen.getTypescriptCode({
  className: 'Pulsar',
  swagger: swagger
})

fs.writeFileSync('./t1_result.ts', tsCode)

console.log(tsCode)