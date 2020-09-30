/**
 * 注意: 此文件是自动生成的, 请勿手动修改, 请配置eslint, tslint等校验去掉
 */

import request from "@/utils/request";

/** 添加用户 */
export async function postApiUserAdd(
  data: user.post_api_user_add
): Promise<user.Response_postApiUserAdd_200> {
  return request.post("/api/user/add", {
    data
  });
}

/** 删除用户 */
export async function postApiUserDelete(
  data: undefined
): Promise<user.Response_postApiUserDelete_200> {
  return request.post("/api/user/delete", {
    data
  });
}

/** 禁用用户 */
export async function postApiUserDisable(
  data: undefined
): Promise<user.Response_postApiUserDisable_200> {
  return request.post("/api/user/disable", {
    data
  });
}

/** 获取用户基础信息 */
export async function getApiUserInfo(): Promise<
  user.Response_getApiUserInfo_200
> {
  return request.get("/api/user/info");
}

/** 用户资料 */
export async function getApiUserProfile(): Promise<
  user.Response_getApiUserProfile_200
> {
  return request.get("/api/user/profile");
}

/** 列出该用户所有项目 */
export async function getApiUserProjects(): Promise<
  user.Response_getApiUserProjects_200
> {
  return request.get("/api/user/projects");
}

/** 修改用户 */
export async function postApiUserUpdate(
  data: user.post_api_user_update
): Promise<user.Response_postApiUserUpdate_200> {
  return request.post("/api/user/update", {
    data
  });
}

/** 更新用户系统设置 */
export async function putApiUserUserSetting(
  data: user.put_api_user_user_setting
): Promise<user.Response_putApiUserUserSetting_200> {
  return request.put("/api/user/user_setting", {
    data
  });
}

/** 切换项目 */
export async function postApiUserSwitchProject(
  data: user.post_api_user_switch_project
): Promise<user.Response_postApiUserSwitchProject_200> {
  return request.post("/api/user/switch_project", {
    data
  });
}

/** 列出所有用户 */
export async function getApiUserList(params: {
  /** keyword */
  keyword: string;
  /** 页数 */
  page: string;
  /** 每页大小 */
  page_size: string;
  /** 根据项目过滤 */
  project_code: string;
  /** 根据角色过滤 */
  role_id: string;
  /** 排序，传参数示例: created_on ASC,name DESC */
  sorts?: string;
}): Promise<user.Response_getApiUserList_200> {
  return request.get("/api/user/list", {
    params
  });
}

/** 重置密码 */
export async function postApiUserResetPassword(
  data: undefined
): Promise<user.Response_postApiUserResetPassword_200> {
  return request.post("/api/user/reset_password", {
    data
  });
}
