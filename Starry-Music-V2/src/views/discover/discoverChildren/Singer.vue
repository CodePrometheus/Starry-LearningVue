<script>
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue';
import ListCard from '@/components/listCard/ListCard.vue';
import GoTop from '@/components/goTop/GoTop.vue';

export default {
  components: { SecondNavBar, ListCard, GoTop },
  created() {
    this.getSingerList()
  },
  data() {
    return {
      area: -1,
      type: -1,
      word: -1,
      languageType: [
        {area: -1, name: '全部'},
        {area: 7, name: '华语'},
        {area: 96, name: '欧美'},
        {area: 8, name: '日本'},
        {area: 16, name: '韩国'},
        {area: 0, name: '其它'},
      ],
      singerType: [
        {type: -1, name: '全部'},
        {type: 1, name: '男歌手'},
        {type: 2, name: '女歌手'},
        {type: 3, name: '乐队'},
      ],
      wordType: [
        {word: -1, name: '热门'},
        {word: 'a', name: 'A'},
        {word: 'b', name: 'B'},
        {word: 'c', name: 'C'},
        {word: 'd', name: 'D'},
        {word: 'e', name: 'E'},
        {word: 'f', name: 'F'},
        {word: 'g', name: 'G'},
        {word: 'h', name: 'H'},
        {word: 'i', name: 'I'},
        {word: 'j', name: 'J'},
        {word: 'k', name: 'K'},
        {word: 'l', name: 'L'},
        {word: 'm', name: 'M'},
        {word: 'n', name: 'N'},
        {word: 'o', name: 'O'},
        {word: 'p', name: 'P'},
        {word: 'q', name: 'Q'},
        {word: 'r', name: 'R'},
        {word: 's', name: 'S'},
        {word: 't', name: 'T'},
        {word: 'u', name: 'U'},
        {word: 'v', name: 'V'},
        {word: 'w', name: 'W'},
        {word: 'x', name: 'X'},
        {word: 'y', name: 'Y'},
        {word: 'z', name: 'Z'},
        {word: 0, name: '#'},
      ],
      singerList: [],
      page: 1,
      isMore: false
    };
  },
  methods: {
    async getSingerList() {
      let res = {}
      res = await this.$request('/artist/list', {
        area: this.area,
        type: this.type,
        initial: this.word,
        offset: (this.page - 1) * 30
      })
      this.singerList.push(...res.data.artists)
      this.isMore = res.data.more
    },
    clickLanguage(idx) {
      this.area = this.languageType[idx].area
      this.page = 1
      this.singerList = []
      this.getSingerList()
    },
    clickSinger(idx) {
      this.type = this.singerType[idx].type
      this.page = 1
      this.singerList = []
      this.getSingerList()
    },
    clickWord(idx) {
      this.word = this.wordType[idx].word
      this.page = 1
      this.singerList = []
      this.getSingerList()
    },
    clickCardItem(id) {
      this.$router.push({ name: 'singer-detail', params: { id }})
    },
    bottomLoad() {
      if (this.isMore === true) {
        this.page += 1
        this.getSingerList()
      }
    },
  },
};
</script>

<template>
  <div class="singer-main">
    <div class="singer">
      <div class="selectors">
        <div class="selectors-item">
          <div class="title">语种:</div>
          <second-nav-bar
              class="second-nav-bar"
              :secondData="languageType"
              @clickSecondItem="clickLanguage"
          />
        </div>
        <div class="selectors-item">
          <div class="title">分类:</div>
          <second-nav-bar
              class="second-nav-bar"
              :secondData="singerType"
              @clickSecondItem="clickSinger"
          />
        </div>
        <div class="selectors-item">
          <div class="title">筛选:</div>
          <second-nav-bar
              class="second-nav-bar"
              :secondData="wordType"
              @clickSecondItem="clickWord"
          />
        </div>
      </div>
      <div class="card-main">
        <list-card
            class="list-card"
            :listCard="singerList"
            @clickCardItem="clickCardItem"
            isLoad
            @bottomLoad="bottomLoad"
        />
      </div>
      <go-top scroll=".singer-main"/>
    </div>
  </div>
</template>

<style scoped>
.singer-main {
  display: flex;
  justify-content: center;
}

.singer {
  max-width: 1200px;
}

.selectors {
  margin-top: 10px;
}

.selectors-item {
  display: flex;
}

.title {
  width: 40px;
  line-height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.second-nav-bar {
  width: calc(100% - 50px);
  display: flex;
  align-items: center;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.list-card {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>