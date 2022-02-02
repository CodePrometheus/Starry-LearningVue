<script>
import Login from '../login/Login.vue'

let timer
export default {
  components: { Login },
  async created () {
    await this.getHotSearch()
    await this.getCurrentUserInfo()
  },
  data () {
    return {
      keywords: "",
      searchSuggestList: {},
      hotSearchList: [],
      isSearchPopShow: false,
      isLoginPopShow: false,
      isRegisteredShow: false,
      userInfo: {},
    }
  },
  methods: {
    search (keywords) {
      clearTimeout(timer)
      if (keywords !== "") {
        timer = setTimeout(() => {
          this.getSearchSuggest(keywords)
        }, 500)
      } else {
        // 否则就清空
        this.searchSuggestList = {}
        return
      }
    },
    async getSearchSuggest (keywords) {
      let res = await this.$request('/search/suggest', { keywords })
      this.searchSuggestList = res.data.result
    },
    submit (event) {
      if (event.keyCode === 13 && this.keywords !== "") {
        this.doSearch()
      }
    },
    doSearch () {
      this.isSearchPopShow = false
      this.$router.push({
        name: 'search',
        params: {
          id: this.keywords
        }
      })
    },
    clickHotSearchItem (keywords) {
      this.keywords = keywords
      this.doSearch()
    },
    async getHotSearch () {
      let res = await this.$request('/search/hot/detail')
      this.hotSearchList = res.data.data
    },
    clickSuggestSong (id) {

    },
    clickSuggestSinger (id) {

    },
    clickSuggestAlbum (id) {

    },
    clickSuggestMusicList (id) {

    },
    async getCurrentUserInfo() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request("/user/account", {
        timestamp
      })
      if (res.data.profile != null) {
        this.userInfo = res.data.profile
        this.$store.commit("updateLoginState", true)
        window.localStorage.setItem("userId", res.data.profile.userId)
      } else {
        // 未登录
        this.$store.commit("updateLoginState", false)
        if (window.localStorage.getItem("userId")) {
          window.localStorage.removeItem("userId")
        }
      }
    },
    goToPersonal() {
      // 判断是否已在个人主页
      if (this.$route.path !== '/personal/${this.userInfo.userId}') {
        this.$router.push({
          name: 'personal',
          params: {
            uid: this.userInfo.userId
          }
        })
      }
    }
  }
}
</script>

<template>
  <div class="topBar">
    <div class="logo" @click="$router.push({ path: '/' })">
      <img src="../../assets/img/logo.png" :draggable="false"/>
    </div>
    <div class="center">
      <div class="buttons">
        <i class="iconfont icon-arrow-left-bold back" @click="$router.go(-1)"/>
        <i class="iconfont icon-arrow-right-bold forward" @click="$router.go(1)"/>
      </div>
      <div>
        <!-- 热搜榜 -->
        <el-popover
          width="330"
          trigger="focus"
          popper-class="search-pop"
          v-model="isSearchPopShow"
        >
          <el-input
            placeholder="请输入关键字"
            prefix-icon="el-icon-search"
            size="mini"
            slot="reference"
            @input="search"
            @keyup.enter.native="submit"
            v-model="keywords"
          />
          <!-- 热搜榜 -->
          <div v-if="!searchSuggestList.songs">
            <div class="search-title">热搜榜</div>
            <div
              class="hot-item"
              v-for="(v, idx) in hotSearchList"
              :key="idx"
              @click="clickHotSearchItem(v.searchWord)"
            >
              <div
                class="hot-index"
                :class="idx < 3 ? 'top-three' : ''"
              >
                {{ idx + 1 }}
              </div>
              <div>
                <div
                  class="hot-word"
                  :class="idx < 3 ? 'hot-word-top-three' : ''"
                >
                  {{ v.searchWord }}
                </div>
                <div class="hot-content">
                  {{ v.content }}
                </div>
              </div>
            </div>
          </div>
          <!-- 搜索建议 -->
          <div class="search-suggest">
            <div class="search-title" v-if="searchSuggestList.songs">
              搜索建议
            </div>
            <div
              class="suggestItem"
              v-if="searchSuggestList.songs && searchSuggestList.songs.length !== 0"
            >
              <div class="suggest-item-title">
                <i class="iconfont icon-yinle"/>单曲
              </div>
              <div
                class="suggest-item-detail"
                v-for="(v, idx) in searchSuggestList.songs"
                :key="idx"
                @click="clickSuggestSong(v.id)"
              >
                {{ v.name + " - " + v.artists[0].name }}
              </div>
            </div>
            <div class="suggestItem"
                 v-if="searchSuggestList.artists &&
                       searchSuggestList.artists.length !== 0"
            >
              <div class="suggest-item-title">
                <i class="iconfont icon-mic"/> 歌手
              </div>
              <div class="suggest-item-detail"
                   v-for="(v, idx) in searchSuggestList.artists"
                   :key="idx"
                   @click="clickSuggestSinger(v.id)"
              >
                {{ v.name }}
              </div>
            </div>
            <div class="suggestItem"
                 v-if="searchSuggestList.albums &&
                       searchSuggestList.albums.length !== 0"
            >
              <div class="suggest-item-title">
                <i class="iconfont icon-more"/> 专辑
              </div>
              <div class="suggest-item-detail"
                   v-for="(v, idx) in searchSuggestList.albums"
                   :key="idx"
                   @click="clickSuggestAlbum(v.id)"
              >
                {{ v.name + " - " + v.artist.name }}
              </div>
            </div>
            <div class="suggestItem"
                 v-if="searchSuggestList.playlists &&
                       searchSuggestList.playlists.length !== 0"
            >
              <div class="suggest-item-title  ">
                <i class="iconfont icon-gedan"/> 歌单
              </div>
              <div class="suggest-item-detail"
                   v-for="(v, idx) in searchSuggestList.playlists"
                   :key="idx"
                   @click="clickSuggestMusicList(v.id)"
              >
                {{ v.name }}
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="right">
      <div class="user">
        <div class="avatar">
          <el-popover
            width="340"
            trigger="click"
            v-if="!userInfo.avatarUrl"
          >
            <login
              :isRegisteredShow.sync="isRegisteredShow"
              @getUserInfo="(info) => {
                   userInfo = info
                   isLoginPopShow = false
                 }"
            />
            <img src="../../assets/img/test.jpg" slot="reference" @click="isLoginPopShow = !isLoginPopShow" :draggable="false" />
          </el-popover>
          <img :src="userInfo.avatarUrl" slot="reference" v-else @click="goToPersonal"/>
        </div>
        <div class="user-name" v-if="userInfo.nickname">
          {{ userInfo.nickname }}
        </div>
        <div class="user-name" v-else>点击头像登录</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'HeaderBar-element.css';

.topBar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 30000;
}

.logo {
  width: 110px;
  margin: 0 50px 0 10px;
}

.logo img {
  width: 100%
}

.center {
  display: flex;
  align-items: center;
}

.buttons {
  color: rgb(235, 235, 235);
  height: 22px;
}

.buttons i {
  background-color: #e13e3e;
  padding: 5px;
  height: 22px;
  border-radius: 50%;
  margin: 0 3px;
}

.search-title {
  font-size: 13px;
  margin: 10px 0 5px 20px;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 6px 15px;
  /** 指针样式 */
  cursor: pointer;
}

.hot-item:hover {
  background-color: #f2f2f2;
}

.hot-index {
  margin-right: 15px;
  color: #aaa;
}

.top-three {
  color: #e13e3e;
}

.hot-word {
  font-size: 12px;
  color: rgb(51, 51, 51);
}

.hot-word-top-three {
  font-weight: 600;
  color: black;
}

.hot-content {
  font-size: 12px;
  /** 缩放 */
  transform: scale(0.9) translateX(-5%);
}

.search-suggest {
  font-size: 12px;
}

.suggestItem {
  cursor: pointer;
}

.suggest-item-title {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.suggest-item-title i {
  font-size: 15px;
}

.suggest-item-detail {
  font-size: 12px;
  padding: 4px 26px;
}

.suggest-item-detail:hover {
  background-color: #f2f2f2;
}

.right {
  display: flex;
  /* 固定在右边*/
  position: absolute;
  right: 50px;
  top: 0;
  line-height: 50px;
}

.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 7px;
  cursor: pointer;
}

.avatar img {
  width: 100%;
}

.user-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  width: 100px;
}
</style>
