import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./style/index.css";
const app = createApp(App);

app.use(router);

app.mount("#app");

Object.defineProperty(Set.prototype, "first", {
  value() {
    return this.values().next().value;
  },
});
