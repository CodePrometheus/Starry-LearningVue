import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLogin: false,
  // 音乐的url
  musicUrl: '',
  // 当前播放歌单的id (route)
  musicListId: '',
  // 当前播放的歌单
  musicList: [],
  // 当前播放音乐的索引
  currentIndex: -1,
  // 用户喜欢的音乐列表
  likeMusicList: [],
  // 音乐的播放状态
  isPlay: false,
  // 已收藏的歌单
  collectMusicList: [],
  // 创建的歌单
  createdMusicList: [],
  // 已收藏的专辑
  collectedAlbum: null,
  // 已收藏的歌手
  collectedSinger: null,
  // 已收藏的video
  collectedVideo: null,
  // 音乐详情卡片的显隐
  isMusicDetailShow: false,
  // 音乐是否在加载中
  isLoad: false,
  // 实时播放时长
  currentTime: 0,
}

const store = new Vuex.Store({
  state,
  actions: {},
  mutations: {
    updateLoginState(state, flag) {
      state.isLogin = flag
    },
    // 更新音乐url
    updateMusicId(state, url) {
      state.musicUrl = url
    },
    // 更新歌单列表和歌单id
    updateMusicList(state, list) {
      if (list.musicListId !== state.musicListId) {
        state.musicListId = list.musicListId
        state.currentIndex = -1
      }
      state.musicList = list.musicList.slice(0)
    },
    updateLikeMusicList(state, list) {
      state.likeMusicList = list
    },
    updateCollectMusicList(state, collectMusicList) {
      state.collectMusicList = collectMusicList
    },
    updateCreatedMusicList(state, createdMusicList) {
      state.createdMusicList = createdMusicList
    },
    updateCollectedAlbum(state, collectedAlbum) {
      state.collectedAlbum = collectedAlbum
    },
    updateCollectedSinger(state, collectedSinger) {
      state.collectedSinger = collectedSinger
    },
    // 当前播放音乐的索引
    updateCurrentIdx(state, idx) {
      state.currentIndex = idx
    },
    updateMusicLoadState(state, isLoad) {
      state.isLoad = isLoad
    },
    updateCurrentTime(state, currentTime) {
      state.currentTime = currentTime
    },
    changeMusicDetailState(state) {
      state.isMusicDetailShow = !state.isMusicDetailShow
    },
    changePlayState(state, isPlay) {
      state.isPlay = isPlay
    }
  }
})

export default store
