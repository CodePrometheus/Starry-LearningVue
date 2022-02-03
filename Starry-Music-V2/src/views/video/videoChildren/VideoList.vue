<script>
import SortBox from '@/components/sortBox/SortBox.vue'
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue'
import ListCard from '@/components/listCard/ListCard.vue'
import GoTop from '@/components/goTop/GoTop.vue'
import VideoCard from '@/components/videoCard/VideoCard.vue'

export default {
  components: {
    SortBox,
    SecondNavBar,
    ListCard,
    GoTop,
    VideoCard,
  },
  async created() {
    await this.getVideoCategory()
    await this.getVideoList(this.currentTag.id)
  },
  data() {
    return {
      videoCategory: [],
      currentTag: {},
      sortList: [],
      videoList: [],
      page: 1,
      isMore: true,
    }
  },
  methods: {
    async getSortList() {
      let res = await this.$request('/video/group/list')
      this.sortList = res.data.data
    },
    async getVideoCategory() {
      let res = await this.$request('/video/category/list')
      this.videoCategory = res.data.data
      this.currentTag = res.data.data[0]
    },
    clickSortBoxItem(v) {
      this.currentTag = v
      this.page = 1
      this.videoList = []
      this.getVideoList(v.id)
    },
    clickSecondItem(v) {
      this.page = 1
      this.videoList = []
      this.currentTag = this.videoCategory[v]
      this.getVideoList(this.currentTag.id)
    },
    async getVideoList(id) {
      let i = 2
      while (i) {
        if (this.isMore) {
          let res = await this.$request('/video/group', {
            id,
            offset: 4 * (this.page - 1),
          })
          this.isMore = res.data.hasmore
          this.videoList.push(...res.data.datas)
          this.page += 1
          i--
        } else {
          return
        }
      }
    },
    goVideoDetail({ id }) {
      this.$router.push({
        name: 'video-detail',
        params: {
          id,
          type: 'video',
        },
      })
    },
    bottomLoad() {
      if (this.isMore) {
        this.getVideoList(this.currentTag.id)
      }
    },
  },
}
</script>

<template>
  <div>
    <div class="list-nav-bar" v-if="videoCategory.length !== 0">
      <div class="left">
        <sort-box
          :currentTag="currentTag"
          :sortList="sortList"
          @getSortList="getSortList"
          @clickSortBoxItem="clickSortBoxItem"
        />
      </div>
      <div class="right">
        <second-nav-bar
          :secondData="videoCategory"
          :width="0"
          :currentTag="currentTag"
          @clickSecondItem="clickSecondItem"
        />
      </div>
    </div>
    <video-card
      class="card-list"
      :videoList="videoList"
      :isLoad="true"
      :videoType="'video'"
      @clickCardItem="goVideoDetail"
      @bottomLoad="bottomLoad"
    />
    <go-top scroll=".card-list"/>
  </div>
</template>

<style scoped>
.list-nav-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px 25px;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.card-list {
  overflow-y: scroll;
  height: calc(80vh - 42px)
}
</style>