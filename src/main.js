import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

import "papercss/dist/paper.min.css";

const socket = io("localhost:8000");

Vue.use(VueSocketIOExt, socket);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
