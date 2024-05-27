import { createRouter, createWebHistory } from 'vue-router';
import Todo from '../views/Todo.vue';

const routes = [
  {
    path: '/',
    name: 'Todo',
    component: Todo,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
