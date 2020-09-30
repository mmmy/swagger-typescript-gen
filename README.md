# Swagger to Typescript gen (Swagger to Typescript 代码生成工具)

首先感谢 [swagger-typescript-codegen](https://github.com/mtennoe/swagger-typescript-codegen)

[![Build Status](https://travis-ci.com/mmmy/swagger-typescript-gen.svg?branch=master)](https://travis-ci.com/mmmy/swagger-typescript-gen)

This package generates a TypeScript class from a [swagger specification file](https://github.com/wordnik/swagger-spec). The code is generated using [mustache templates](https://github.com/mtennoe/swagger-js-codegen/tree/master/templates) and is quality checked by [jshint](https://github.com/jshint/jshint/) and beautified by [js-beautify](https://github.com/beautify-web/js-beautify).

The typescript generator is based on [superagent](https://github.com/visionmedia/superagent) and can be used for both nodejs and the browser via browserify/webpack.

This fork was made to simplify some parts, add some more features, and tailor it more to specific use cases.

## 原理

将 swagger 根据 paths 中的 tag 进行分割成子 swagger, 再利用模板引擎 mustache 生成 typescript 代码, 并写入文件

## Installation

```bash
npm install swagger-typescript-gen
```

## Example

```javascript
var fs = require("fs");
var CodeGen = require("swagger-typescript-gen").CodeGen;

var file = "swagger/spec.json";
// .d.ts文件的模板
var nameSpaceTemp = fs.readFileSync("./templates/d.mustache", "UTF-8");
// typescript类型模板
var typeTemp = fs.readFileSync("./templates/type.mustache", "UTF-8");
// index.ts模板
var indexTemp = fs.readFileSync("./templates/index.mustache", "UTF-8");
// swagger json
var swagger = JSON.parse(fs.readFileSync(file, "UTF-8"));
// 生成目标文件
CodeGen.generateServiceCode({
  // 目标文件的目录
  outputPath: "./src/service",
  swagger: swagger,
  typeTemplate: typeTemp,
  nameSpaceTemplate: nameSpaceTemp,
  indexTemplate: indexTemp,
  // 启用debug之后, 将在控制台打印调试信息
  debug: false,
  // 默认开启自动格式化
  beautify: true,
  // 参考: https://github.com/beautify-web/js-beautify#options
  beautifyOptions: {
    indent_size: 2,
    indent_char: " ",
    brace_style: "collapse"
  }
});
```

### 模板参考

请查看 research/templates 目录

### Template Variables

The following data are passed to the [mustache templates](https://github.com/janl/mustache.js):

```yaml
isES6:
  type: boolean
description:
  type: string
  description: Provided by your options field: 'swagger.info.description'
isSecure:
  type: boolean
  description: false unless 'swagger.securityDefinitions' is defined
moduleName:
  type: string
  description: Your module name - provided by your options field
className:
  type: string
  description: Provided by your options field
domain:
  type: string
  description: If all options defined: swagger.schemes[0] + '://' + swagger.host + swagger.basePath
methods:
  type: array
  items:
    type: object
    properties:
      path:
        type: string
      pathFormatString:
        type: string
      className:
        type: string
        description: Provided by your options field
      methodName:
        type: string
        description: Generated from the HTTP method and path elements or 'x-swagger-js-method-name' field
      method:
        type: string
        description: 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'
        enum:
        - GET
        - POST
        - PUT
        - DELETE
        - PATCH
        - COPY
        - HEAD
        - OPTIONS
        - LINK
        - UNLINK
        - PURGE
        - LOCK
        - UNLOCK
        - PROPFIND
      isGET:
        type: string
        description: true if method === 'GET'
      summary:
        type: string
        description: Provided by the 'description' or 'summary' field in the schema
      externalDocs:
        type: object
        properties:
          url:
            type: string
            description: The URL for the target documentation. Value MUST be in the format of a URL.
            required: true
          description:
            type: string
            description: A short description of the target documentation. GitHub-Markdown syntax can be used for rich text representation.
      isSecure:
        type: boolean
        description: true if the 'security' is defined for the method in the schema
      version:
        type: string
        description: Version part of the path, if the path starts with the prefix '/api/vXXX/'.
      intVersion:
        type: integer
        description: Integer part of the version string.
      isLatestVersion:
        type: boolean
        description: True iff this is the latest version of the method.
      parameters:
        type: array
        description: Includes all of the properties defined for the parameter in the schema plus:
        items:
          camelCaseName:
            type: string
          isSingleton:
            type: boolean
            description: true if there was only one 'enum' defined for the parameter
          singleton:
            type: string
            description: the one and only 'enum' defined for the parameter (if there is only one)
          isBodyParameter:
            type: boolean
          isPathParameter:
            type: boolean
          isQueryParameter:
            type: boolean
          isPatternType:
            type: boolean
            description: true if *in* is 'query', and 'pattern' is defined
          isHeaderParameter:
            type: boolean
          isFormParameter:
            type: boolean
          collectionFormat:
            type: string
      successfulResponseType:
        type: string
        description: The type of a successful response. Defaults to any for non-parsable types or Swagger 1.0 spec files
      successfulResponseTypeIsRef:
        type: boolean
        description: True iff the successful response type is the name of a type defined in the Swagger schema.
```

#### Custom Mustache Variables

You can also pass in your own variables for the mustache templates by adding a `mustache` object:

```javascript
 CodeGen.generateServiceCode({
    ...
    mustache: {
      foo: 'bar',
      app_build_id: env.BUILD_ID,
      app_version: pkg.version
    }
});
```

## Development

To run the typescript compiler on the source files run. This will start a watch process on the sources and build them into the `lib` folder.

```bash
npm run build:watch
```

In addition you can run the test watcher in a separate tab to run the tests in watch mode on the files in the `lib` folder.

```bash
npm run test:watch
```
