import { js_beautify } from "js-beautify";
import { defaults } from "lodash";

export interface JsBeautifyOptions {
  indent_size?: number;
  indent_char?: string;
  eol?: string;
  indent_level?: number;
  indent_with_tabs?: boolean;
  preserve_newlines?: boolean;
  max_preserve_newlines?: number;
  jslint_happy?: boolean;
  space_after_anon_function?: boolean;
  brace_style?:
    | "collapse-preserve-inline"
    | "collapse"
    | "expand"
    | "end-expand"
    | "none";
  keep_array_indentation?: boolean;
  keep_function_indentation?: boolean;
  space_before_conditional?: boolean;
  break_chained_methods?: boolean;
  eval_code?: boolean;
  unescape_strings?: boolean;
  wrap_line_length?: number;
  wrap_attributes?: "auto" | "force";
  wrap_attributes_indent_size?: number;
  end_with_newline?: boolean;
}

const DEFAULT_BEAUTIFY_OPTIONS: JsBeautifyOptions = {
  indent_size: 4,
  max_preserve_newlines: 2
};

export type Beautify = ((source: string) => string) | boolean | undefined;

export type BeautifyOptions = JsBeautifyOptions;

export function beautifyCode(
  beautify: Beautify,
  source: string,
  options: BeautifyOptions = {}
): string {
  // Backwards compatible js_beautify
  if (beautify === undefined || beautify === true) {
    return js_beautify(source, defaults(options, DEFAULT_BEAUTIFY_OPTIONS));
  }

  // Run the beautify function if it has been provided
  if (typeof beautify === "function") {
    return beautify(source);
  }

  // Return original source if no beautify option was given
  return source;
}
