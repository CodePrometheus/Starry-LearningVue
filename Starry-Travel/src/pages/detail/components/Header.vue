<template>
  <div>
    <!-- 通过绑定:style的opacity属性来动态改变透明度 -->
    <router-link
      tag="div"
      to="/"
      class="header-abs"
      v-show="showAbs"
      :style="opacityAbsStyle"
    >
      <div class="iconfont back-icon-back">&#xe624;</div>
    </router-link>
    <div class="header-fixed"
         v-show="!showAbs"
         :style="opacityFixedStyle"
    >
      <router-link to="/">
        <div class="iconfont header-fixed-back">&#xe624;</div>
      </router-link>
      景点详情
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailHeader',
  data () {
    return {
      showAbs: true,
      // 返回键的渐变
      opacityAbsStyle: {
        opacity: 1
      },
      // 固定标题栏的渐变
      opacityFixedStyle: {
        opacity: 0
      }
    }
  },

  methods: {
    handleScroll () {
      console.log('scroll')
      // 特别注意，scrollTop中的每一对()都是来自网络的一种取法。已兼容安卓浏览器和UA为苹果的浏览器
      const scrollTop = (window.parent.document.documentElement.scrollTop || window.parent.document.body.scrollTop) || (document.body.scrollTop + document.documentElement.scrollTop) || (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)

      if (scrollTop > 40) { // 固定标题栏的渐变
        let opacity = scrollTop / 130
        opacity = opacity > 1 ? 1 : opacity
        this.opacityFixedStyle = {
          opacity
        }
        this.showAbs = false
      } else { // 返回键的渐变
        this.showAbs = true
        let opacity = scrollTop / 40
        opacity = opacity > 1 ? 1 : opacity
        this.opacityAbsStyle = {
          opacity: (1 - opacity)
        }
      }
    }
  },


  activated () {
    window.addEventListener('scroll', this.handleScroll)
  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },

  created () {
    // 特别注意 如果在App.vue 中使用了keep-alive exclude="Detail"
    // 那么不会执行activated(),但是会有created()
    window.addEventListener('scroll', this.handleScroll)
  }

}
</script>

<style lang="stylus" scoped>
@import '~styles/varibles.styl'
.header-abs
  position: absolute
  left: .2rem
  top: .2rem
  width: .8rem
  height: .8rem
  line-height: .8rem
  border-radius: .4rem
  text-align: center
  background: rgba(0, 0, 0, .8)

  .header-abs-back
    color: #fff
    font-size: .4rem

.header-fixed
  z-index: 2
  position: fixed
  top: 0
  left: 0
  right: 0
  height: $headerHeight
  line-height: $headerHeight
  text-align: center
  color: #fff
  background: $bgColor
  font-size: .32rem

  .header-fixed-back
    position: absolute
    top: 0
    left: 0
    width: .64rem
    text-align: center
    font-size: .4rem
    color: #fff
</style>
