<template>
  <div>
    <div class="search">
      <input v-model="keyword"
             class="search-input"
             type="text"
             placeholder="输入城市名或拼音"
      >
    </div>
    <div class="search-content" ref="search" v-show="keyword">
      <ul>
        <li class="search-item border-bottom"
            v-for="item of list"
            :key="item.id"
            @click="handleCityClick(item.name)"
        >
          {{ item.name }}
        </li>
        <li class="search-item border-bottom"
            v-show="hasNoData"
        >
          没有匹配的数据
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import { mapMutations } from 'vuex'

export default {
  name: 'CitySearch',
  props: {
    cities: Object
  },
  data () {
    return {
      keyword: '',
      list: [],
      timer: null
    }
  },

  methods: {
    handleCityClick (city) {
      this.toChangeCity(city)
      this.keyword = ''
      // 搜索选择完跳转到首页
      this.$router.push('/')
    },
    ...mapMutations(['toChangeCity'])
  },

  computed: {
    hasNoData () {
      return !this.list.length
    }
  },

  watch: {
    keyword () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {
        this.list = []
        return
      }
      this.timer = setTimeout(() => {
        const result = []
        for (let i in this.cities) {
          this.cities[i].forEach((value) => {
            // search from city.json
            if (value.spell.indexOf(this.keyword) > -1 || value.name.indexOf(this.keyword) > -1) {
              // add
              result.push(value)
            }
          })
        }
        // list存储包含关键词的所有城市
        this.list = result
      }, 100)
    }
  },

  mounted () {
    this.scroll = new Bscroll(this.$refs.search)
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.search
  height: 0.72rem
  padding: 0 .1rem
  background: $bgColor

  .search-input
    font-family: Helvetica, Arial, sans-serif
    box-sizing: border-box
    width: 100%
    padding: 0 .1rem
    line-height: 0.62rem
    text-align: center
    border-radius: 0.06rem
    color: #666

.search-content
  z-index: 1
  position: absolute
  overflow: hidden
  top: 1.58rem
  left: 0
  right: 0
  bottom: 0
  background: #eee

  .search-item
    line-height: .62rem
    padding-left: .2rem
    color: #666
    background: #fff
    text-align: left
</style>
