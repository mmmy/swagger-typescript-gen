type SwaggerTypes =
  | "object"
  | "string"
  | "boolean"
  | "number"
  | "integer"
  | "array"
  | "enum"
  | "schema"
  | "reference";

export interface SwaggerType {
  readonly description?: string;
  readonly required?: boolean | ReadonlyArray<string>;
  type: SwaggerTypes;
  readonly allOf?: ReadonlyArray<SwaggerTypes>;
  readonly minItems?: number;
  readonly title?: string;
  readonly $ref?: string;
  readonly properties: {
    readonly [propName: string]: SwaggerType;
  };
}

export interface SwaggerArray extends SwaggerType {
  readonly type: "array";
  readonly items: SwaggerType;
}

export interface SwaggerBoolean extends SwaggerType {
  readonly type: "boolean";
}

export interface SwaggerString extends SwaggerType {
  readonly type: "string";
}

export interface SwaggerNumber extends SwaggerType {
  readonly type: "number" | "integer";
}

export interface SwaggerReference extends SwaggerType {
  readonly type: "reference";
  readonly $ref: string;
}

export interface SwaggerSchema extends SwaggerType {
  readonly schema: SwaggerType;
}

export interface SwaggerEnum extends SwaggerType {
  readonly type: "enum";
  readonly enum: ReadonlyArray<string>;
}

export interface Parameter extends SwaggerType {
  readonly name: string;
  readonly $ref: string;
  readonly enum: ReadonlyArray<any>;
  readonly in: "body" | "query" | "header" | "formData" | "path";
  readonly required: boolean;
}

export type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch";

export interface HttpOperation {
  readonly tags: string[];
  readonly deprecated?: boolean;
  readonly responses: {
    [code: string]: SwaggerType;
  };
  readonly operationId: string;
  readonly description: string;
  readonly summary: string;
  readonly produces: ReadonlyArray<string>;
  readonly consumes: ReadonlyArray<string>;
  readonly parameters: ReadonlyArray<Parameter>;
}

export interface SwaggerDefinition extends SwaggerType {

}

export interface Swagger {
  readonly swagger: string;
  readonly info: {
    version: string;
    title: string;
    description: string;
  };
  readonly host: string;
  readonly basePath: string;
  readonly paths: {
    [path: string]: {
      [key in HttpMethod]: HttpOperation
    }
  };
  readonly definitions: { [key: string]: SwaggerDefinition };
}
