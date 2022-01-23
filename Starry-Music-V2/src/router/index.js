import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Index = () => import('../components/Index.vue')
const Discover = () => import('../views/discover/Discover.vue')
const Recommend = () =>
  import('../views/discover/discoverChildren/Recommend.vue')
const MusicList = () =>
  import('../views/discover/discoverChildren/MusicList.vue')
const MusicListItem = () =>
  import('../views/discover/discoverChildren/MusicListItem.vue')

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
        children: [
          {
            path: '/discover/recommend',
            component: Recommend,
          },
          {
            path: '/discover/music-list',
            component: MusicList,
            redirect: '/discover/music-list/music-item',
            children: [
              {
                path: '/discover/music-list/music-item',
                component: MusicListItem
              }
            ]
          },
        ],
      },
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
