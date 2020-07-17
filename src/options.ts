import * as Mustache from "mustache"
import { Swagger } from "./swaggerTypes"

export interface Template {
  readonly class: string;
  readonly method: string;
  readonly type: string;
}

interface Options {
  // readonly className: string;
  readonly template: Partial<Template>;
  readonly mustache: typeof Mustache;
}

interface SwaggerOption {
  readonly swagger: Swagger;
}

const DEFAULT_OPTIONS: Options = {
  template: {},
  mustache: Mustache,
}

export interface CodeGenOptions extends Options, SwaggerOption { }

export interface ProvidedCodeGenOptions
  extends Partial<Options>,
  SwaggerOption { }

export function makeOptions(options: ProvidedCodeGenOptions): CodeGenOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...options
  };
}
/*
export function validateOptions(options: ProvidedCodeGenOptions): void {
  if (
    !options.template ||
    !typeof options.template ||
    !(typeof options.template.class !== 'string') ||
    !(typeof options.template.method !== 'string')
  ) {
    throw new Error(
      'Unprovided custom template. Please use the following template: template: { class: "...", method: "...", request: "..." }'
    );
  }
}
*/