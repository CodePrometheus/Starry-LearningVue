<script>
import GoTop from '@/components/goTop/GoTop.vue'
import Comment from '@/components/comment/Comment.vue'
import Lyrics from '@/components/lyrics/Lyrics.vue'

let timer

export default {
  components: { GoTop, Comment, Lyrics },
  data() {
    return {
      isMusicDetailShow: false,
      //   歌词
      lyric: [[0, '正在加载歌词']],
      page: 1,
      comment: {},
      musicInfo: {},
      // 是否删除卡片渲染的内容
      cleanCard: true,
      // 背景显示模式  true为白色渐变背景  false为毛玻璃背景
      backgroundMode: true,
      // 评论是否在加载中
      isCommentLoading: false,
      // 热门评论
      hotComments: [],
    }
  },
  watch: {
    '$store.state.isMusicDetailShow'(isMusicDetailShow) {
      console.log('isMusicDetailShow: ', isMusicDetailShow)
      this.isMusicDetailShow = isMusicDetailShow
      // 删除定时器 避免用户在关闭卡片的1s内又打开卡片 导致展示内容被删除
      // 如果卡片没有展示就不发送请求和渲染里面的内容
      clearTimeout(timer)
      this.cleanCard = false
      console.log('url: ', this.$store.state.musicId)
      if (isMusicDetailShow && !this.comment.comments && this.$store.state.musicId !== '') {
        this.getLyric(this.$store.state.musicId)
        this.getComment(this.$store.state.musicId)
      } else if (isMusicDetailShow === false) {
        // 当卡片关闭时 延迟 3s再删除里面渲染的内容
        timer = setTimeout(() => {
          this.cleanCard = true
        }, 3000)
      }
    },
    '$store.state.musicId'(musicId) {
      this.lyric = [[0, '正在加载歌词']]
      this.page = 1
      this.musicInfo = this.$store.state.musicList[this.$store.state.currentIndex]
      this.comment = {}
      if (this.isMusicDetailShow) {
        this.getLyric(musicId)
        this.getComment(musicId)
      }
    },
  },
  methods: {
    // 歌词数据
    async getLyric(id) {
      let res = await this.$request('/lyric', { id })
      let lyric = res.data.lrc.lyric
      let arr = lyric.split('\n')
      let array = []
      let time = ''
      let value = ''
      let ret = []
      // 去除空行
      arr.forEach(v => {
        if (v !== '') {
          array.push(v)
        }
      })
      arr = array
      arr.forEach(v => {
        time = v.split(']')[0]
        value = v.split(']')[1]
        let t = time.slice(1).split(':')
        ret.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
      })
      this.lyric = ret
    },
    async getComment(id, type) {
      let timestamp = Date.parse(new Date())
      this.isCommentLoading = true
      if (type === 'changePage') {
        let detailMain = document.querySelector('.detail-main')
        let top = document.querySelector('.top')
        detailMain.scrollTo({
          behavior: 'smooth',
          top: top.clientHeight,
        })
      }
      // 页数为第一页时，请求10条热门数据
      if (this.page === 1) {
        let res = await this.$request("/comment/hot", {
          id,
          limit: 10,
          type: 0,
          timestamp
        })
        if (res.data.code !== 200) {
          this.$message.error("获取热门评论失败,请稍后重试!")
          return
        }
        this.hotComments = res.data.hotComments
      }
      // 歌曲评论
      let res = await this.$request("/comment/music", {
        id,
        offset: (this.page - 1) * 20,
        timestamp
      })
      if (res.data.code !== 200) {
        this.$message.error("获取评论失败,请稍后重试!")
      }
      this.isCommentLoading = false
      this.comment = res.data
    },
    closeCard() {
      this.$store.commit("changeMusicDetailState")
    },
    changeBackground() {
      this.backgroundMode = !this.backgroundMode
    },
    goDetail(name, id) {
      this.$router.push({ name, params: { id } })
      this.$store.commit("changeMusicDetailState", false)
    },
    changePage(page) {
      this.page = page
      this.getComment(this.$store.state.musicId, 'changePage')
    }
  }
}
</script>

<template>
  <div
    class="detail-card"
    :class="[isMusicDetailShow ? '' : 'hide', backgroundMode ? '' : 'glass-card']"
  >
    <div class="close-card" @click="closeCard">
      <i class="iconfont icon-arrow-down-bold"/>
    </div>
    <div class="change-back" @click="changeBackground">
      <i class="iconfont icon-UniSetBackgroundTextStyle"/>
    </div>
    <div class="detail-main" v-if="!cleanCard && musicInfo.name">
      <div class="top">
        <div class="left">
          <div class="disc-container">
            <div class="needle" :class="$store.state.isPlay ? 'needle-rotate' : ''" ref="needle">
              <img src="../../assets/img/MusicDetailCard/needle.png" :draggable="false"/>
            </div>
            <div
              class="disc"
              :class="[$store.state.isPlay ? '' : 'pause',
                       $store.state.isMusicLoad ? '' : 'disc-animation']"
              ref="disc"
            >
              <img src="../../assets/img/MusicDetailCard/disc.png" :draggable="false"/>
              <img src="../../assets/img/test.jpg" class="avatar" v-if="!musicInfo.al" :draggable="false"/>
              <img :src="musicInfo.al.picUrl" class="avatar" v-else :draggable="false"/>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <div class="music-name">{{ musicInfo.name }}</div>
            <div class="album" @click="goDetail('album', musicInfo.al.id)">
              {{ musicInfo.al.name }}
            </div>
            <div class="singer" @click="goDetail('singer-detail', musicInfo.ar[0].id)">
              {{ musicInfo.ar[0].name }}
            </div>
          </div>
          <lyrics :lyric="lyric"></lyrics>
        </div>
      </div>
      <div class="bottom" v-loading="isCommentLoading" element-loading-background="rgba(255, 255, 255, 0.1)">
        <comment
          :comments="hotComments"
          :commentType="'music'"
          :commentId="$store.state.musicId + ''"
          :musicTitle="musicInfo.name"
          @getComment="getComment($store.state.musicId)"
          v-if="page === 1"
          class="comment-main"
        >
          <div slot="title">热门评论</div>
        </comment>
        <comment
          :comments="comment.comments"
          :commentType="'music'"
          :commentId="$store.state.musicId + ''"
          :musicTitle="musicInfo.name"
          @getComment="getComment($store.state.musicId)"
          class="comment-main"
        >
          <div slot="title">最新评论({{ comment.total }})</div>
        </comment>
        <div class="page" v-show="comment.comments && comment.comments[0]">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="comment.total"
            small
            :page-size="20"
            :current-page="page"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
      <go-top scroll=".detail-main"/>
    </div>
    <div v-else class="tip">暂无播放音乐</div>
  </div>
</template>

<style scoped lang="less">
.detail-card {
  position: fixed;
  width: 100%;
  height: calc(100vh - 50px);
  bottom: 55px;
  left: 0;
  z-index: 1000;
  transition: bottom 0.5s ease;
  border-color: white;
  background-image: linear-gradient(to bottom, #e3e2e3, white);
}

.close-card .iconfont {
  position: absolute;
  top: 20px;
  left: 40px;
  font-size: 24px !important;
}

.change-back .iconfont {
  position: absolute;
  bottom: 25px;
  right: 20px;
  cursor: pointer;
  font-size: 24px !important;
}

.detail-main {
  height: 100%;
  overflow-y: scroll;
}

.hide {
  bottom: calc(-100vh + 50px);
}

.glass-card {
  backdrop-filter: blur(50px) brightness(95%) !important;
  border-color: unset !important;
  background-image: unset !important;
  * {
    color: rgb(37, 37, 37);
    .comment-main /deep/ * {
      color: rgb(37, 37, 37);
      border-color: rgb(143, 143, 143);

      .replied {
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.top {
  display: flex;
  justify-content: center;
}

.left {
  width: 250px;
  margin: 0 30px 0 -60px;
}

.disc-container {
  margin-top: 60px;
  width: 240px;
  position: relative;
}

.needle {
  position: relative;
  left: 50%;
  width: 100px;
  height: 90px;
  z-index: 1000;
  transition: all 1s;
  /** 更改一个元素变形的原点 */
  transform-origin: 5px 5px;
}

.needle img {
  width: 100%;
}

.needle-rotate {
  transform-origin: 5px 5px;
  /** 旋转 */
  transform: rotate(25deg);
}

.disc {
  width: 280px;
  height: 280px;
  position: relative;
  top: -10px;
}

.disc img:nth-child(1) {
  width: 100%;
}

.disc .avatar {
  position: absolute;
  top: 40px;
  left: 45px;
  width: 194px;
  /** 堆叠 使用负值降低优先级 */
  z-index: -1;
}

.disc-animation {
  /** infinite无限次重复动画 */
  animation: disc 25s linear infinite;
  /** 动画延迟 */
  animation-delay: 0.8s;
}

@keyframes disc {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pause {
  /** 允许暂停和恢复动画 */
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}

.right {
  width: 350px;
  margin-left: 50px;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 14px;
  margin: 50px 0 0 55px;
  color: rgb(145, 145, 145);
}

.title div {
  margin: 10px 0;
}

.music-name {
  font-size: 26px;
  color: rgb(22, 22, 22);
}

.album, .singer {
  cursor: pointer;
}

.tip {
  font-size: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.bottom {
  margin: 40px auto;
  width: 65vw;
}

.bottom /deep/ .el-loading-spinner {
  top: 40px;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
</style>