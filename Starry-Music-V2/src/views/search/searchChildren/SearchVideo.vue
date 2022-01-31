<script>
import VideoCard from '@/components/videoCard/VideoCard.vue'

export default {
  components: { VideoCard },
  created() {
    this.getSearchVideoList()
  },
  data() {
    return {
      count: 0,
      page: 1,
      videoList: []
    }
  },
  methods: {
    async getSearchVideoList() {
      let res = await this.$request("/cloudsearch", {
        keywords: this.$route.params.id,
        offset: 30 * (this.page - 1),
        type: 1014
      })
      this.count = res.data.result.videoCount
      this.videoList = res.data.result.videos
    },
    clickCardItem({ id, type }) {
      if (type === 0) {
        this.$router.push({ name: "video-detail", params: { id, type: "mv" } })
      } else {
        this.$router.push({ name: "video-detail", params: { id, type: "video" } })
      }
    },
    pageChange(page) {
      this.page = page
      this.videoList = []
      this.getSearchVideoList()
    }
  }
}
</script>

<template>
  <div class="search-main">
    <div class="tip">
      找到 {{ count }} 个视频
    </div>
    <video-card
      :videoList="videoList"
      :videoType="'video'"
      @clickCardItem="clickCardItem"
    />
    <div class="page" v-if="videoList.length !== 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        small
        :page-size="30"
        :current-page="page"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
.search-main {
  padding: 0 140px;
}

.tip {
  margin: 20px 0 0 20px;
  color: rgb(34, 34, 34);
  font-weight: bold;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
  margin: 20px 0;
}
</style>