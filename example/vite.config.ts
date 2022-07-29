import { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [vue()],
    server: {
      // proxy: {
      //   "/api": {
      //     target: "https://suggest.taobao.com",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(new RegExp("^/api"), ""),
      //   },
      // },
    },
  };
};
