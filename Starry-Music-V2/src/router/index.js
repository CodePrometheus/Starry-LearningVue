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
const Ranking = () =>
    import('../views/discover/discoverChildren/Ranking.vue')
const Singer = () =>
    import('../views/discover/discoverChildren/Singer.vue')
const Video = () =>
    import('../views/video/Video.vue')
const VideoList = () =>
    import('../views/video/videoChildren/VideoList.vue')
const MvList = () =>
    import('../views/video/videoChildren/MvList.vue')
const SingerDetail = () =>
    import('../views/singerDetail/SingerDetail.vue')
const VideoDetail = () =>
    import('../views/videoDetail/VideoDetail.vue')
const MusicListDetail = () =>
    import('../views/musicListDetail/MusicListDetail.vue')
const Personal = () =>
    import('../views/personal/Personal.vue')
const Favorites = () =>
    import('../views/favorites/Favorites.vue')
const FavoriteAlbum = () =>
    import('../views/favorites/favoritesChildren/FavoriteAlbum.vue')
const FavoriteSinger = () =>
    import('../views/favorites/favoritesChildren/FavoriteSinger.vue')
const FavoriteVideo = () =>
    import('../views/favorites/favoritesChildren/FavoriteVideo.vue')
const RecommendMusic = () =>
    import('../views/recommendMusic/RecommendMusic.vue')

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
          {
            path: '/discover/ranking',
            component: Ranking
          },
          {
            path: '/discover/singer',
            component: Singer
          }
        ],
      },
      {
        path: '/video', component: Video,
        redirect: '/video/video-list',
        children: [
          { path: '/video/video-list', component: VideoList },
          { path: '/video/mv-list', component: MvList },
        ]
      },
      {
        path: '/singer-detail/:id',
        name: 'singer-detail',
        component: SingerDetail
      },
      {
        path: '/video-detail/:id/:type',
        name: 'video-detail',
        component: VideoDetail
      },
      {
        path: '/music-list-detail/:id',
        name: 'music-list-detail',
        component: MusicListDetail
      },
      {
        path: '/personal/:uid',
        name: 'personal',
        component: Personal
      },
      {
        path: '/favorites',
        component: Favorites,
        children: [
          {
            path: "/favorites/album",
            component: FavoriteAlbum
          },
          {
            path: "/favorites/singer",
            component: FavoriteSinger
          },
          {
            path: "/favorites/video",
            component: FavoriteVideo
          }
        ]
      },
      {
        path: "/recommend-music",
        component: RecommendMusic
      }
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
