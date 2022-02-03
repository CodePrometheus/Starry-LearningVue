<script>
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue'
import GoTop from '@/components/goTop/GoTop.vue'
import VideoCard from '@/components/videoCard/VideoCard.vue'

export default {
  components: { SecondNavBar, GoTop, VideoCard },
  async created() {
    await this.getMvList()
  },
  data() {
    return {
      areaList: [
        { name: '全部', path: '' },
        { name: '内地', path: '内地' },
        { name: '港台', path: '港台' },
        { name: '欧美', path: '欧美' },
        { name: '日本', path: '日本' },
        { name: '韩国', path: '韩国' },
      ],
      typeList: [
        { name: '全部', path: '' },
        { name: '官方版', path: '官方版' },
        { name: '原生', path: '原生' },
        { name: '现场版', path: '现场版' },
        { name: '网易出品', path: '网易出品' },
      ],
      orderList: [
        { name: '上升最快', path: '' },
        { name: '最热', path: '最热' },
        { name: '最新', path: '最新' },
      ],
      area: '',
      type: '',
      order: '',
      page: 1,
      isMore: false,
      mvList: [],
    }
  },
  methods: {
    async getMvList() {
      let res = await this.$request('/mv/all', {
        area: this.area,
        type: this.type,
        order: this.order,
        offset: 30 * (this.page - 1),
      })
      this.isMore = res.data.hasMore
      this.mvList.push(...res.data.data)
    },
    clickArea(idx) {
      this.page = 1
      this.area = this.areaList[idx].path
      this.mvList = []
      this.getMvList()
    },
    clickType(idx) {
      this.page = 1
      this.type = this.typeList[idx].path
      this.mvList = []
      this.getMvList()
    },
    clickOrder(idx) {
      this.page = 1
      this.order = this.orderList[idx].path
      this.mvList = []
      this.getMvList()
    },
    goMvDetail({ id }) {
      this.$router.push({ name: 'video-detail', params: { id, type: 'mv' } })
    },
    bottomLoad() {
      if (this.isMore) {
        this.page += 1
        this.getMvList()
      }
    },
  },
}
</script>

<template>
  <div>
    <div class="list-nav-bar">
      <div class="selectors-item">
        <div class="title">地区:</div>
        <second-nav-bar
          :secondData="areaList"
          :width="70"
          @clickSecondItem="clickArea"
          class="second-nav-bar"
        />
      </div>
      <div class="selectors-item">
        <div class="title">类型:</div>
        <second-nav-bar
          :secondData="typeList"
          :width="70"
          @clickSecondItem="clickType"
          class="second-nav-bar"
        />
      </div>
      <div class="selectors-item">
        <div class="title">排序:</div>
        <second-nav-bar
          :secondData="orderList"
          :width="70"
          @clickSecondItem="clickOrder"
          class="second-nav-bar"
        />
      </div>
    </div>
    <video-card
      class="card-list"
      :videoList="mvList"
      :isLoad="true"
      :videoType="'mv'"
      @clickCardItem="goMvDetail"
      @bottomLoad="bottomLoad"
    />
    <go-top scroll=".card-list"/>
  </div>
</template>

<style scoped>
.list-nav-bar {
  margin-top: 20px;
  padding: 0 25px;
  transform: translateY(-10px);
}

.selectors-item {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.title {
  width: 40px;
  line-height: 33px;
}

.second-nav-bar {
  margin-left: 15px;
  padding: 4px 0;
  display: flex;
  align-items: center;
  width: calc(100% - 50px);
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.card-list {
  overflow-y: scroll;
  height: calc(80vh - 139px)
}
</style>