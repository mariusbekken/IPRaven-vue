import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/IndexView.vue'
import ToolsView from '@/views/ToolsView.vue'

// tool views
import PasswordGeneratorView from '@/views/tools/PasswordGeneratorView.vue'
import PasswordStrengthCheckerView from '@/views/tools/PasswordStrengthCheckerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/tools',
      name: 'tools',
      component: ToolsView,
    },
    {
      path: '/password-generator',
      name: 'password-generator',
      component: PasswordGeneratorView,
    },
    {
      path: '/password-strength-checker',
      name: 'password-strength-checker',
      component: PasswordStrengthCheckerView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
  ],
})

export default router
