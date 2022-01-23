<script>
export default {
  created() {
    this.navBarItem.forEach((v, idx) => {
      if (decodeURI(this.$route.path).search(v.path) !== -1) {
        this.activeNum = idx
      }
    })
  },
  data() {
    return  {
      activeNum: 0
    }
  },
  // 父子组件传递数据
  props: {
    navBarItem: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    clickNavItem(path, idx) {
      if (this.activeNum === idx) {
        return
      }
      this.activeNum = idx
      this.$emit('clickNavItem', path)
    }
  }
};
</script>

<template>
  <div class=nav-bar>
    <div class="nav">
      <div
          class="nav-item"
          v-for="(v, idx) in navBarItem"
          :key="idx"
          :class="idx === activeNum ? 'active' : ''"
          @click="clickNavItem(v.path, idx)"
       >
        {{ v.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  height: 60px;
  width: 100%;
  position: relative;
}

.nav {
  display: flex;
  align-content: center;
  position: relative;
  left: 0;
  padding: 10px 0 20px 20px;
  color: rgb(49, 49, 49);
  width: 100%;
  background-color: #fff;
  z-index: 100;
  top: 0;
}

.nav-item {
  font-size: 15px;
  margin: 10px 10px;
  text-align: center;
  cursor: pointer;
}

.active {
  font-size: 18px;
  color: black;
  font-weight: 700;
  padding-bottom: 3px;
  border-bottom: 3px solid #ec4141;
}
</style>