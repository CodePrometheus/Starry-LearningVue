<script>
import ListCard from '@/components/listCard/ListCard.vue'

export default {
  components: {
    ListCard
  },
  created() {
    this.getBanner()
    this.getCardList()
  },
  data() {
    return {
      banner: [],
      cardList: []
    }
  },
  methods: {
    async getBanner() {
      let res = await this.$request('/banner');
      this.banner = res.data.banners;
    },
    clickCardItem(id) {
      this.$router.push(
          {
            name: 'music-list-detail',
            params: { id }
          }
      )
    },
    getCardList() {
      this.$request('/personalized', { limit: 10 }).then((res) => {
        this.cardList = res.data.result
      })
    }
  },
};
</script>

<template>
  <div class="recommend-main">
    <div class="recommend">
      <div class="carousel">
        <el-carousel
            :interval="4000"
            type="card"
            height="240px"
        >
          <el-carousel-item
              v-for="(v, idx) in banner"
              :key="idx"
          >
            <img :src="v.imageUrl" :draggable="false"/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="recommend-list">
        <h3>推荐歌单<i class="iconfont icon-arrow-right-bold"/></h3>
        <list-card
          :listCard="cardList"
          @clickCardItem="clickCardItem"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommend-main {
  display: flex;
  justify-content: center;
}

.recommend {
  max-width: 90%;
}

.carousel {
  width: 100%;
}

.el-carousel {
  margin: auto;
  width: 800px;
}

.el-carousel__item {
  border-radius: 10px;
}

.el-carousel__item img {
  height: 100%;
}

.recommend-list {
  margin: 20px 10px;
}

.recommend-list h3 {
  color: #373737;
}
</style>
