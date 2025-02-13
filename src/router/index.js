import { createRouter, createWebHistory } from 'vue-router'

// Import des composants
import Home from '@/views/home/Home.vue'
import Game from '@/views/game/Game.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    // On attend un code de partie en paramètre, p. ex. "140125"
    path: '/:gameId',
    name: 'Game',
    component: Game
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
