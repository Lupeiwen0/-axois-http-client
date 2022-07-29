import { MockMethod } from "vite-plugin-mock";

// 返回参数类型定义
export interface requestParams {
  method: string;
  body: any;
  headers?: { authorization?: string };
  query: any;
}

// 返回统一格式的接口数据类型定义
export function successResult<T>(data: T, { message = "Request success" } = {}) {
  return {
    code: 20000,
    data,
    message,
    status: "ok",
  };
}

export function createFakeUserList() {
  return [
    {
      user_id: "3306",
      user_name: "blindmonk",
      real_name: "扫地盲僧",
      avatar: "https://api.multiavatar.com/blindmonk.svg",
      desc: "达摩深寺扫地僧，盲崖盘坐思人生",
      password: "blindmonk",
      token: "P1DeqWBao0HTU47Q",
      organization: "某大型公司CTO",
      location: "中国",
      email: "896226896@qq.com",
      auths: [],
      is_admin: 1,
      dev_languages: "JavaScript/Vue/React/Node/PHP",
      blog_github: "https://github.com/MaleWeb",
      blog_juejin: "https://juejin.cn/user/3016715636842622",
      blog_zhihu: "https://www.zhihu.com/people/blind_monk",
      role: "admin",
    },
  ];
}
export default [
  {
    url: "/user/profile",
    timeout: 200,
    method: "get",
    response: (request: requestParams) => {
      const checkUser = createFakeUserList();
      return successResult(checkUser);
    },
  },
] as MockMethod[];
