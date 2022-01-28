<script>
import GoTop from '@/components/goTop/GoTop.vue'
import Comment from '@/components/comment/Comment.vue'
import { formatDate, handleMusicTime, handleNum } from '@/plugins/utils'

export default {
  components: { GoTop, Comment },
  async created() {
    await this.getRelatedVideo()
    if (this.$route.params.type === 'mv') {
      await this.getMvDetail()
      await this.getMvUrl()
      await this.getMvComment()
    } else {
      await this.getVideoDetail()
      await this.getVideoUrl()
      await this.getVideoComment()
    }
  },
  data() {
    return {
      videoInfo: {},
      videoUrl: '',
      relatedVideo: [],
      isLike: false,
      isCollect: false,
      isCommentLoading: false,
      comments: {},
      page: 1
    }
  },
  methods: {
    async getMvDetail() {
      let res = await this.$request('/mv/detail', {
        mvid: this.$route.params.id
      })
      this.videoInfo = res.data.data
    },
    async getMvUrl() {
      let res = await this.$request('/mv/url', {
        id: this.$route.params.id
      })
      this.videoUrl = res.data.data.url
    },
    async getMvComment(type) {
      // 不需要缓存结果的接口 , 可在请求 url 后面加一个时间戳参数使 url 不同
      let timestamp = Date.parse(new Date())
      this.isCommentLoading = true
      if (type === 'changePage') {
        this.scrollToComment()
      }
      let res = await this.$request('/comment/mv', {
        id: this.$route.params.id,
        offset: 20 * (this.page - 1),
        timestamp
      })
      if (res.data.code !== 200) {
        this.$message.error("获取评论失败,请稍后重试!")
        return
      }
      this.comments = res.data
      this.isCommentLoading = false
    },
    scrollToComment() {
      let videoDetail = document.querySelector(".video-detail")
      let commentTitle = document.querySelector('.comment-title')
      videoDetail.scrollTo({
        behavior: 'smooth',
        // 获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
        top: commentTitle.offsetTop - 70
      })
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
      this.$router.push({ name: 'video-detail', params: { id, type: 'video' }})
    },
    async getVideoComment(type) {
      let timestamp = Date.parse(new Date())
      this.isCommentLoading = true
      if (type === 'changePage') {
        let videoDetail = document.querySelector(".video-detail")
        let commentTitle = document.querySelector('.comment-title')
        videoDetail.scrollTo({
          behavior: 'smooth',
          top: commentTitle.offsetTop - 70
        })
      }
      let res = await this.$request('/comment/video', {
        id: this.$route.params.id,
        offset: 20 * (this.page - 1),
        timestamp
      })
      if (res.data.code !== 200) {
        this.$message.error("获取评论失败,请稍后重试!")
        return
      }
      this.comments = res.data
      this.isCommentLoading = false
    },
    async getVideoDetail() {
      let res = await this.$request('/video/detail', {
        id: this.$route.params.id
      })
      this.videoInfo = res.data.data
    },
    async getVideoUrl() {
      let res = await this.$request('/video/url', {
        id: this.$route.params.id
      })
      this.videoUrl = res.data.urls[0].url;
    },
    changePage(page) {
      this.page = page
      if (this.$route.params.type === 'mv') {
        this.getMvComment("changePage")
      } else if (this.$route.params.type === 'video') {
        this.getVideoComment("changePage")
      }
    }
  },
  filters: {
    showDate(value) {
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
      <div class="comment">
        <div class="title comment-title">评论</div>
        <div class="comment-list" v-loading="isCommentLoading">
          <comment
            :comments="comments.hotComments"
            v-if="comments.hotComments"
            :commentType="$route.params.type === 'mv' ? 'mv' : 'video'"
            :commentId="$route.params.id + ''"
            @getComment="$route.params.type === 'mv' ? getMvComment() : getVideoComment()"
            @scrollToComment="scrollToComment"
            ref="hotComments"
          >
            <div slot="title">精彩评论</div>
          </comment>
          <comment
            :comments="comments.comments"
            :commentType="$route.params.type === 'mv' ? 'mv' : 'video'"
            :commentId="$route.params.id + ''"
            :isHotComment="comments.hotComments ? false : true"
            @getComment="$route.params.type === 'mv' ? getMvComment() : getVideoComment()"
            @scrollToComment="scrollToComment"
            @transToHotComment="
              (info) =>
                $refs.hotComments.floorComment(info.commentId, info.nickName)"
          >
            <div slot="title">最新评论</div>
          </comment>
        </div>
        <div class="page">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="comments.total"
            small
            :page-size="20"
            :current-page="page"
            @current-change="changePage"
            />
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
  height: calc(100vh - 120px);
  overflow-y: scroll;
}

.video-detail >>>.el-loading-spinner {
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
  margin-left: 30px;
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

.page {
  width: 100%;
  padding-bottom: 20px;
  text-align: center;
}
</style>