<template>
  <div class="icons">
    <swiper id="swiper"
            :options="swiperOption"
            v-if="showSwiper"
    >
      <swiper-slide v-for="(page, index) of pages" :key="index"
      >
        <div class="icon" v-for="item of page" :key="item.id">
          <div class="icon-img">
            <img class="icon-img-content" :src="item.imgUrl">
          </div>
          <p class="icon-desc">{{ item.desc }}</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'HomeIcons',
  props: {
    list: Array
  },

  data () {
    return {
      swiperOption: {
        loop: true,
        autoplay: 2500,
        disableOnInteraction: false,
        autoplayDisableOnInteraction: false, // 解决swiper手动改滑动之后，不再自动滑动了
        observer: true,
        observeParents: true
      }
    }
  },

  computed: {
    pages () {
      const pages = []
      this.list.forEach((item, index) => {
        // 页码计算
        const page = Math.floor(index / 8)
        if (!pages[page]) {
          pages[page] = []
        }
        pages[page].push(item)
      })
      return pages
    },

    showSwiper () {
      return this.list.length
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
@import '~@/assets/styles/mixins.styl'
.icons >>> .swiper-container
  overflow: hidden
  height: 0
  padding-bottom: 50%

.icons
  margin-top: .1rem

  .icon
    position: relative
    overflow: hidden
    height: 0
    float: left
    width: 25%
    padding-bottom: 25%

    .icon-img
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: .40rem
      box-sizing: border-box
      padding: 0.1rem

      .icon-img-content
        display: block
        margin: 0 auto
        height: 110%

    .icon-desc
      position: absolute
      left: 0
      right: 0
      bottom: 0.08rem
      height: 0.48rem
      line-height: 0.48rem
      text-align: center
      font-size: .26rem
      color: $darkTextColor
      ellipsis()
</style>
