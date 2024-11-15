import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AboutView from '../views/AboutView.vue';
import TourView from '../views/TourView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/Tour',
    name: 'Tour',
    component: TourView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;