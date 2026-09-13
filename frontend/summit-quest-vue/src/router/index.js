


import { createRouter, createWebHistory } from 'vue-router'

// Импортирај ги сите компоненти
//import Dashboard from '../views/Dashboard.vue'
import Trails from '../views/Trails.vue'
import ActiveTrail from '../views/ActiveTrail.vue'
import Quests from '../views/Quests.vue'
import Achievements from '../views/Achievements.vue'
import Community from '../views/Community.vue'
import EcoReports from '../views/EcoReports.vue'
import Profile from '../views/Profile.vue'
import GlobeMap from '../views/GlobeMap.vue'
import RoutePlanner from '../views/RoutePlanner.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Social from "../views/Social.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import { getCurrentUser } from '../services/storage'

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },

  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },

  { path: '/home', name: 'Home', component: Home },
  { path: '/explore', name: 'Explore', component: Explore },
  { path: '/trails', name: 'Trails', component: Trails },
  { path: '/map', name: 'Map', component: GlobeMap },
  { path: '/profile', name: 'Profile', component: Profile },
  {path: '/social', name: 'Social', component: Social },

  { path: '/trail/:id', name: 'TrailDetail', component: () => import('../components/TrailMap.vue') },

  { path: '/map/:id', name: 'ActiveTrail', component: ActiveTrail },
  { path: '/active-trail/:id', redirect: to => `/map/${to.params.id}` },

  //{ path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/quests', name: 'Quests', component: Quests },
  { path: '/achievements', name: 'Achievements', component: Achievements },
  { path: '/community', name: 'Community', component: Community },
  { path: '/eco', name: 'EcoReports', component: EcoReports },
  { path: '/globe', name: 'GlobeMap', component: GlobeMap },
  { path: '/route-planner', name: 'RoutePlanner', component: RoutePlanner },
  {path: '/collection/:id', name: 'CollectionDetail', component: () => import('../components/ExploreDetail.vue')},
  {path: '/category/:id', name: 'CategoryDetail', component: () => import('../components/ExploreDetail.vue')},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const publicRoutes = new Set(['Login', 'Signup', 'ForgotPassword'])
  if (!publicRoutes.has(to.name) && !getCurrentUser()) return { name: 'Login' }
})

export default router
