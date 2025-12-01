import { type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'getStart',
    component: () => import('@/pages/getStart/index.vue'),
    meta: {},
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      layout: 'routeHistory',
    },
  },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: () => import("@/pages/login/LogIn.vue"),
  //   meta: {
  //     title: "登录",
  //   },
  // },
  // {
  //   path: "/:pathMatch(.*)",
  //   name: "notFound",
  //   component: () => import("@/pages/404/NotFound.tsx"),
  //   meta: {
  //     title: "页面不存在",
  //   },
  // },
]
