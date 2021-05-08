<template>
  <div class="w">
    <banner :bannerImg="bannerImg" :galleryImg="galleryImg" :sightName="sightName"/>
    <detail-header/>
    <div class="content">
      <list :list="list"/>
    </div>
  </div>
</template>

<script>
import Banner from './components/Banner'
import axios from 'axios'
import List from './components/List'
import DetailHeader from './components/Header'

export default {
  name: 'Detail',
  components: {
    DetailHeader,
    Banner,
    List
  },
  data () {
    return {
      bannerImg: '',
      galleryImg: [],
      sightName: '',
      list: []
    }
  },

  methods: {
    getDetailInfo () {
      axios.get('/api/detail.json', {
        params: {
          id: this.$route.params.id
        }
      }).then(this.handleGetDetailSuccess)
    },
    handleGetDetailSuccess (res) {
      res = res.data
      if (res.ret && res.data) {
        const data = res.data
        this.sightName = data.sightName
        this.bannerImg = data.bannerImg
        this.galleryImg = data.galleryImg
        this.list = data.categoryList
      }
    }
  },

  mounted () {
    this.getDetailInfo()
  }
}
</script>

<style lang="stylus" scoped>
*
  font-family: Arial, "Microsoft Yahei", "Helvetica Neue", Helvetica, sans-serif;

.w {
  max-width: 13rem; /*移动端650px,并且最好使用max-width*/
  margin: 0 auto;
}

.content {
  height: 50rem
}
</style>
