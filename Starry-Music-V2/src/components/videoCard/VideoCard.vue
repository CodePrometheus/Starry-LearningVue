<script>
import { handleMusicTime, handleNum } from '@/plugins/utils.js'

export default {
  data() {
    return {
      disabled: true,
    }
  },
  filters: {
    handleMusicTime, handleNum,
  },
  props: {
    videoType: {
      type: String,
      default() {
        return 'singerMv'
      },
    },
    videoList: {
      type: Array,
      default() {
        return []
      },
    },
    isLoad: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  methods: {
    clickCardItem(id, idx, type) {
      this.$emit('clickCardItem', { id, idx, type })
    },
    load() {
      this.$emit('bottomLoad')
      this.disabled = true
    },
  },
  watch: {
    videoList() {
      if (this.isLoad === true) {
        if (this.videoList.length !== 0) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <!-- singerMv || mv -->
    <div
      class="video-list"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="300"
      :infinite-scroll-immediate="false"
      v-if="videoType === 'singerMv' || videoType === 'mv'"
    >
      <div
        class="card-item"
        v-for="(v, idx) in videoList"
        :key="idx"
        @click="clickCardItem(v.id, idx, v.type)"
      >
        <div class="video-cover">
          <img
            :src="(videoType === 'singerMv' ? v.imgurl : v.cover) + '?param=680y400'"
            :draggable="false"
          />
          <div class="play-count">
            <i class="iconfont icon-shipin"/>{{ v.playCount | handleNum }}
          </div>
          <div class="video-time" v-if="videoType === 'singerMv'">
            {{ v.duration | handleMusicTime }}
          </div>
        </div>
        <div class="video-title">{{ v.name }}</div>
        <div class="singer" v-if="videoType === 'mv'">
          {{ v.artistName }}
        </div>
      </div>
    </div>
    <!-- Video -->
    <div
      class="video-list"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="300"
      :infinite-scroll-immediate="false"
      v-else-if="videoType === 'video'"
    >
      <div
        class="card-item"
        v-for="(v, idx) in videoList"
        :key="idx"
        @click="clickCardItem(v.vid || v.data.vid, idx, v.type)"
      >
        <div class="video-cover">
          <img
            :src="(v.coverUrl || v.data.coverUrl) + '?param=1260y800'"
            :draggable="false"
          />
          <div class="play-count">
            <i class="iconfont icon-shipin"/>{{ (v.playTime || v.data.playTime) | handleNum }}
          </div>
          <div class="video-time">
            {{ v.durationms | handleMusicTime }}
          </div>
        </div>
        <div class="video-title">
          {{ v.title || v.data.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-list {
  width: 100%;
  display: flex;
  justify-content: left;
  padding: 0;
  margin-top: 20px;
  /** 被打断到多个行中 */
  flex-wrap: wrap;
}

.card-item {
  max-width: 280px;
  width: 16vw;
  margin-right: 5%;
  margin-left: 1%;
  margin-bottom: 20px;
  cursor: pointer;
}

.video-cover {
  position: relative;
  height: 9.3vw;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: black;
}

.video-cover img {
  width: 18vw;
}

.play-count {
  font-size: 12px;
  color: white;
  position: absolute;
  top: 0;
  right: 5px;
  transform: scale(0.9);
  bottom: 5px;
}

.video-time {
  font-size: 12px;
  color: white;
  position: absolute;
  bottom: 5px;
  right: 5px;
  transform: scale(0.9);
}

.video-title {
  margin-top: 8px;
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;
  text-overflow: ellipsis;
  color: rgb(32, 32, 32);
  /** 怎样在单词内断行 break-all在任意字符间断行*/
  word-break: break-all;
  text-overflow: -o-ellipsis-lastline;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.singer {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  padding: 0;
  margin: 1px 0 0 -1px;
}
</style>