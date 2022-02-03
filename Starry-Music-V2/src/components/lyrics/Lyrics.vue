<script>
let placeholderHeight = 0

export default {
  props: {
    lyric: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      lyricsIndex: 0
    }
  },
  watch: {
    "$store.state.currentTime"(currentTime, lastTime) {
      //  当歌词数量大于1并且索引为零时,可能歌词位置差距较大
      if (
        (lastTime && Math.abs(currentTime - lastTime) >= 1) ||
        (this.lyricsIndex === 0 && this.lyric.length > 1)
      ) {
        // 处理播放时间跳转时歌词位置的校准
        if (this.lyric.length > 1) {
          this.getCurrentLyricsIndex(currentTime)
          this.lyricScroll(this.lyricsIndex)
        }
      }
      // 根据实时播放时间实现歌词滚动
      if (this.lyricsIndex < this.lyric.length) {
        if (currentTime >= this.lyric[this.lyricsIndex][0]) {
          this.lyricsIndex += 1
          this.lyricScroll(this.lyricsIndex)
        }
      }
    },
    "$store.state.musicId"() {
      this.lyricsIndex = 0
    },
    lyric() {
      if (this.$store.state.currentTime > 1) {
        // 歌词在1秒后才请求成功 歌词可能不能马上跳转到当前时间 这里进行校准
        if (this.$store.state.currentTime > 1) {
          if (this.lyric.length > 1) {
            this.getCurrentLyricsIndex(this.$store.state.currentTime)
            this.$nextTick(() => {
              this.lyricScroll(this.lyricsIndex)
            })
          }
        }
      }
    }
  },
  methods: {
    getCurrentLyricsIndex(currentTime) {
      let lyricsIndex = 0
      // some => 对数组中的每个元素都执行一次指定的函数（callback），直到此函数返回 true
      this.lyric.some(v => {
        if (lyricsIndex < this.lyric.length - 1) {
          if (currentTime > v[0]) {
            lyricsIndex += 1
          }
          return currentTime <= v[0]
        }
      })
      this.lyricsIndex = lyricsIndex
    },
    lyricScroll(currentLyric) {
      // 歌词item
      let lyricsArr = document.querySelectorAll('.item')
      // 歌词框
      let lyrics = document.querySelector('.lyrics')
      if (placeholderHeight === 0) {
        placeholderHeight = lyricsArr[0].offsetTop - lyrics.offsetTop
      }
      // item在歌词框的高度 = 歌词框的offsetTop - 歌词item的offsetTop
      if (lyricsArr[currentLyric - 1]) {
        let dis = lyricsArr[currentLyric - 1].offsetTop - lyrics.offsetTop
        lyrics.scrollTo({
          behavior: 'smooth',
          top: dis - placeholderHeight
        })
      }
    }
  }
}
</script>

<template>
  <div class="lyrics">
    <div class="placeholder"/>
    <div
      class="item"
      v-for="(v, idx) in lyric"
      :class="lyricsIndex - 1 === idx ? 'current-lyric' : ''"
      :key="idx"
    >
      {{ v[1] }}
    </div>
    <div class="placeholder"/>
  </div>
</template>

<style scoped>
.lyrics {
  width: 100%;
  height: 340px;
  font-size: 16px;
  text-align: center;
  overflow-y: scroll;
  margin-left: 55px;
  margin-top: 20px;
}

/* 隐藏滚动条 */
.lyrics::-webkit-scrollbar {
  display: none;
}

.item {
  font-size: 16px;
  margin: 30px 25px;
  transition: all 0.5s;
  line-height: 20px;
}

.current-lyric {
  font-weight: 600;
  font-size: 18px;
  color: black;
}

.placeholder {
  width: 100%;
  height: 40%;
}
</style>