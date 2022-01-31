<script>
import ListCard from '@/components/listCard/ListCard.vue'

export default {
  components: { ListCard },
  created() {
    this.getSearchSingerList()
  },
  data() {
    return {
      singerList: [],
      page: 1,
      count: 0
    }
  },
  methods: {
    async getSearchSingerList() {
      // type: 搜索类型 100: 歌手
      let res = await this.$request("/cloudsearch", {
        keywords: this.$route.params.id,
        offset: 30 * (this.page - 1),
        type: 100
      })
      this.count = res.data.result.artistCount
      this.singerList = res.data.result.artists
    },
    clickCardItem(id) {
      console.log(id)
      this.$router.push({ name: "singer-detail", params: { id } })
    },
    pageChange(page) {
      this.page = page
      this.singerList = []
      this.getSearchSingerList()
    },
  }
}
</script>

<template>
  <div class="singer-main">
    <div class="tip">
      找到 {{ count }} 位歌手
    </div>
    <list-card
      :listCard="singerList"
      @clickCardItem="clickCardItem"
    />
    <div class="page" v-if="singerList.length !== 0">
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
.singer-main {
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