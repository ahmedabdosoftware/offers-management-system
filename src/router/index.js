import { createRouter, createWebHistory } from "vue-router";
import Offers from "../views/Offers.vue";

const routes = [
 
  {
    path: "/",
    name: "Offers",
    component: Offers,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
