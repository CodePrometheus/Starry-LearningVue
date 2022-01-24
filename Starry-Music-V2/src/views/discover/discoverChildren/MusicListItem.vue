<script>
import SortBox from '@/components/sortBox/SortBox.vue'
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue'
import ListCard from '@/components/listCard/ListCard.vue'

export default {
  components: {
    SortBox,
    SecondNavBar,
    ListCard
  },
  async created() {
    await this.getEntry()
    await this.getMusicList()
    await this.getHotTag()
  },
  data() {
    return {
      sortList: [],
      entry: {},
      currentTag: {},
      secondData: [],
      musicList: {},
      page: 1,
    }
  },
  methods: {
    async getEntry() {
      let res = await this.$request('/top/playlist/highquality', { limit: 1})
      this.entry = res.data.playlists[0]
    },
    async getSortList() {
      let res = await this.$request('/playlist/catlist')
      this.sortList = res.data.sub
    },
    async getHotTag() {
      let res = await this.$request('/playlist/hot')
      this.currentTag = res.data.tags[0]
      this.secondData = res.data.tags
    },
    clickSortBoxItem(v) {
      this.currentTag = v
      this.page = 1
      this.getMusicList()
    },
    clickSecondItem(v) {
      this.currentTag = this.secondData[v]
      this.page = 1
      this.getMusicList()
    },
    clickCardItem(id) {
      this.$router.push({ name: 'music-list-detail', params: { id }})
    },
    async getMusicList() {
      this.musicList = {}
      let res = await this.$request('/top/playlist', {
        cat: this.currentTag.name,
        offset: 50 * (this.page - 1)
      })
      this.musicList = res.data
    },
    pageChange(page) {
      this.page = page
      this.getMusicList()
    }
  }
};
</script>

<template>
  <div class="music-index">
    <!-- 精选歌单入口展示 -->
    <div class="entry">
      <img
        :src="entry.coverImgUrl"
        class="bg-img"
      />
      <div class="cover">
        <img
          :src="entry.coverImgUrl"
        />
      </div>
      <div class="entry-info">
        <div class="tag"><i class="iconfont icon-good"/>精品歌单</div>
        <div class="name">{{ entry.name }}</div>
        <div class="desc">{{ entry.copywriter }}</div>
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="list-nav-bar">
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
          :secondData="secondData"
          :width="0"
          :currentTag="currentTag"
          @clickSecondItem="clickSecondItem"
        />
      </div>
    </div>
    <list-card
      :listCard="musicList.playlists"
      @clickCardItem="clickCardItem"
    />
    <div class="page" v-if="musicList.playlists">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="musicList.total"
        :page-size="50"
        small
        :current-page="page"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.entry {
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
}

.bg-img {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  transform: translateY(-80%);
  /** blur高斯模糊 brightness亮度调节*/
  filter: blur(30px) brightness(70%);
}

.cover {
  width: 120px;
  height: 120px;
  margin: 10px;
}

.cover img {
  border-radius: 10px;
  width: 100%;
}

.tag {
  color: #d59354;
  border: 1px solid #d59354;
  border-radius: 15px;
  padding: 5px 10px;
  width: 88px;
  font-size: 12px;
  margin: 20px 10px 15px;
}

.tag i {
  font-size: 14px;
}

.name {
  font-size: 14px;
  margin: 15px 0;
  color: #fff;
}

.desc {
  font-size: 12px;
  margin-left: 10px;
  color: rgba(255, 255, 255, 0.5);
  transform: scale(0.9, 0.9);
}

.list-nav-bar {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 10px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
</style>