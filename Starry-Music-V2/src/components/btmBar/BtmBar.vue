<script>
export default {
  data() {
    return {
      musicUrl: '',
      musicDetail: {},
      playType: '',
      musicList: []
    }
  },
  methods: {
    changeMusic() {},
    changeState() {},
    changePlayState() {},
    clickDetail() {

    },
    downloadMusic() {
    },
    timeupdate() {}
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
      <div class="avatar">
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
          @click="clickDetail"
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
          <i class="iconfont icon-sunji1" v-else />
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
          />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-main {
  border-top: 1px solid #ddd;
  width: 100%;
  height: 70px;
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
  border-radius: 5px;
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
</style>