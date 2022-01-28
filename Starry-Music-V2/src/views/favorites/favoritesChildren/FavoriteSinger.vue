<script>
import ListCard from '@/components/listCard/ListCard.vue';

export default {
  components: { ListCard },
  created() {
    if (this.$store.state.collectedSinger == null) {
      this.getSingerList()
    } else {
      this.singerList = this.$store.state.collectedSinger
      this.count = this.$store.state.collectedSinger.length
    }
  },
  watch: {
    "$store.state.collectedSinger"(current) {
      this.singerList = current
      this.count = current.length
    }
  },
  data() {
    return {
      singerList: [],
      count: 0
    }
  },
  methods: {
    clickCardItem(id) {
      this.$router.push({ name: 'singer-detail', params: { id }})
    },
    async getSingerList() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request("/artist/sublist", timestamp)
      this.singerList = res.data.data
      this.count = res.data.count
      this.$store.commit("updateCollectedSinger", res.data.data)
    }
  }
}
</script>

<template>
  <div class="singer-main">
    <div class="singer">
      <div v-if="count !== 0">
        <div class="header">收藏的歌手({{ count }})</div>
        <list-card
          :listCard="singerList"
          :clickCardItem="clickCardItem"
        />
      </div>
      <div v-else class="tip"><div>暂无收藏歌手</div></div>
    </div>
  </div>
</template>

<style scoped>
.singer-main {
  display: flex;
  justify-content: center;
  padding: 0 30px;
}

.singer {
  max-width: 1300px;
  width: 600px;
}

.header {
  font-size: 20px;
  color: rgba(34, 34, 34);
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