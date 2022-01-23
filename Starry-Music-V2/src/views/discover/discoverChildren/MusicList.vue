<script>
</script>

<template>
  <div class="music-list-main">
    <div class="music-list">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.music-list-main {
  display: flex;
  /** 水平分布方式 */
  justify-content: center;
  width: 100%;
}

.music-list {
  padding: 10px;
  width: 1200px;
}
</style>