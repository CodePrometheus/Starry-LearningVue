<script>
import VideoCard from '@/components/videoCard/VideoCard.vue'

export default {
  components: { VideoCard },
  async created() {
    await this.getVideoList()
  },
  data() {
    return {
      videoList: [],
      page: 1,
      hasMore: false
    }
  },
  methods: {
    clickCardItem({ id, idx }) {
      if (this.videoList[idx].type === 0) {
        this.$router.push({ name: "video-detail", params: { id, type: "mv" }})
      } else {
        this.$router.push({ name: "video-detail", params: { id, type: "video" }})
      }
    },
    bottomLoad() {
      if (this.hasMore) {
        this.page += 1
        this.getVideoList()
      }
    },
    async getVideoList() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request("/mv/sublist", {
        limit: 50,
        offset: 50 * (this.page - 1),
        timestamp
      })
      this.videoList.push(...res.data.data)
    }
  }
}
</script>

<template>
  <div class="video-main">
    <div class="video">
      <div v-if="videoList.length !== 0">
        <div class="header">收藏的视频和MV</div>
        <video-card
            :videoList="videoList"
            :videoType="'video'"
            :isLoad="true"
            :clickCardItem="clickCardItem"
            @bottomLoad="bottomLoad"
        />
      </div>
      <div v-else class="tip"><div>暂无收藏视频和MV</div></div>
    </div>
  </div>
</template>

<style scoped>
.video-main {
  display: flex;
  justify-content: center;
  padding: 0 30px;
}

.header {
  font-size: 20px;
  color: rgb(34, 34, 34);
  margin: 20px 0;
}

.tip {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(34, 34, 34);
}
</style>