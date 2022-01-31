<script>
import ListCard from '@/components/listCard/ListCard.vue'

export default {
  components: { ListCard },
  created() {
    this.getAlbumList()
  },
  data() {
    return {
      count: 0,
      page: 1,
      albumList: []
    }
  },
  methods: {
    clickCardItem(id) {
      this.$router.push({ name: "album", params: { id } })
    },
    async getAlbumList() {
      let res = await this.$request("/cloudsearch", {
        keywords: this.$route.params.id,
        offset: 30 * (this.page - 1),
        type: 10
      })
      this.albumList = res.data.result.albums
      this.count = res.data.result.albumCount
    },
    pageChange(page) {
      this.page = page
      this.albumList = []
      this.getAlbumList()
    }
  }
}
</script>

<template>
  <div class="album-main">
    <div class="tip">
      找到 {{ count }} 个专辑
    </div>
    <list-card
        :listCard="albumList"
        @clickCardItem="clickCardItem"
    />
    <div class="page" v-if="albumList.length !== 0">
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
.album-main {
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