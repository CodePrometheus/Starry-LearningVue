<script>
import TopBar from './topBar/TopBar.vue'

export default {
  components: { TopBar }
}
</script>

<template>
  <el-container>
    <el-header>
      <top-bar/>
    </el-header>
    <el-container>
      <el-aside width="160px">
        aside
      </el-aside>
      <el-main>
        main
      </el-main>
    </el-container>
    <btm-bar/>
  </el-container>
</template>

<style scoped>
.el-header {
  background-color: #ec4141;
  height: 50px !important;
  margin: 0;
  padding: 0;
  z-index: 100;
}

.iconfont {
  font-size: 14px;
  margin: 5px !important;
}

.is-active {
  background-color: #f6f6f7;
  font-size: 14px;
  font-weight: 600;
}

.el-aside {
  border-right: 1px solid #ccc;
  height: calc(80vh - 105px);
}

.el-main {
  padding: 0;
}
</style>
