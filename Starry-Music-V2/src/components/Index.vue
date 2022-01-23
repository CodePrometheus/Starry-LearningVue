<script>
import TopBar from './topBar/TopBar.vue'
import BtmBar from './btmBar/BtmBar.vue'

export default {
  components: { TopBar, BtmBar },
  data() {
    return {
      // 当前激活菜单的 index
      defaultActive: ''
    }
  }
};
</script>

<template>
  <el-container>
    <el-header>
      <top-bar />
    </el-header>
    <el-container>
      <el-aside width="160px">
        <el-menu
            active-text-color="black"
            router
            :default-active="defaultActive"
        >
          <el-menu-item index="/discover">
            <i class="iconfont icon-yinle"/>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/video">
            <i class="iconfont icon-shipin"/>
            <span slot="title">视频</span>
          </el-menu-item>
          <el-menu-item index="/favorites">
            <i class="iconfont icon-more"/>
            <span slot="title">收藏</span>
          </el-menu-item>
          <el-menu-item index="/recommendMusic">
            <i class="iconfont icon-good"/>
            <span slot="title">每日推荐</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view class="router-view" :key="$route.fullPath"/>
        <a
            target="_blank"
            id="downloadCurrentMusic"
        />
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
  height: 87.5vh;
}

.el-main {
  padding: 0;
}

.router-view {
  padding: 0 15px;
  margin: 0;
  /*width: 100%;*/
  /*height: calc(80vh - 105px);*/
}

.el-menu {
  border: none;
}

.el-menu-item {
  padding: 0 0 0 20px !important;
  margin: 3px 0 !important;
}

.el-menu-item:hover {
  background-color: #f5f5f6 !important;
}

</style>
