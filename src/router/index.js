// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import MenuPage from '../pages/MenuPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import BookingPage from  '../pages/BookingPage.vue'
import ReviewsPage from '../pages/ReviewsPage.vue'
import Cart from '../pages/Cart.vue'
import ChatPage from '../pages/ChatPage.vue'
import store from '../store'



const requireAdmin = (to, from, next) => {
  if (store.getters.isAdmin) {
    next()
  } else {
    next('/admin-login')
  }
}

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/menu', name: 'Menu', component: MenuPage },
  { path: '/admin', name: 'Admin', component: AdminPage },
  { path: '/booking', name: 'Booking', component: BookingPage},
  { path: '/reviews', name: 'Reviews', component: ReviewsPage},
 { path: '/cart', name: 'Cart', component: Cart },
 { path: '/chat', name: 'ChatPage', component: ChatPage },
 { path: '/admin-chat', name: 'AdminChat', component: () => import('../pages/AdminChat.vue')},
 {
  path: '/admin-login',
  name: 'AdminLogin',
  component: () => import('../pages/AdminLogin.vue')
},
{
  path: '/admin',
  name: 'AdminPage',
  component: () => import('../pages/AdminPage.vue'),
  beforeEnter: requireAdmin
},
{
  path: '/admin-chat',
  name: 'AdminChat',
  component: () => import('../pages/AdminChat.vue'),
  beforeEnter: requireAdmin
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
