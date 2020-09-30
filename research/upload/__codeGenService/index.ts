/**
 * 注意: 此文件是自动生成的, 请勿手动修改, 请配置eslint, tslint等校验去掉
 */

import request from "@/utils/request";

/** 获取oss对象存储上传的url */
export async function getApiModelingUploadGetUploadUrl(params: {
  /** 对象存储的key */
  object_key: string;
}): Promise<Upload.Response_getApiModelingUploadGetUploadUrl_200> {
  return request.get("/api/modeling/upload/get_upload_url", {
    params
  });
}

/** 下载oss文件 */
export async function getApiModelingUploadDownload(params: {
  /** 对象存储的oss文件url地址 */
  file_url: string;
}): Promise<Upload.void> {
  return request.get("/api/modeling/upload/download", {
    params
  });
}
