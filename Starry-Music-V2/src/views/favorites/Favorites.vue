<script>
import NavBar from '@/components/navBar/NavBar.vue'

export default {
  components: { NavBar },
  created() {
    if (!this.$store.state.isLogin) {
      this.$message.error("收藏页面只有登录后才能访问哦!")
      this.$router.replace("/index")
    }
  },
  data() {
    return {
      navBarItem: [
        { name: "专辑", path: "/favorites/album" },
        { name: "歌手", path: "/favorites/singer" },
        { name: "视频", path: "/favorites/video" },
      ],
    }
  },
  methods: {
    clickNavItem(path) {
      this.$router.push(path)
    }
  }
}
</script>

<template>
  <div class="favorites-main">
    <nav-bar @clickNavItem="clickNavItem" :navBarItem="navBarItem"/>
    <router-view class="favorites"/>
  </div>
</template>

<style scoped>
.favorites-main {
  padding: 0 !important;
  overflow-y: hidden;
}

.favorites {
  height: calc(80vh - 100px);
  overflow-y: scroll;
}
</style>