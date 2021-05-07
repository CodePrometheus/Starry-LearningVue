<template>
  <div class="w">
    <home-header :city="city"/>
    <home-swiper :list="swiperList"/>
    <home-icon :list="iconList"/>
    <Recommend :list="recommendList"/>
    <Weekend :list="weekendList"/>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import HomeSwiper from './components/Swiper'
import HomeIcon from './components/Icons'
import Recommend from './components/Recommend'
import Weekend from './components/Weekend'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomeSwiper,
    HomeIcon,
    Recommend,
    Weekend
  },

  data () {
    return {
      city: '',
      swiperList: [],
      iconList: [],
      recommendList: [],
      weekendList: []
    }
  },

  methods: {
    getHomeInfo () {
      axios.get('/api/index.json')
        .then(this.getHomeInfoSuccess)
    },
    getHomeInfoSuccess (res) {
      res = res.data
      // 正确返回结果
      if (res.ret && res.data) {
        const data = res.data
        this.city = data.city
        this.swiperList = data.swiperList
        this.iconList = data.iconList
        this.recommendList = data.recommendList
        this.weekendList = data.weekendList
      }
    }
  },

  // axios
  mounted () {
    this.getHomeInfo()
  }
}
</script>

<style>
* {
  font-family: Arial, "Microsoft Yahei", "Helvetica Neue", Helvetica, sans-serif;
}

.w {
  max-width: 13rem; /*移动端650px,并且最好使用max-width*/
  margin: 0 auto;
}
</style>
