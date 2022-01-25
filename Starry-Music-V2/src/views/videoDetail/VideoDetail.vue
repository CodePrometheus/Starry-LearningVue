<script>
import GoTop from '@/components/goTop/GoTop.vue'
import { formatDate, handleMusicTime, handleNum } from '../../plugins/utils'

export default {
  components: { GoTop },
  async created() {
    await this.getRelatedVideo()
    if (this.$route.params.type === 'mv') {
      await this.getMvDetail()
      await this.getMvUrl()
    } else {
    }
  },
  data() {
    return {
      videoInfo: {},
      videoUrl: '',
      relatedVideo: [],
      isLike: false,
      isCollect: false
    }
  },
  methods: {
    async getMvDetail() {
      console.log("this.$route.params.id: ", this.$route.params.id);
      let res = await this.$request('/mv/detail', {
        mvid: this.$route.params.id
      })
      console.log("getMvDetail: ", res);
      this.videoInfo = res.data.data
    },
    async getMvUrl() {
      let res = await this.$request('/mv/url', {
        id: this.$route.params.id
      })
      this.videoUrl = res.data.data.url
    },
    playVideo() {},
    personal() {},
    async getRelatedVideo() {
      let res = await this.$request('/related/allvideo', {
        id: this.$route.params.id
      })
      this.relatedVideo = res.data.data
    },
    likeVideo() {

    },
    collectVideo() {

    },
    goRelatedVideo(id) {

    }
  },
  filters: {
    showData(value) {
      const date = new Date(value)
      return formatDate(date, "yyyy-MM-dd")
    },
    handleNum, handleMusicTime
  }
}
</script>

<template>
  <div class="video-detail" v-if="videoUrl">
    <div class="left">
      <div class="title">
        {{ $route.params.type === 'mv' ? "mv详情" : "视频详情" }}
      </div>
      <video
        class="player"
        :src="videoUrl"
        controls
        width="535px"
        height="300px"
        @play="playVideo"
        :poster="$route.params.type === 'mv' ? videoInfo.cover : videoInfo.coverUrl"
      />
      <div
        class="video-info"
        v-if="$route.params.type === 'mv' ? videoInfo.cover : videoInfo.coverUrl"
      >
        <div class="user">
          <div class="avatar">
            <img
              @click="personal()"
              :draggable="false"
              :src="($route.params.type === 'mv' ? videoInfo.artists[0].img1v1Url : videoInfo.avatarUrl) + '?param=100y100'"
            />
          </div>
          <div class="user-name" @click="personal()">
            {{ $route.params.type === 'mv' ? videoInfo.artists[0].name : videoInfo.creator.nickname }}
          </div>
        </div>
        <div class="video-title">
          {{ $route.params.type === 'mv' ? videoInfo.name : videoInfo.title }}
        </div>
        <div class="other-info">
          <div>
            发布 : {{ $route.params.type === 'mv' ? videoInfo.publishTime : videoInfo.publishTime | showDate }}
          </div>
          <div>
            播放 : {{ ($route.params.type === 'mv' ? videoInfo.playCount : videoInfo.playTime) | handleNum }}
          </div>
        </div>
        <div class="buttons">
          <div class="button-item" @click="likeVideo">
            <i class="iconfont icon-good" :class="isLike ? 'red' : ''" />
            {{ isLike ? "已赞" : "赞" }}
          </div>
          <div class="button-item" @click="collectVideo">
            <i class="iconfont icon-xihuan" :class="isCollect ? 'res' : ''" />
            {{ isCollect ? "已收藏" : "收藏" }}
          </div>
          <div class="button-item">
            <i class="iconfont icon-zhuanfa" /> 分享
          </div>
        </div>
      </div>
    </div>
    <div class="right" v-if="relatedVideo.length !== 0">
      <div class="title">相关推荐</div>
      <div
        class="related-item"
        v-for="(v, idx) in relatedVideo"
        :key="idx"
        @click="goRelatedVideo(v.vid)"
      >
        <div class="related-item-cover">
          <img :src="v.coverUrl + '?param=300y180'" :draggable="false" />
          <div class="player-count">
            <i class="iconfont icon-shipin" /> {{ v.playTime | handleNum }}
          </div>
          <div class="player-time">
            {{ v.durationms | handleMusicTime }}
          </div>
        </div>
        <div class="player-info">
          <div class="player-title">{{ v.title }}</div>
          <div class="creator">by {{ v.creator[0].userName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-detail {
  display: flex;
  justify-content: center;
  height: calc(100% - 80px);
  overflow-y: hidden;
}

.video-detail >>> .el-loading-spinner {
  top: 40px;
}

.player {
  background-color: black;
}

.red {
  color: #ec4141;
}

.left {
  width: calc(100% - 50vw)
}

.right {
  margin-left: 10px;
}

.related-item {
  display: flex;
  margin-bottom: 10px;
  cursor: pointer;
}

.related-item-cover {
  position: relative;
  margin-right: 8px;
}

.related-item-cover img {
  width: 200px;
  height: 130px;
  border-radius: 20px;
}

.player-count {
  position: absolute;
  top: 4px;
  right: 8px;
  color: white;
  transform: scale(0.9);
}

.player-time {
  position: absolute;
  bottom: 8px;
  right: 8px;
  color: white;
  transform: scale(0.9);
}

.player-info {
  font-size: 14px;
  color: rgb(31, 31, 31);
  margin: 18px 2px;
  width: 200px;
}

.player-title {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.creator {
  color: rgb(156, 156, 156);
  margin-top: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: scale(0.9) translateX(-5%);
}

.title {
  font-weight: 700;
  margin: 20px 0;
  color: black;
  font-size: 24px;
}

.user {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.avatar {
  width: 50px;
  height: 50px;
}

.avatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.user-name {
  margin-left: 20px;
  font-size: 18px;
  color: rgb(36, 36, 36);
  cursor: pointer;
}

.video-title {
  color: #1b1b1b;
  font-size: 24px;
  margin: 20px 0 10px;
  font-weight: bold;
}

.other-info {
  display: flex;
  align-items: center;
  color: #aaa;
}

.other-info div {
  margin-right: 20px;
  transform: scale(0.9) translateX(-5%);
}

.buttons {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin: 20px 0;
  color: #252525;
}

.button-item {
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  margin: 10px 10px 0;
  padding: 5px 20px;
}

.button-item i {
  margin-right: 5px;
  font-size: 12px;
}
</style>