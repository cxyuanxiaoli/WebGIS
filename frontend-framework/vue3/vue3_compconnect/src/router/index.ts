import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/props",
    },
    {
      path: "/props",
      component: () => import("@/views/Props.vue"),
    },
    {
      path: "/custom-event",
      component: () => import("@/views/CustomEvent.vue"),
    },
    {
      path: "/mitt",
      component: () => import("@/views/Mitt.vue"),
    },
    {
      path: "/v-model",
      component: () => import("@/views/VModel.vue"),
    },
    {
      path: "/attrs",
      component: () => import("@/views/Attrs.vue"),
    },
    {
      path: "/refs-parent",
      component: () => import("@/views/RefsParent.vue"),
    },
    {
      path: "/provide-inject",
      component: () => import("@/views/ProvideInject.vue"),
    },
    {
      path: "/slot",
      component: () => import("@/views/Slot.vue"),
    },
  ],
});

export default router;
