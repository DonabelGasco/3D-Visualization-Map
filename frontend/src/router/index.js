import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AboutView from '../views/AboutView.vue';
import Tour from '../components/Tour.vue'; // Import Tour component

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
    path: '/tour', // Add route for Tour
    name: 'Tour',
    component: Tour
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;