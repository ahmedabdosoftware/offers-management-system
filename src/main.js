import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // Vuex (can be removed if you migrate fully to Pinia)
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";


import { configure } from "vee-validate";
// import * as yup from "yup";

import dayjs from "dayjs";

import { createPinia } from "pinia";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
  icons: {
    defaultSet: "mdi", 
  },
});


// VeeValidate global configuration
configure({
  validateOnInput: true,
});

const app = createApp(App);

// Global utilities
app.config.globalProperties.$dayjs = dayjs;

// State management
const pinia = createPinia();
app.use(pinia);
app.use(store);

app.use(router);
app.use(ArgonDashboard);
app.use(vuetify);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});
app.mount("#app");
