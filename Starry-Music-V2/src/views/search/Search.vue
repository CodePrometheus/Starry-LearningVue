<script>
import NavBar from '@/components/navBar/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      navBarItem: [
        {
          name: "单曲",
          path: `/search/song/${this.$route.params.id}`
        },
        {
          name: "歌手",
          path: `/search/singer/${this.$route.params.id}`
        },
        {
          name: "专辑",
          path: `/search/album/${this.$route.params.id}`
        },
        {
          name: "视频",
          path: `/search/video/${this.$route.params.id}`
        },
        {
          name: "歌单",
          path: `/search/music-list/${this.$route.params.id}`
        },
      ]
    }
  },
  methods: {
    clickNavItem(path) {
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<template>
  <div class="search-main">
    <nav-bar @clickNavItem="clickNavItem" :navBarItem="navBarItem"/>
    <router-view />
  </div>
</template>