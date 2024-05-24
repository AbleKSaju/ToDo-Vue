import { createRouter, createWebHistory } from 'vue-router';
import Todo from '../views/Todo.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Todo',
    component: Todo,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
