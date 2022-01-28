<script>
import ListCard from '@/components/listCard/ListCard.vue'
import ListTable from '@/components/listTable/ListTable.vue'

export default {
  components: { ListCard, ListTable },
  async created() {
    await this.getAllRanking()
    this.officialList.forEach(v => {
      this.getRankingDetail(v.id)
    })
  },
  data() {
    return {
      officialDetail: [],
      officialList: [],
      globalList: []
    }
  },
  methods:  {
    clickCardItem(v) {
      if (v.id) {
        v = v.id
      }
      this.$router.push({ name: 'music-list-detail', params: { id }})
    },
    async getAllRanking() {
      let res = await this.$request('/toplist')
      this.officialList = res.data.list.slice(0, 4)
      this.globalList = res.data.list.slice(4)
    },
    async getRankingDetail(id) {
      let res = await this.$request('/playlist/detail', { id })
      res = res.data.playlist
      this.officialDetail.push(res)
    },
    clickRow(e) {
      if (document.querySelector('.select-row')) {
        document.querySelector('.select-row').classList.remove('select-row')
      }
      // 添加样式
      e.classList.add('select-row')
    },
    dblClickRow() {},
  }
}
</script>

<template>
  <div class="ranking-main">
    <div class="ranking" v-if="officialDetail.length !== 0">
      <div class="official">
        <div class="title">官方榜</div>
        <list-table
          v-for="(v, idx) in officialDetail"
          :officialDetail="v"
          :key="idx"
          @clickRow="clickRow"
          @dblClickRow="dblClickRow"
          @clickFindAll="clickCardItem"
        />
      </div>
      <div class="global">
        <div class="全球榜">
          <list-card
            class="list-card"
            :listCard="globalList"
            @clickCardItem="clickCardItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-main {
  display: flex;
  justify-content: center;
  width: 100%;
}

.ranking {
  max-width: 1000px;
  padding: 0 10px;
}

.list-card {
  margin-top: 15px;
}
</style>