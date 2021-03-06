import * as Mustache from "mustache";
import { isObject, isString } from "lodash";
import { Swagger } from "../swagger/Swagger";
import { JsBeautifyOptions } from "../enhance/beautify";

export interface Template {
  readonly class: string;
  readonly method: string;
  readonly type: string;
}

interface Options {
  readonly isES6: boolean;
  readonly moduleName: string;
  readonly includeDeprecated: boolean;
  readonly imports: ReadonlyArray<string>;
  readonly className: string;
  readonly template: Partial<Template>;
  readonly mustache: typeof Mustache;
  readonly beautify: ((source: string) => string) | boolean;
  readonly beautifyOptions: JsBeautifyOptions;
  readonly debug?: boolean;
}

interface SwaggerOption {
  readonly swagger: Swagger;
}

const DEFAULT_OPTIONS: Options = {
  isES6: false,
  moduleName: "",
  includeDeprecated: false,
  imports: [],
  className: "",
  template: {},
  mustache: Mustache,
  beautify: false,
  beautifyOptions: {
    indent_size: 2,
    indent_char: " ",
    brace_style: "collapse"
  }
};

/**
 * This is the internal interface we use to reference to the full Options object with defaults
 */
export interface CodeGenOptions extends Options, SwaggerOption {}

/**
 * All options except the swagger object are optional when passing in options
 */
export interface ProvidedCodeGenOptions
  extends Partial<Options>,
    SwaggerOption {}

/**
 * Merge passed options with the default options.
 */
export function makeOptions(options: ProvidedCodeGenOptions): CodeGenOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...options
  };
}

/**
 * Validate that the options have required variables for custom generation.
 */
export function validateOptions(options: ProvidedCodeGenOptions): void {
  // TODO: Why do we not check for the existence of the type template?
  if (
    !options.template ||
    !isObject(options.template) ||
    // @ts-ignore
    !isString(options.template.class) ||
    // @ts-ignore
    !isString(options.template.method)
  ) {
    throw new Error(
      'Unprovided custom template. Please use the following template: template: { class: "...", method: "...", request: "..." }'
    );
  }
}
