import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/IndexView.vue'
import ToolsView from '@/views/ToolsView.vue'

import PasswordGeneratorView from '@/views/tools/PasswordGeneratorView.vue'

const SITE_NAME = 'IPRaven'
const SITE_URL = 'https://ipraven.com'
const DEFAULT_TITLE = SITE_NAME + ' - Know your digital footprint'
const DEFAULT_DESCRIPTION = 'IPRaven shows your public IP address, geolocation, browser details, device information, network data, and all the information your browser sends to the web.'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      meta: {
        title : DEFAULT_TITLE,
        description : DEFAULT_DESCRIPTION,
        canonical : `${SITE_URL}/`,
      }
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
      meta: {
        title : SITE_NAME + ' - Password Generator Tool',
        description : 'Generate strong and secure passwords with IPRaven\'s Password Generator tool. Customize length and complexity to suit your security needs.',
        canonical : `${SITE_URL}/password-generator`,
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
  ],
})

function setMetaTag(name, content) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  if (!href) return
  let el = document.querySelector(`link[rel="canonical"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

router.afterEach((to) => {
  const title = to.meta?.title || DEFAULT_TITLE
  const description = to.meta?.description || DEFAULT_DESCRIPTION
  const canonical = to.meta?.canonical || `${SITE_URL}${to.path}`
  document.title = title
  setMetaTag('description', description)
  setCanonical(canonical)
})

export default router
