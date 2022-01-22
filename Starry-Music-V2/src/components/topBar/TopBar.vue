<script>
let timer
export default {
  async created () {
    await this.getHotSearch()
  },
  data () {
    return {
      keywords: "",
      searchSuggestList: {},
      hotSearchList: [],
      isSearchPopShow: false
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
      console.log("res: ", res)
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

    }
  }
}
</script>

<template>
  <div class="topBar">
    <div class="logo">
      <img src="../../assets/img/logo.png"/>
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
          popper-class="searchPop"
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
            <div class="searchTitle">热搜榜</div>
            <div
              class="hotItem"
              v-for="(v, idx) in hotSearchList"
              :key="idx"
              @click="clickHotSearchItem(v.searchWord)"
            >
              <div
                class="hotIndex"
                :class="idx < 3 ? 'topThree' : ''"
              >
                {{ idx + 1 }}
              </div>
              <div>
                <div
                  class="hotWord"
                  :class="idx < 3 ? 'hotWordTopThree' : ''"
                >
                  {{ v.searchWord }}
                </div>
                <div class="hotContent">
                  {{ v.content }}
                </div>
              </div>
            </div>
          </div>
          <!-- 搜索建议 -->
          <div class="searchSuggest">
            <div class="searchTitle" v-if="searchSuggestList.songs">
              搜索建议
            </div>
            <div
              class="suggestItem"
              v-if="searchSuggestList.songs && searchSuggestList.songs.length !== 0"
            >
              <div class="suggestItemTitle">
                <i class="iconfont icon-yinle"/>单曲
              </div>
              <div
                class="suggestItemDetail"
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
              <div class="suggestItemTitle">
                <i class="iconfont icon-mic"/> 歌手
              </div>
              <div class="suggestItemDetail"
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
              <div class="suggestItemTitle">
                <i class="iconfont icon-more"/> 专辑
              </div>
              <div class="suggestItemDetail"
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
              <div class="suggestItemTitle  ">
                <i class="iconfont icon-gedan"/> 歌单
              </div>
              <div class="suggestItemDetail"
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
            width="300"
            trigger="click"
          >
          </el-popover>
        </div>
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

.searchTitle {
  font-size: 13px;
  margin: 10px 0 5px 20px;
}

.hotItem {
  display: flex;
  align-items: center;
  padding: 6px 15px;
  /** 指针样式 */
  cursor: pointer;
}

.hotItem:hover {
  background-color: #f2f2f2;
}

.hotIndex {
  margin-right: 15px;
  color: #aaa;
}

.topThree {
  color: #e13e3e;
}

.hotWord {
  font-size: 12px;
  color: rgb(51, 51, 51);
}

.hotWordTopThree {
  font-weight: 600;
  color: black;
}

.hotContent {
  font-size: 12px;
  /** 缩放 */
  transform: scale(0.9) translateX(-5%);
}

.searchSuggest {
  font-size: 12px;
}

.suggestItem {
  cursor: pointer;
}

.suggestItemTitle {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.suggestItemTitle i {
  font-size: 15px;
}

.suggestItemDetail {
  font-size: 12px;
  padding: 4px 26px;
}

.suggestItemDetail:hover {
  background-color: #f2f2f2;
}
</style>
