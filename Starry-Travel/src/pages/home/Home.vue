<template>
  <div class="w">
    <home-header/>
    <home-swiper/>
    <home-icon/>
    <Recommend/>
    <Weekend/>
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

  methods: {
    getHomeInfo () {
      axios.get('/api/index.json')
        .then(this.getHomeInfoSuccess)
    },
    getHomeInfoSuccess (res) {
      console.log(res)
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
