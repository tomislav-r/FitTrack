import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ClientDetailsView from '../views/ClientDetailsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/clients/:id',
    name: 'client-details',
    component: ClientDetailsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router