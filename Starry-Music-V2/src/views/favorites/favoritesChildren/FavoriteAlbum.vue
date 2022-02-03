<script>
import ListCard from '@/components/listCard/ListCard.vue';

export default {
  components: { ListCard },
  created() {
    if (this.$store.state.collectedAlbum == null) {
      this.getCollectedAlbum()
    } else {
      this.albumList = this.$store.state.collectedAlbum
      this.count = this.$store.state.collectedAlbum.length
    }
  },
  data() {
    return {
      albumList: [],
      count: 0
    }
  },
  methods: {
    async getCollectedAlbum() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request("/album/sublist", {
        limit: 1000,
        timestamp
      })
      this.albumList = res.data.data
      this.count = res.data.count
      this.$store.commit("updateCollectedAlbum", res.data.data)
    },
    clickCardItem(id) {
      this.$router.push({ name: "album", params: { id } })
    }
  },
  watch: {
    "$store.state.collectedAlbum"(current) {
      this.albumList = current
      this.count = current.length
    }
  }
}
</script>

<template>
  <div class="album-main">
    <div class="album">
      <div v-if="count !== 0">
        <div class="header">收藏的专辑({{ count }})</div>
        <list-card
          :listCard="albumList"
          :clickCardItem="clickCardItem"
        />
      </div>
      <div v-else class="tip"><div>暂无收藏专辑</div></div>
    </div>
  </div>
</template>

<style scoped>
.album-main {
  display: flex;
  justify-content: center;
  padding: 0 30px;
}

.album {
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