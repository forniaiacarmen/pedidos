import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import PedidoForm from '../components/PedidoForm.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/crear-pedido', component: PedidoForm },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
