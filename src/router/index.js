import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ListaView from "../views/ListaView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "lista",
      component: ListaView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    }
  ],
});

export default router;
