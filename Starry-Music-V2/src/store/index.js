import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLogin: false,
  // 音乐的id
  musicId: '',
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
  // 音乐是否在加载中
  isMusicLoad: false,
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
  // 已喜欢的视频
  likeVideoList: null,
  // 在歌手详情保存的上一首歌曲信息
  currentRowInfo: {},
  // 要下载的音乐信息
  downloadMusicInfo: {
    name: '',
    url: '',
  },
}

const store = new Vuex.Store({
  state,
  actions: {},
  mutations: {
    updateLoginState(state, flag) {
      state.isLogin = flag
    },
    // 更新音乐id
    updateMusicId(state, id) {
      state.musicId = id
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
    updateCollectedVideo(state, collectedVideo) {
      state.collectedVideo = collectedVideo
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
    updateDownloadMusicInfo(state, info) {
      state.downloadMusicInfo = info
    },
    // 更新已喜欢的视频列表
    updateLikeVideoList(state, list) {
      state.likeVideoList = list
    },
    // 用于记录当前播放行的信息 便于下次渲染和清除播放样式
    updateCurrentRowInfo(state, currentRowInfo) {
      state.currentRowInfo = currentRowInfo;
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
