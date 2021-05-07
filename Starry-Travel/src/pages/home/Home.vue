<template>
  <div class="w">
    <home-header/>
    <home-swiper/>
    <home-icon/>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import HomeSwiper from './components/Swiper'
import HomeIcon from './components/Icons'

export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomeSwiper,
    HomeIcon,
  },
  data () {
    return {
      swiperList: []
    }
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
