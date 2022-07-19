import { createRouter, createWebHistory } from 'vue-router'
import StartScreen from '../views/start-page.vue'
import Animals from '../views/animals-page.vue'
import AnimalDetails from '../views/animal-details-page.vue'
import Admin from '../views/admin-page.vue'

const routes = [
  {
    path: '/',
    name: 'StartScreen',
    component: StartScreen
  },
  {
    path: '/animals',
    name: 'Animals',
    component: Animals
  },
  {
    path: '/animal/:id',
    name: 'AnimalDetails',
    props: true,
    component: AnimalDetails
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
