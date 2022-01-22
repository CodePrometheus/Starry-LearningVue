import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Index = () => import('../components/Index.vue')
const Discover = () => import('../views/discover/Discover.vue')
const Recommend = () =>
  import('../views/discover/discoverChildren/Recommend.vue')

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    component: Index,
    redirect: '/discover',
    children: [
      {
        path: '/discover',
        component: Discover,
        redirect: '/discover/recommend',
        children: [{ path: '/discover/recommend', component: Recommend }],
      },
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
