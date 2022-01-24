<script>
let obj

export default {
  props: {
    // 所要滚动对象
    scroll: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      isShow: false,
      // 第一次加载无需添加hideBtn类
      isFirstLoad: true
    }
  },
  methods: {
    goTop() {
      this.el.scrollTo({
        behavior: 'smooth',
        top: 0
      })
    }
  },
  mounted() {
    if (this.scroll === '') {
      obj = document
      this.el = document.documentElement
    } else {
      obj = document.querySelector(this.scroll)
      this.el = obj
    }
    obj.onscroll = (e) => {
      if (this.el.scrollTop >= 500 && this.isShow === false) {
        this.isShow = true
        this.isFirstLoad ? (this.isFirstLoad = false) : ''
      } else if (this.el.scrollTop < 500 && this.isShow) {
        this.isShow = false
      }
    }
  }
}
</script>

<template>
  <div
   class="go-top"
   :class="isShow ? 'show-btn' : isFirstLoad ? '' : 'hide-btn'"
   @click="goTop"
  >
    <i class="iconfont icon-fanhuidingbu" />
  </div>
</template>

<style scoped>
.go-top {
  position: fixed;
  background-color: #f8f8f8;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 10000;
  cursor: pointer;
  bottom: -40px;
  right: 40px;
}

.go-top i {
  font-size: 16px;
  color: #888;
}

.show-btn {
  /** ease默认 动画以低速开始，然后加快，在结束前变慢 */
  animation: show-btn 0.7s ease;
  /** 元素将应用动画结束时属性值 */
  animation-fill-mode: forwards;
}

.hide-btn {
  /** 动画以低速开始 */
  animation: hide-btn 0.3s ease-in;
  animation-fill-mode: forwards;
}

.go-top:hover {
  box-shadow: 0 20px 25px -8px rgba(0, 0, 0, 0.1),
  0 10px 10px -8px rgba(0, 0, 0, 0.04);
}

@keyframes show-btn {
  0% {
    bottom: -50px;
  }
  50% {
    bottom: 115px;
  }
  100% {
    bottom: 85px;
  }
}

@keyframes hide-btn {
  from {
    bottom: 85px;
  }
  to {
    bottom: -90px;
  }
}
</style>