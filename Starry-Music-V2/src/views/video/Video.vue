<script>
import NavBar from '@/components/navBar/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      navBarItem: [
        {
          name: '视频',
          path: '/video/video-list'
        },
        {
          name: 'MV',
          path: '/video/mv-list'
        }
      ]
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
  <div class="video-main">
    <nav-bar @clickNavItem="clickNavItem" :navBarItem="navBarItem"/>
    <router-view class="video-list"/>
  </div>
</template>

<style scoped>
.video-main {
  overflow-y: hidden;
  padding: 0 !important;
}
</style>