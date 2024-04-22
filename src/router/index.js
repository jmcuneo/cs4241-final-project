// router/index.js or router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/DashPage.vue';
import Login from '../pages/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
