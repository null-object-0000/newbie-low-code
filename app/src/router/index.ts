import { createRouter, createWebHistory } from 'vue-router'
import EditView from '../views/EditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'edit',
      component: EditView,
    }
  ],
})

export default router
