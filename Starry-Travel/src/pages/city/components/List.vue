<template>
  <!-- ref获取dom -->
  <div class="list" ref="wrapper">
    <div>
      <div class="area">
        <div class="title">当前城市</div>
        <div class="button-list">
          <div class="button-wrapper">
            <div class="button">{{ this.currentCity }}</div>
          </div>
        </div>
      </div>

      <div class="area">
        <div class="title border-topbottom">热门城市</div>
        <div class="button-list">
          <div class="button-wrapper"
               v-for="item of hot"
               :key="item.id"
               @click="handleCityClick(item.name)"
          >
            <div class="button">{{ item.name }}</div>
          </div>
        </div>
      </div>

      <div class="area" v-for="(item, key) of cities" :key="key" :ref="key">
        <div class="title border-topbottom">{{ key }}</div>
        <div class="item-list" v-for="innerItem of item" :key="innerItem.id">
          <div
            class="item border-bottom"
            @click="handleCityClick(innerItem.name)"
          >
            {{ innerItem.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'CityList',
  mounted () {
    this.scroll = new Bscroll(this.$refs.wrapper)
  },
  props: {
    cities: Object,
    hot: Array,
    letter: String
  },

  computed: {
    ...mapState({
      currentCity: 'city'
    })
  },

  methods: {
    handleCityClick (city) {
      // this.$store.commit('toChangeCity', city)
      this.toChangeCity(city)
      this.$router.push('/')
    },
    ...mapMutations(['toChangeCity'])
  },

  // 监听letter的变化，滚动到点击的字母
  watch: {
    letter () {
      if (this.letter) {
        const element = this.$refs[this.letter][0]
        this.scroll.scrollToElement(element)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.border-topbottom
  &:before
    border-color: #ccc

  &:after
    border-color: #ccc

.border-bottom
  &:before
    border-color: #ccc

.list
  overflow: hidden
  position: absolute
  top: 1.58rem
  bottom: 0
  width: 100%;
  max-width: 650px

  .title
    font-family: Helvetica, Arial, sans-serif
    line-height: 0.54rem
    background: #eee
    padding-left: .2rem
    color: #666
    font-size: .22rem
    text-align: left

  .button-list
    overflow: hidden
    padding: .1rem 0.6rem .1rem .1rem

    .button-wrapper
      float: left
      width: 33.33%

      .button
        font-family: Helvetica, Arial, sans-serif
        margin: .1rem
        padding: .1rem 0
        text-align: center
        border: 0.02rem solid #ccc
        border-radius: .06rem
        font-size: .26rem

  .item-list
    .item
      line-height: 0.72rem
      padding-left: 0.2rem
      text-align: left

</style>
