<script>
import ListCard from '@/components/listCard/ListCard.vue'

export default {
  components: { ListCard },
  created() {
    this.getSearchMusicList()
  },
  data() {
    return {
      count: 0,
      page: 1,
      musicList: []
    }
  },
  methods: {
    async getSearchMusicList() {
      let res = await this.$request("/cloudsearch", {
        keywords: this.$route.params.id,
        offset: 30 * (this.page - 1),
        type: 1000
      })
      this.count = res.data.result.playlistCount
      this.musicList = res.data.result.playlists
    },
    clickCardItem(id) {
      this.$router.push({
        name: "music-list-detail",
        params: { id }
      })
    },
    pageChange(page) {
      this.page = page
      this.musicList = []
      this.getSearchMusicList()
    }
  }
}
</script>

<template>
  <div class="list-main">
    <div class="tip">
      找到 {{ count }} 位歌单
    </div>
    <list-card
      :listCard="musicList"
      @clickCardItem="clickCardItem"
    />
    <div class="page" v-if="musicList.length !== 0">
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
.list-main {
  max-width: 1400px;
  margin: auto;
}

.tip {
  margin-top: 20px;
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