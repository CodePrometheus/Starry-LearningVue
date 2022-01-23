<script>
import NavBar from '@/components/navBar/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      navBarItem: [
        {name: '个性推荐', path: '/discover/recommend'},
        {name: '歌单', path: '/discover/music-list'},
        {name: '排行榜', path: '/discover/ranking'},
        {name: '歌手', path: '/discover/singer'},
      ],
    };
  },
  methods: {
    clickNavItem(path) {
      this.$router.push(path)
    }
  }
};
</script>

<template>
  <div class="discover-main">
    <nav-bar @clickNavItem="clickNavItem" :navBarItem="navBarItem"/>
    <router-view class="discover"/>
  </div>
</template>

<style scoped>
.discover-main {
  overflow: hidden;
  padding: 0 !important;
}

.discover {
  margin: auto;
  overflow: scroll;
  height: 82.3vh;
  padding: 0 15px;
}
</style>
