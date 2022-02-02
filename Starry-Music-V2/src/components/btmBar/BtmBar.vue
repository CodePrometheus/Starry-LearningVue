<script>
import { handleMusicTime, returnSecond } from '@/plugins/utils'
let lastSecond = 0
// 总时长的秒数
let durationNum = 0
// 保存当前音量
let volumeSave = 0
// 当前音乐类型，用于下载
let musicType = ""

export default {
  filters: {
    handleMusicTime, returnSecond
  },
  data() {
    return {
      musicUrl: '',
      isUserLikeCurrentMusic: false,
      musicList: [],
      // 播放模式（顺序播放，随机播放）
      playType: 'order',
      musicDetail: {},
      // 当前播放时间位置
      currentTime: 0,
      // 进度条的位置
      timeProgress: 0,
      // 音量
      volume: 30,
      // 是否静音
      isMuted: false,
      // 音乐总时长
      duration: "00.00",
      // 播放列表
      drawer: false,
      // 当前音乐在列表中的下标
      currentMusicIdx: 0,
      // 抽屉是否被打开过（如果没打开过，里面的数据是不会渲染的）
      hasDrawerOpened: false,
      // 当前用户喜欢的音乐列表
      likeMusicList: []
    }
  },
  watch: {
    "$store.state.musicUrl"(url) {
      this.pauseMusic()
      this.musicList = this.$store.state.musicList
      this.getMusicDetailFromMusicList()
      this.getMusicDetail(url)
      durationNum = returnSecond(this.duration)
      this.getIsUserLikeCurrentMusic()
    },
    "$store.state.currentIndex"(currentIdx, lastIdx) {
      if (this.hasDrawerOpened) {
        this.handleDrawerListDOM(currentIdx, lastIdx)
      }
    },
    "$store.state.isPlay"(isPlay) {
      if (isPlay) {
        this.playMusic()
      } else {
        this.pauseMusic()
      }
    },
    "$store.state.isLogin"(current) {
      if (current) {
        this.getLikeMusicList()
      } else {
        this.likeMusicList = []
      }
    }
  },
  methods: {
    getMusicDetailFromMusicList() {
      let idx = this.musicList.findIndex(v => v.id === this.$store.state.musicUrl)
      if (idx !== -1) {
        this.currentMusicIdx = idx
        this.$store.commit("updateCurrentIdx", idx)
        this.musicDetail = this.musicList[idx]
        this.duration = this.musicList[idx].dt
      }
    },
    async getMusicDetail(id) {
      this.$store.commit("updateMusicLoadState", true)
      let res = await this.$request("/song/url",  { id })
      if (res.data.data[0].url == null) {
        this.$message.error("该歌曲暂无版权，将为您播放下一首歌曲")
        this.changeMusic("next")
        return
      }
      this.musicUrl = res.data.data[0].url
      musicType = res.data.data[0].type.toLowerCase()
      this.$store.commit("updateMusicLoadState", false)
    },
    getIsUserLikeCurrentMusic() {
      this.isUserLikeCurrentMusic = this.likeMusicList.find(v => v === this.$store.state.musicUrl)
    },
    dblClickRow(row) {
      this.changeMusic("click", row.id)
    },
    changeMusic(type, id) {
      if (type === 'click') {
        // 点击抽屉row进行切歌
        this.$store.commit("updateMusicId", id)
      } else if (type === "pre") {
        let currentMusicIdx = this.currentMusicIdx
        let preIdx
        if (this.playType === "order") {
          preIdx = currentMusicIdx - 1 < 0 ? this.musicList.length - 1 : currentMusicIdx - 1
        } else if (this.playType === "random") {
          if (this.musicList.length === 1) {
            preIdx = currentMusicIdx
          } else {
            // random
            preIdx = currentMusicIdx
            while (preIdx === currentMusicIdx) {
              preIdx = Math.floor(Math.random() * this.musicList.length)
            }
          }
        }
        this.$store.commit("updateMusicId", this.musicList[preIdx].id)
      } else if (type === "next") {
        let currentMusicIdx = this.currentMusicIdx
        let nextIdx
        if (this.playType === "order") {
          nextIdx = currentMusicIdx + 1 === this.musicList.length ? 0 : currentMusicIdx + 1
        } else if (this.playType === "random") {
          if (this.musicList.length === 1) {
            nextIdx = currentMusicIdx
          } else {
            nextIdx = currentMusicIdx
            while (nextIdx === currentMusicIdx) {
              nextIdx = Math.floor(Math.random() * this.musicList.length)
            }
          }
        }
        this.$store.commit("updateMusicId", this.musicList[nextIdx].id)
      }
    },
    changeState(state) {
      this.$store.commit("changePlayState", state)
    },
    changePlayState() {
      !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic()
    },
    playMusic() {
      this.$refs.audio.play()
    },
    pauseMusic() {
      this.$refs.audio.pause()
    },
    clickSingerDetail() {
      if (this.$route.path === `/singer-detail/${this.musicDetail.ar[0].id}`) {
        this.$router.push({
          name: 'singer-detail',
          params: { id: this.musicDetail.ar[0].id }
        })
        if (this.$store.state.isMusicDetailShow === true) {
          this.$store.state.commit("changeMusicDetailState", false)
        }
      }
    },
    downloadMusic() {
    },
    timeupdate() {
      let time = this.$refs.audio.currentTime
      // 当前播放时间保存到vuex
      this.$store.commit("updateCurrentTime", time)
      time = Math.floor(time)
      if (time !== lastSecond) {
        lastSecond = time
        this.currentTime = time
        this.timeProgress = Math.floor((time / durationNum) * 100)
      }
    },
    changeProgress(e) {
      this.currentTime = Math.floor((e / 100) * durationNum)
      this.$refs.audio.currentTime = this.currentTime
    },
    changeMutedState() {
      if (this.isMuted) {
        this.volume = volumeSave
      } else {
        volumeSave = this.volume
        this.volume = 0
      }
      this.isMuted = !this.isMuted
    },
    changeVolume(e) {
      this.$refs.audio.volume = e / 100
      if (this.isMuted && e > 0) {
        this.isMuted = false
      } else if (e === 0 && this.isMuted === false) {
        this.isMuted = true
      }
    },
    async like() {
      if (!window.localStorage.getItem("userInfo")) {
        this.$message.error("请先登录!")
        return
      }
      this.isUserLikeCurrentMusic = !this.isUserLikeCurrentMusic
      await this.likeMusic(this.$store.state.musicUrl, this.isUserLikeCurrentMusic)
      await this.getLikeMusicList()
    },
    async likeMusic(id, like) {
      let res = await this.$request("/like", { id, like })
      if (res.data.code === 200) {
        this.$message.success("点赞成功!")
      } else {
        this.$message.error("点赞失败!")
      }
    },
    async getLikeMusicList() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request("/likelist", {
        uid: window.localStorage.getItem("userId"),
        timestamp
      })
      this.likeMusicList = res.data.ids
      this.$store.commit("updateLikeMusicList", this.likeMusicList)
    },
    openDrawer() {
      this.drawer = !this.drawer
      this.hasDrawerOpened = true
      this.handleDrawerListDOM(this.currentMusicIdx)
    },
    handleDrawerListDOM(currentIndex, lastIndex) {
      this.$nextTick(() => {
        let tableRows = document
        .querySelector(".bottom-main")
        .querySelectorAll(".el-table__row");
        // // 直接修改dom样式的颜色无效  可能是因为第三方组件 style scoped的原因
        // // 通过引入全局样式解决
        if (tableRows[currentIndex]) {
          tableRows[currentIndex].children[0]
          .querySelector(".cell")
          .classList.add("current-row");
          tableRows[currentIndex].children[1]
          .querySelector(".cell")
          .classList.add("current-row");
        }
        if (
          (lastIndex && lastIndex !== -1 && tableRows[lastIndex]) || lastIndex === 0
        ) {
          // 将上一首的类名删掉
          tableRows[lastIndex].children[0]
          .querySelector(".cell")
          .classList.remove("current-row");
          tableRows[lastIndex].children[1]
          .querySelector(".cell")
          .classList.remove("current-row");
        }
      })
    }
  }
};
</script>

<template>
  <div class="bottom-main">
    <audio
      :src="musicUrl"
      ref="audio"
      autoplay
      @play="changeState(true)"
      @pause="changeState(false)"
      @ended="changeMusic('next')"
      @timeupdate="timeupdate"
    />
    <div class="left">
      <div class="avatar" @click="$store.commit('changeMusicDetailState')">
        <img
          :src="musicDetail.al.picUrl"
          v-if="musicDetail.al"
          :draggable="false"
        />
        <img src="../../assets/img/test.jpg" v-else :draggable="false" />
      </div>
      <div class="music-info">
        <div class="music-name" v-if="musicDetail && musicDetail.name">
          {{ musicDetail.name }}
        </div>
        <div
          class="singer"
          v-if="musicDetail && musicDetail.name"
          @click="clickSingerDetail"
        >
          {{ musicDetail.ar[0].name }}
        </div>
      </div>
      <div class="music-download" v-if="musicDetail.name">
        <i class="iconfont icon-download" @click="downloadMusic" />
      </div>
    </div>
    <div class="center">
      <div class="buttons">
        <span @click="playType = playType === 'order' ? 'random' : 'order'">
          <i class="iconfont icon-xunhuan" v-if="playType === 'order'" />
          <i class="iconfont icon-suiji1" v-else />
        </span>
        <span @click="musicList.length !== 0 ? changeMusic('pre') : ''">
          <i class="iconfont icon-shangyishou" />
        </span>
        <span @click="musicList.length !== 0 ? changePlayState() : ''">
          <i class="iconfont icon-icon_play" v-if="!this.$store.state.isPlay" />
           <i class="iconfont icon-zantingtingzhi" v-else />
        </span>
        <span @click="musicList.length !== 0 ? changeMusic('next') : ''">
          <i class="iconfont icon-xiayishou" />
        </span>
        <span>
          <i
            class="iconfont icon-xihuan"
            :class="isUserLikeCurrentMusic ? 'like' : ''"
            @click="musicList.length !== 0 ? like() : ''"
          />
        </span>
      </div>
      <!-- 进度条 -->
      <div class="progress-bar">
        <span class="time-now">{{ currentTime | handleMusicTime }}</span>
        <el-slider
          class="progress-slider"
          v-model="timeProgress"
          :show-tooltip="false"
          @change="changeProgress"
          :disabled="musicList.length === 0"
        />
        <span class="total-time">{{ duration }}</span>
      </div>
    </div>
    <div class="right">
      <div class="volume-control">
        <i class="iconfont icon-yinliang " @click="changeMutedState"/>
        <el-slider
          class="volume-slider"
          v-model="volume"
          @input="changeVolume"
          :show-tooltip="false"
        />
      </div>
      <div class="play-list" @click="openDrawer">
        <i class="iconfont icon-bofangliebiao"/>
      </div>
    </div>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      width="400"
    >
      <div class="drawer-header">总{{ musicList.length }}首</div>
      <el-table
        :data="musicList"
        stripe
        style="width: 100%"
        :show-header="false"
        @row-dblclick="dblClickRow"
        highlight-current-row
        lazy
      >
        <el-table-column prop="name" width="150px"/>
        <el-table-column prop="ar[0].name" width="80px"/>
        <el-table-column prop="dt" width="70px"/>
      </el-table>
    </el-drawer>
  </div>
</template>

<style scoped>
.bottom-main {
  border-top: 1px solid #ddd;
  width: 100%;
  height: 65px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  /** 均匀排列每个元素 首个元素放置于起点，末尾元素放置于终点 */
  justify-content: space-between;
  padding: 6px 10px;
  z-index: 10000;
  background-color: #fff;
}

.left {
  display: flex;
  align-items: center;
  width: 120px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
}

.avatar img {
  width: 100%;
}

.music-info {
  color: rgb(37, 37, 37);
  font-size: 12px;
  width: 70px;
}

.music-name {
  margin-bottom: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  /** 连续的空白符会被合并 */
  white-space: nowrap;
}

.singer {
  transform: scale(0.9);
  /** 在原来的基础上继续向左移动3px */
  margin-left: -3px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer
}

.center {
  display: flex;
  align-items: center;
  /** 调整主轴方向 主轴为垂直方向，起点在上沿*/
  flex-direction: column;
  margin-top: 5px;
}

.buttons {
  display: flex;
  align-items: center;
  height: 13px;
}

.buttons i {
  font-size: 24px;
  color: #313131;
}

.buttons span:nth-child(3) i {
  /** 调整播放按钮大小 */
  font-size: 30px;
}

.center .icon-xunhuan {
  font-size: 20px;
}

.center .icon-xihuan {
  font-size: 18px;
}

.center .icon-suiji1 {
  font-size: 15px;
}

.icon-zantingtingzhi {
  font-size: 35px !important;
}

.icon-yinliang {
  font-size: 18px;
  margin-right: 7px;
}

.buttons span {
  display: inline-block;
  width: 50px;
  text-align: center;
  /* 设置的边框和内边距的值是包含在width内的 */
  box-sizing: border-box;
}

.right {
  display: flex;
  align-items: center;
  position: relative;
}

.volume-control {
  display: flex;
  align-items: center;
  margin-right: 25px;
}

.volume-slider {
  width: 50px;
}

.progress-bar {
  display: flex;
  align-items: center;
  height: 18px;
  margin-top: 12px;
  overflow: hidden;
}

.time-now, .total-time {
  font-size: 12px;
  text-align: center;
  margin: 7px;
  width: 30px;
  color: #aaa;
}

.icon-bofangliebiao {
  font-size: 18px;
  margin-right: 10px;
}

.progress-slider {
  width: 350px;
}

.drawer-header {
  font-size: 18px;
  transform: scale(0.9);
  color: #aaa;
  padding: 15px 0;
}

.music-download {
  height: 100%;
  position: relative;
}

.music-download i {
  position: absolute;
  bottom: 5px;
}

.like {
  color: #ec4141 !important;
}
</style>