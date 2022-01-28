<script>
import { handleMusicTime } from '@/plugins/utils'

export default {
  created() {
    if (!this.$store.state.isLogin) {
      this.$message.error("只有登录后才能进入每日推荐页面哦!")
      this.$router.replace("/discover")
    }
  },
  async mounted() {
    if (this.$store.state.isLogin) {
      await this.getRecommendMusic()
      // 判断是否和上一次打开的歌单相同
      if (this.musicListId === this.$store.state.musicListId) {
        this.handleDOM(this.$store.state.musicUrl)
      }
    }
  },
  watch: {
    "$store.state.musicUrl"(current, last) {
      this.handleDOM(current, last)
    }
  },
  data() {
    return {
      recommendMusic: [],
      musicListId: "recommendMusic"
    }
  },
  methods: {
    async getRecommendMusic() {
      let res = await this.$request("/recommend/songs")
      this.recommendMusic = res.data.data.dailySongs
      this.recommendMusic.forEach((v, idx) => {
        this.recommendMusic[idx].dt = handleMusicTime(v.dt)
      })
    },
    handleDOM(current, last) {
      if (document.querySelector(".recommend-music")) {
        let rows = document.querySelector(".recommend-music")
        .querySelectorAll(".el-table__row")
        // 找到当前播放的index的行进行渲染
        let idx = this.recommendMusic.findIndex(v => v.id === current)
        if (idx !== -1) {
          rows[idx].children[0].querySelector(".cell")
          .innerHTML = `<div><i class="iconfont icon-yinliang"/></div>`
          rows[idx].children[0].querySelector(".iconfont")
          .classList.add("current-row")
          rows[idx].children[2].querySelector(".cell")
          .classList.add("current-row")
        }
        // 清除上一首的样式
        if (last !== -1) {
          let lastIdx = this.recommendMusic.findIndex(v => v.id === last)
          if (lastIdx !== -1) {
            rows[lastIdx].children[0].querySelector(".cell")
            .innerHTML = `<div>${
                lastIdx + 1 < 10 ? "0" + (lastIdx + 1) : lastIdx + 1
            }</div>`
            rows[lastIdx].children[2].querySelector(".cell")
            .classList.remove("current-row")
          }
        }
      }
    },
    playAll() {},
    async dblclick(row) {
      this.$store.commit("updateMusicId", row.id)
      if (this.musicListId !== this.$store.state.musicListId) {
        this.$store.commit("updateMusicList", {
          musicList: this.recommendMusic,
          musicListId: this.musicListId
        })
      }
    },
    clickCell() {},
    handleIndex(idx) {
      idx += 1
      if (idx < 10) {
        return "0" + idx
      } else {
        return idx
      }
    }
  }
}
</script>

<template>
  <div class="recommend-music">
    <div class="recommend-info">
      <div class="top">
        <div class="cover">
          <img src="../../assets/img/recommendMusic.png" :draggable="false"/>
        </div>
        <div class="info">
          <div class="top">每日歌曲推荐</div>
          <div class="bottom">根据你的音乐口味生成，每天6:00更新</div>
        </div>
      </div>
      <div class="buttons">
        <div class="button-item play-all" @click="playAll">
          <i class="iconfont icon-bofang playAll"/>
          <span>播放全部</span>
        </div>
        <div class="button-item">
          <i class="iconfont icon-xihuan"/>
          <span>收藏全部</span>
        </div>
      </div>
    </div>
    <div v-if="recommendMusic.length !== 0">
      <el-table
        :data="recommendMusic"
        size="mini"
        style="width: 100%"
        @row-dblclick="dblclick"
        @cell-click="clickCell"
        highlight-current-row
        stripe
        lazy
      >
        <el-table-column width="30" type="index" :index="handleIndex"/>
        <el-table-column width="23">
          <i class="iconfont icon-download"/>
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" min-width="350"/>
        <el-table-column prop="ar[0].name" label="歌手" min-width="120"/>
        <el-table-column prop="al.name" label="专辑" min-width="170"/>
        <el-table-column prop="dt" label="时长" min-width="100"/>
      </el-table>
      <div class="placeholder"/>
    </div>
  </div>
</template>

<style scoped>
.recommend-info {
  padding: 20px;
}

.top {
  display: flex;
}

.cover {
  width: 90px;
}

.cover img {
  width: 140%;
}

.info {
  padding: 30px 50px;
}

.top {
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin: 3px 0;
}

.bottom {
  font-size: 12px;
  margin-top: 10px;
  font-weight: normal;
}

.buttons {
  margin: 8px 0 0 3px;
  display: flex;
}

.button-item {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transform: scale(0.9);
}

.button-item i {
  font-size: 12px;
  margin-right: 5px;
}

.play-all {
  background-color: #ec4141;
  color: white;
}

.placeholder {
  width: 100%;
  height: 50px;
}
</style>