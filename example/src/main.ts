import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { setupProdMockServer } from "../mock/index";

setupProdMockServer();

createApp(App).mount("#app");
