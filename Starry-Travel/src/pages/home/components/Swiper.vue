<template>
  <div class="wrapper">
    <!--  解决默认显示图片是最后一张，只需要v-if由完整的数据创建，list为空则不创建  -->
    <swiper :options="swiperOptions" v-if="showSwiper"
    >
      <swiper-slide v-for="item of list" :key="item.id"
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
  props: {
    list: Array
  },
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
      }
    }
  },

  computed: {
    showSwiper () {
      return this.list.length
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
