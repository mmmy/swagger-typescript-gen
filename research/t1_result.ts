// tslint:disable

import * as request from "superagent";
import { SuperAgentStatic, SuperAgentRequest, Response } from "superagent";

export type RequestHeaders = {
  [header: string]: string;
};
export type RequestHeadersHandler = (headers: RequestHeaders) => RequestHeaders;

export type ConfigureAgentHandler = (
  agent: SuperAgentStatic
) => SuperAgentStatic;

export type ConfigureRequestHandler = (
  agent: SuperAgentRequest
) => SuperAgentRequest;

export type CallbackHandler = (err: any, res?: request.Response) => void;

export type InventoryItem = {
  id: string;
  name: string;
  releaseDate: string;
  manufacturer: Manufacturer;
} & {
  [key: string]: any;
};

export type Manufacturer = {
  name?: string;
  homePage?: string;
  phone?: string;
};

export type inline_response_default = {
  msg?: string;
  result?: boolean;
} & {
  [key: string]: any;
};

export type inline_response_200 = {
  id?: string;
  name?: string;
  type?: "type_a" | "type_b" | "type_c";
  goods?: Array<string>;
} & {
  [key: string]: any;
};

export type inline_response_200_1 = {
  result?: boolean;
  msg?: string;
} & {
  [key: string]: any;
};

export type inline_response_200_2 = {
  code?: number;
  type?: string;
  message?: string;
} & {
  [key: string]: any;
};

export type Response_searchInventory_200 = Array<InventoryItem>;

export type Logger = {
  log: (line: string) => any;
};

export interface ResponseWithBody<S extends number, T> extends Response {
  status: S;
  body: T;
}

export type QueryParameters = {
  [param: string]: any;
};

export interface CommonRequestOptions {
  $queryParameters?: QueryParameters;
  $domain?: string;
  $path?: string | ((path: string) => string);
  $retries?: number; // number of retries; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#retrying-requests
  $timeout?: number; // request timeout in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
  $deadline?: number; // request deadline in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
}

/**
 * This is a sample APIs
 * @class Pulsar
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class Pulsar {
  private domain: string =
    "https://virtserver.swaggerhub.com/mmmy/all-types/1.0.0";
  private errorHandlers: CallbackHandler[] = [];
  private requestHeadersHandler?: RequestHeadersHandler;
  private configureAgentHandler?: ConfigureAgentHandler;
  private configureRequestHandler?: ConfigureRequestHandler;

  constructor(domain?: string, private logger?: Logger) {
    if (domain) {
      this.domain = domain;
    }
  }

  getDomain() {
    return this.domain;
  }

  addErrorHandler(handler: CallbackHandler) {
    this.errorHandlers.push(handler);
  }

  setRequestHeadersHandler(handler: RequestHeadersHandler) {
    this.requestHeadersHandler = handler;
  }

  setConfigureAgentHandler(handler: ConfigureAgentHandler) {
    this.configureAgentHandler = handler;
  }

  setConfigureRequestHandler(handler: ConfigureRequestHandler) {
    this.configureRequestHandler = handler;
  }

  private request(
    method: string,
    url: string,
    body: any,
    headers: RequestHeaders,
    queryParameters: QueryParameters,
    form: any,
    reject: CallbackHandler,
    resolve: CallbackHandler,
    opts: CommonRequestOptions
  ) {
    if (this.logger) {
      this.logger.log(`Call ${method} ${url}`);
    }

    const agent = this.configureAgentHandler
      ? this.configureAgentHandler(request.default)
      : request.default;

    let req = agent(method, url);
    if (this.configureRequestHandler) {
      req = this.configureRequestHandler(req);
    }

    req = req.query(queryParameters);

    if (this.requestHeadersHandler) {
      headers = this.requestHeadersHandler({
        ...headers
      });
    }

    req.set(headers);

    if (body) {
      req.send(body);

      if (typeof body === "object" && !(body.constructor.name === "Buffer")) {
        headers["content-type"] = "application/json";
      }
    }

    if (Object.keys(form).length > 0) {
      req.type("form");
      req.send(form);
    }

    if (opts.$retries && opts.$retries > 0) {
      req.retry(opts.$retries);
    }

    if (
      (opts.$timeout && opts.$timeout > 0) ||
      (opts.$deadline && opts.$deadline > 0)
    ) {
      req.timeout({
        deadline: opts.$deadline,
        response: opts.$timeout
      });
    }

    req.end((error, response) => {
      // an error will also be emitted for a 4xx and 5xx status code
      // the error object will then have error.status and error.response fields
      // see superagent error handling: https://github.com/visionmedia/superagent/blob/master/docs/index.md#error-handling
      if (error) {
        reject(error);
        this.errorHandlers.forEach(handler => handler(error));
      } else {
        resolve(response);
      }
    });
  }

  private convertParameterCollectionFormat<T>(
    param: T,
    collectionFormat: string | undefined
  ): T | string {
    if (Array.isArray(param) && param.length >= 2) {
      switch (collectionFormat) {
        case "csv":
          return param.join(",");
        case "ssv":
          return param.join(" ");
        case "tsv":
          return param.join("\t");
        case "pipes":
          return param.join("|");
        default:
          return param;
      }
    }

    return param;
  }

  searchInventoryURL(
    parameters: {
      searchString?: string;
      skip: number;
      filter?: Array<"type_1" | "type_2" | "type_3">;
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/response_is_json";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    if (parameters["searchString"] !== undefined) {
      queryParameters["searchString"] = this.convertParameterCollectionFormat(
        parameters["searchString"],
        ""
      );
    }

    if (parameters["skip"] !== undefined) {
      queryParameters["skip"] = this.convertParameterCollectionFormat(
        parameters["skip"],
        ""
      );
    }

    if (parameters["filter"] !== undefined) {
      queryParameters["filter"] = this.convertParameterCollectionFormat(
        parameters["filter"],
        "multi"
      );
    }

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
    * 返回json数据类型的示例, 参数含有数组类型

    * @method
    * @name Pulsar#searchInventory
         * @param {string} searchString - 这是个可选的string类型
         * @param {integer} skip - 这个是必须选的int类型, 最小是0
         * @param {array} filter - 可选的string数组类型
    */
  searchInventory(
    parameters: {
      searchString?: string;
      skip: number;
      filter?: Array<"type_1" | "type_2" | "type_3">;
    } & CommonRequestOptions
  ): Promise<
    | ResponseWithBody<200, Response_searchInventory_200>
    | ResponseWithBody<400, void>
    | ResponseWithBody<number, inline_response_default>
  > {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/response_is_json";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["accept"] = "application/json, text/plain; charset=utf-8";

      if (parameters["searchString"] !== undefined) {
        queryParameters["searchString"] = this.convertParameterCollectionFormat(
          parameters["searchString"],
          ""
        );
      }

      if (parameters["skip"] !== undefined) {
        queryParameters["skip"] = this.convertParameterCollectionFormat(
          parameters["skip"],
          ""
        );
      }

      if (parameters["skip"] === undefined) {
        reject(new Error("Missing required  parameter: skip"));
        return;
      }

      if (parameters["filter"] !== undefined) {
        queryParameters["filter"] = this.convertParameterCollectionFormat(
          parameters["filter"],
          "multi"
        );
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      this.request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }

  addInventoryURL(
    parameters: {
      inventoryItem?: InventoryItem;
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/response_is_json";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    queryParameters = {};

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * Adds an item to the system
   * @method
   * @name Pulsar#addInventory
   * @param {} inventoryItem - Inventory item to add
   */
  addInventory(
    parameters: {
      inventoryItem?: InventoryItem;
    } & CommonRequestOptions
  ): Promise<
    | ResponseWithBody<201, void>
    | ResponseWithBody<400, void>
    | ResponseWithBody<409, void>
  > {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/response_is_json";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["accept"] = "application/json";
      headers["content-type"] = "application/json";

      if (parameters["inventoryItem"] !== undefined) {
        body = parameters["inventoryItem"];
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      form = queryParameters;
      queryParameters = {};

      this.request(
        "POST",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }

  getUserInfoURL(
    parameters: {
      id: string;
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/user/{id}";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    path = path.replace(
      "{id}",
      `${encodeURIComponent(
        this.convertParameterCollectionFormat(parameters["id"], "").toString()
      )}`
    );

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * 返回用户信息
   * @method
   * @name Pulsar#getUserInfo
   * @param {string} id - This is a sample APIs
   */
  getUserInfo(
    parameters: {
      id: string;
    } & CommonRequestOptions
  ): Promise<ResponseWithBody<200, inline_response_200>> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/user/{id}";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["accept"] = "application/json, application/xml";

      path = path.replace(
        "{id}",
        `${encodeURIComponent(
          this.convertParameterCollectionFormat(parameters["id"], "").toString()
        )}`
      );

      if (parameters["id"] === undefined) {
        reject(new Error("Missing required  parameter: id"));
        return;
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      this.request(
        "GET",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }

  deleteUserByIdByOrderIdURL(
    parameters: {
      id: string;
      orderId: string;
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/user/{id}/{order_id}";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    path = path.replace(
      "{id}",
      `${encodeURIComponent(
        this.convertParameterCollectionFormat(parameters["id"], "").toString()
      )}`
    );

    path = path.replace(
      "{order_id}",
      `${encodeURIComponent(
        this.convertParameterCollectionFormat(
          parameters["orderId"],
          ""
        ).toString()
      )}`
    );

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * 删除订单
   * @method
   * @name Pulsar#deleteUserByIdByOrderId
   * @param {string} id - This is a sample APIs
   * @param {string} orderId - This is a sample APIs
   */
  deleteUserByIdByOrderId(
    parameters: {
      id: string;
      orderId: string;
    } & CommonRequestOptions
  ): Promise<ResponseWithBody<200, inline_response_200_1>> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/user/{id}/{order_id}";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["accept"] = "application/json, application/xml";

      path = path.replace(
        "{id}",
        `${encodeURIComponent(
          this.convertParameterCollectionFormat(parameters["id"], "").toString()
        )}`
      );

      if (parameters["id"] === undefined) {
        reject(new Error("Missing required  parameter: id"));
        return;
      }

      path = path.replace(
        "{order_id}",
        `${encodeURIComponent(
          this.convertParameterCollectionFormat(
            parameters["orderId"],
            ""
          ).toString()
        )}`
      );

      if (parameters["orderId"] === undefined) {
        reject(new Error("Missing required  parameter: orderId"));
        return;
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      this.request(
        "DELETE",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }

  postByFolderIdUploadFileURL(
    parameters: {
      folderId: string;
      name: string;
      file?: {};
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/{folder_id}/upload_file";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    path = path.replace(
      "{folder_id}",
      `${encodeURIComponent(
        this.convertParameterCollectionFormat(
          parameters["folderId"],
          ""
        ).toString()
      )}`
    );

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    queryParameters = {};

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * 上传文件
   * @method
   * @name Pulsar#postByFolderIdUploadFile
   * @param {string} folderId - This is a sample APIs
   * @param {string} name - This is a sample APIs
   * @param {file} file - This is a sample APIs
   */
  postByFolderIdUploadFile(
    parameters: {
      folderId: string;
      name: string;
      file?: {};
    } & CommonRequestOptions
  ): Promise<ResponseWithBody<200, inline_response_200_2>> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/{folder_id}/upload_file";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["accept"] = "application/json";
      headers["content-type"] = "multipart/form-data";

      path = path.replace(
        "{folder_id}",
        `${encodeURIComponent(
          this.convertParameterCollectionFormat(
            parameters["folderId"],
            ""
          ).toString()
        )}`
      );

      if (parameters["folderId"] === undefined) {
        reject(new Error("Missing required  parameter: folderId"));
        return;
      }

      if (parameters["name"] !== undefined) {
        form["name"] = parameters["name"];
      }

      if (parameters["name"] === undefined) {
        reject(new Error("Missing required  parameter: name"));
        return;
      }

      if (parameters["file"] !== undefined) {
        form["file"] = parameters["file"];
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      form = queryParameters;
      queryParameters = {};

      this.request(
        "POST",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }

  putUserURL(
    parameters: {
      name: string;
      gender: 0 | 1;
      description?: string;
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/user";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * put form_data
   * @method
   * @name Pulsar#putUser
   * @param {string} name - This is a sample APIs
   * @param {number} gender - This is a sample APIs
   * @param {string} description - This is a sample APIs
   */
  putUser(
    parameters: {
      name: string;
      gender: 0 | 1;
      description?: string;
    } & CommonRequestOptions
  ): Promise<ResponseWithBody<200, void>> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/user";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["accept"] = "application/json";
      headers["content-type"] = "application/x-www-form-urlencoded";

      if (parameters["name"] !== undefined) {
        form["name"] = parameters["name"];
      }

      if (parameters["name"] === undefined) {
        reject(new Error("Missing required  parameter: name"));
        return;
      }

      if (parameters["gender"] !== undefined) {
        form["gender"] = parameters["gender"];
      }

      if (parameters["gender"] === undefined) {
        reject(new Error("Missing required  parameter: gender"));
        return;
      }

      if (parameters["description"] !== undefined) {
        form["description"] = parameters["description"];
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      this.request(
        "PUT",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }

  postTextPlainURL(
    parameters: {
      body?: string;
    } & CommonRequestOptions
  ): string {
    let queryParameters: QueryParameters = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/text_plain";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    if (parameters.$queryParameters) {
      queryParameters = {
        ...queryParameters,
        ...parameters.$queryParameters
      };
    }

    queryParameters = {};

    let keys = Object.keys(queryParameters);
    return (
      domain +
      path +
      (keys.length > 0
        ? "?" +
          keys
            .map(key => key + "=" + encodeURIComponent(queryParameters[key]))
            .join("&")
        : "")
    );
  }

  /**
   * 纯文本 post, 比如含有sql的json数据, base64编码之后
   * @method
   * @name Pulsar#postTextPlain
   * @param {} body - This is a sample APIs
   */
  postTextPlain(
    parameters: {
      body?: string;
    } & CommonRequestOptions
  ): Promise<ResponseWithBody<200, void>> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = "/text_plain";
    if (parameters.$path) {
      path =
        typeof parameters.$path === "function"
          ? parameters.$path(path)
          : parameters.$path;
    }

    let body: any;
    let queryParameters: QueryParameters = {};
    let headers: RequestHeaders = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
      headers["content-type"] = "text/plain";

      if (parameters["body"] !== undefined) {
        body = parameters["body"];
      }

      if (parameters.$queryParameters) {
        queryParameters = {
          ...queryParameters,
          ...parameters.$queryParameters
        };
      }

      form = queryParameters;
      queryParameters = {};

      this.request(
        "POST",
        domain + path,
        body,
        headers,
        queryParameters,
        form,
        reject,
        resolve,
        parameters
      );
    });
  }
}

export default Pulsar;
