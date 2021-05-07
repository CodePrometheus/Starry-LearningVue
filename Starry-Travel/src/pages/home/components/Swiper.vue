<template>
  <div class="wrapper">
    <swiper :options="swiperOptions"
    >
      <swiper-slide v-for="item of swiperList" :key="item.id"
      >
        <img class="swiper-img" :src="item.imgUrl">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'HomeSwiper',
  data () {
    return {
      swiperOptions: {
        pagination: '.swiper-pagination',
        loop: true,
        autoplay: 1800,
        disableOnInteraction: false,
        autoplayDisableOnInteraction: false, // 解决swiper手动改滑动之后，不再自动滑动了
        observer: true,
        observeParents: true
      },
      swiperList: [
        {
          id: '0001',
          imgUrl: 'http://img1.qunarzz.com/piao/fusion/1807/c6/44fce1467be17702.jpg_750x200_406f5fc3.jpg'
        },
        {
          id: '0002',
          imgUrl: 'http://img1.qunarzz.com/piao/fusion/1807/22/382624cbe97b0502.jpg_750x200_36a074d6.jpg'
        }
      ]
    }
  }

}
</script>

<style lang="stylus" scoped>
.wrapper >>> .swiper-pagination-bullet-active
  background: #fff !important

@import '~styles/varibles.styl'
.wrapper
  overflow: hidden
  width: 100%
  height: 0
  padding-bottom: 25%
  background: #eee

  .swiper-img
    width: 100%
</style>
