<template>
  <ul class="list">
    <li
      class="item"
      v-for="item of letters"
      :key="item"
      :ref="item"
      @click="handleLetterClick"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'alphabet',
  props: {
    cities: Object
  },
  data () {
    return {
      touchStatus: false,
      startY: 0,
      timer: null
    }
  },

  // 放在外面更新
  updated () {
    this.startY = this.$refs['A'][0].offsetTop
  },

  computed: {
    letters () {
      const letters = []
      for (let i in this.cities) {
        letters.push(i)
      }
      return letters
    }
  },
  methods: {
    // 拿到所点击的字母
    handleLetterClick (e) {
      // 传给父组件，再转发给list子组件
      this.$emit('change', e.target.innerText)
    },
    // 触发
    handleTouchStart () {
      this.touchStatus = true
    },
    handleTouchMove (e) {
      e.preventDefault()
      if (this.touchStatus) {
        // 节流，限制函数执行频率
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          const startY = this.$refs['A'][0].offsetTop
          // 距离搜索框距离touchY
          const touchY = e.touches[0].clientY - 79
          // 每个字母高度20
          const index = Math.floor((touchY - startY) / 20)
          if (index >= 0 && index <= this.letters.length) {
            this.$emit('change', this.letters[index])
          }
        }, 16)
      }
    },
    handleTouchEnd () {
      this.touchStatus = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/varibles.styl'
* {
  touch-action: pan-y;
}

.list
  display: flex
  flex-direction: column
  justify-content: center
  position: absolute
  top: 1.58rem
  right: 0
  bottom: 0
  width: .4rem

  .item
    line-height: .4rem
    text-align: center
    color: $bgColor
</style>
