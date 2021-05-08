<template>
  <div>
    <div class="banner" @click="handleBannerClick">
      <img class="banner-img" :src="bannerImg">
      <div class="banner-info">
        <div class="banner-title">{{ this.sightName }}</div>
        <div class="banner-number">
          <span class="iconfont banner-icon">&#xe692;</span>
          &nbsp;{{ this.galleryImg.length }}
        </div>
      </div>
    </div>
    <fade-animation>
      <gallery :imgs="galleryImg" v-show="showGallery"
               @Gallery-Close="handleGalleryClose"/>
    </fade-animation>
  </div>
</template>

<script>
import Gallery from '../../../common/Gallery'
import FadeAnimation from '../../../common/FadeAnimation'

export default {
  name: 'Banner',
  components: {
    Gallery,
    FadeAnimation
  },
  props: {
    sightName: String,
    bannerImg: String,
    galleryImg: Array
  },

  data () {
    return {
      showGallery: false
    }
  },

  methods: {
    handleBannerClick () {
      this.showGallery = true
    },
    handleGalleryClose () {
      this.showGallery = !this.showGallery
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.banner
  position: relative
  overflow: hidden
  height: 0
  padding-bottom: 55%

  .banner-img
    width: 100%

  .banner-info
    display: flex
    position: absolute
    left: 0
    right: 0
    bottom: 0
    line-height: .6rem
    color: #fff
    background-image: linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))

    .banner-title
      flex: 1
      text-align: start
      font-size: .32rem
      padding: 0 .2rem

    .banner-number
      margin-top: .14rem
      padding: 0 .4rem
      height: .32rem
      line-height: .32rem
      border-radius: 0.2rem
      background: rgba(0, 0, 0, .8)
      font-size: .24rem

      .banner-icon
        font-size: .24rem
</style>
