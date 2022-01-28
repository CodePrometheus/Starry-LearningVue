<script>
import TopBar from './topBar/TopBar.vue'
import BtmBar from './btmBar/BtmBar.vue'

export default {
  components: { TopBar, BtmBar },
  data() {
    return {
      // 当前激活菜单的 index
      defaultActive: '',
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: [],
    }
  },
  methods: {
    async getUserMusicList() {
      if (!this.$store.state.isLogin) {
        this.$message.error("请先进行登录操作")
        return
      }
      let timestamp = Date.parse(new Date())
      let res = await this.$request("/user/playlist", {
        uid: window.localStorage.getItem("userId"),
        timestamp
      })
      res = res.data.playlist
      let idx = res.findIndex(v => v.subscribed === true)
      this.createdMusicList = res.slice(0, idx);
      this.collectedMusicList = res.slice(idx)
      this.createdMusicList[0].name = "我喜欢的音乐"
      this.$store.commit("updateCollectMusicList", this.collectedMusicList)
      this.$store.commit("updateCreatedMusicList", this.createdMusicList)
    }
  },
  watch: {
    "$store.state.isLogin"(current) {
      if (current) {
        this.getUserMusicList()
      } else {
        this.createdMusicList = []
        this.collectedMusicList = []
      }
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
          <el-menu-item index="/recommend-music">
            <i class="iconfont icon-good"/>
            <span slot="title">每日推荐</span>
          </el-menu-item>
          <el-menu-item-group v-if="createdMusicList.length !== 0">
            <template slot="title" class="group-title">创建的歌单</template>
            <el-menu-item
              v-for="(v, idx) in createdMusicList"
              :key="idx"
              :index="'/music-list-detail/' + v.id"
            >
              <i class="iconfont icon-gedan"/>{{ v.name }}
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="collectedMusicList.length !== 0">
            <template slot="title" class="group-title">收藏的歌单</template>
            <el-menu-item
                v-for="(v, idx) in collectedMusicList"
                :key="idx"
                :index="'/music-list-detail/' + v.id"
            >
              <i class="iconfont icon-gedan"/>{{ v.name }}
            </el-menu-item>
          </el-menu-item-group>
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
  height: 88.9vh;
}

.el-main {
  padding: 0;
}

.router-view {
  padding: 0 15px;
  margin: 0;
  width: 100%;
  height: calc(100vh - 120px);
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

.el-menu-item-group {
  margin-top: 8px;
}
</style>
