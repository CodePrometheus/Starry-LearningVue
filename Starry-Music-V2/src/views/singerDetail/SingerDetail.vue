<script>
import ListTable from '@/components/listTable/ListTable.vue'
import VideoCard from '@/components/videoCard/VideoCard.vue'
import GoTop from '@/components/goTop/GoTop.vue'

import { handleMusicTime } from '../../plugins/utils'

// 记录上一首播放的音乐信息  用于清空小喇叭和红字样式
let currentRowInfo = {}
// 定时器名称
let timer

export default {
  components: { ListTable, VideoCard, GoTop },
  created() {
    this.getSingerInfo()
  },
  async mounted() {
    await this.getAlbumInfo()
    await this.getSingerTopSongs()
  },
  data() {
    return {
      singerInfo: {},
      isCollect: false,
      topSongs: {},
      singerAlbum: [],
      singerMvInfo: {
        mvs: [],
        hasMore: false
      },
      // 专辑页数
      albumPage: 1,
      // mv页数
      mvPage: 1,
      disabled: true,
      isMore: false,
      // 是否是双击操作
      isDb: false,
      // 查看全部按钮
      isFindAllShow: true,
    };
  },
  methods: {
    async getSingerInfo() {
      let res = await this.$request('/artist/detail', {
        id: this.$route.params.id,
      });
      this.singerInfo = res.data.data.artist
    },
    async getSingerTopSongs() {
      let res = await this.$request('/artist/top/song', {
        id: this.$route.params.id
      })
      let topSongs = res.data.songs
      topSongs.forEach((v, idx) => {
        topSongs[idx].dt = handleMusicTime(v.dt)
      })
      // topSongs改成对象，并向里面添加isOpen属性，用于点击查看列表所有歌曲
      this.topSongs = {
        topSongs,
        isOpen: false
      }
    },
    async getAlbumInfo() {
      let res = await this.$request('/artist/album', {
        id: this.$route.params.id,
        limit: 20,
        offset: (this.albumPage - 1) * 20
      })
      this.isMore = res.data.more
      res = res.data.hotAlbums
      await res.forEach(v => {
        this.getAlbumDetail(v.id)
      })
    },
    async getAlbumDetail(id) {
      let res = await this.$request('/album', { id })
      res = res.data
      let songs = res.songs
      // time handle
      songs.forEach((v, idx) => {
        songs[idx].dt = handleMusicTime(v.dt)
      })
      res.songsObj = { songs }
      this.singerAlbum.push(res)
    },
    async getSingerMv() {
      let res = await this.$request('/artist/mv', {
        id: this.$route.params.id,
        limit: 20 * this.mvPage
      })
      this.singerMvInfo = res.data
    },
    collect() {
    },
    clickTab(e) {
      if (e.index === '1' && this.singerMvInfo.mvs.length === 0) {
        this.getSingerMv()
      }
    },
    clickRow(e) {
      if (document.querySelector(".select-row")) {
        document.querySelector(".select-row")
        .classList.remove("select-row")
      }
      e.classList.add("select-row")
    },
    dblClickRow({ id, idx, listId }) {
      this.isDb = true
      this.listenMusic(id, idx, listId)
      if (listId !== this.$route.params.id) {
        let musicListIdx = this.singerAlbum.findIndex(v => v.album.id === listId)
        this.$store.commit("updateMusicId", id)
        // 歌单发生变化
        if (listId !== this.$store.state.musicListId) {
          this.$store.commit("updateMusicList", {
            musicList: this.singerAlbum[musicListIdx].songs,
            musicListId: listId
          })
        }
      } else {
        this.$store.commit("updateMusicId", id)
        if (this.$route.params.id !== this.$store.state.musicListId) {
          this.$store.commit("updateMusicList", {
            musicList: this.topSongs.topSongs,
            musicListId: this.$route.params.id
          })
        }
      }
    },
    listenMusic(id, idx, listId) {
      if (currentRowInfo.listId) {
        this.cleanStyle(currentRowInfo.i, currentRowInfo.listId)
      }
    },
    cleanStyle(i, listId) {
      let table = document.querySelectorAll("table")
      // 歌单的索引
      let listIdx = -1
      if (listId === this.$route.params.id) {
        listIdx = 0
      } else {
        listIdx = this.singerAlbum.findIndex(v => v.album.id === listId)
        // 如果没有，说明目前还没有渲染或者还没有请求
        if (listIdx === -1) {
          this.$message.error("目前还没有渲染或者还没有请求")
          return
        }
        listIdx += 1
      }
      if (table[listIdx] && table[listIdx].children[i]) {
        let lastRow = table[listIdx].children[i]
        lastRow.querySelector(".index").innerHTML = i + 1
        lastRow.querySelector(".music-name").style.color = "#1f1f1f"
      }
    },
    clickFindAll() {

    },
    clickCardItem() {

    },
    bottomLoad() {
      if (this.singerMvInfo.hasMore === true) {
        this.mvPage += 1
        this.getSingerMv()
      }
    },
    load() {
      this.disabled = true
      this.albumPage += 1
      this.getAlbumInfo()
    }
  },
  computed: {
    getImageUrl() {
      return new URL(`..\\..\\assets\\img\\topSongsLogo.png`, import.meta.url).href
    }
  }
};
</script>

<template>
  <div class="singer-detail" v-if="singerInfo.cover">
    <div class="list-info">
      <div class="avatar">
        <img :src="singerInfo.cover + '?param=300y300'" :draggable="false" />
      </div>
      <div class="info">
        <div class="title">
          <div class="name">{{ singerInfo.name }}</div>
        </div>
        <div class="buttons">
          <div class="button-item" @click="collect">
            <i class="iconfont icon-xihuan" :class="isCollect ? 'red' : ''"/>
            <span>{{ isCollect ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="button-item">
            <i class="iconfont icon-link"/>
            <span>个人主页</span>
          </div>
        </div>
        <div class="music-info">
          <div class="music-num">单曲数 : {{ singerInfo.musicSize }}</div>
          <div class="music-num">专辑数 : {{ singerInfo.albumSize }}</div>
          <div class="music-num">mv数 : {{ singerInfo.mvSize }}</div>
        </div>
      </div>
    </div>
    <div class="music-list">
      <el-tabs @tab-click="clickTab" value="first">
        <el-tab-pane label="专辑" name="first">
          <div class="top-songs" v-if="topSongs.topSongs">
            <list-table
              :officialDetail="topSongs"
              @clickRow="clickRow"
              @dblClickRow="dblClickRow"
              @clickFindAll="clickFindAll"
              :isFindAllShow="isFindAllShow"
              :cover="getImageUrl"
              :idList="this.$route.params.id.toString()"
            >
              <div slot="title">
                <div class="title">热门50首</div>
              </div>
            </list-table>
          </div>
          <div
            class="album-main"
            v-if="singerAlbum.length !== 0"
            v-infinite-scroll="load"
            :infinite-scroll-disabled="disabled"
            :infinite-scroll-distance="300"
            :infinite-scroll-immediate="false"
          >
            <div
                class="album-item"
                v-for="(v, idx) in singerAlbum"
                :key="idx"
            >
              <list-table
                :officialDetail="v.songsObj"
                @clickRow="clickRow"
                @dblClickRow="dblClickRow"
                @clickFindAll="clickFindAll"
                :isFindAllShow="isFindAllShow"
                :cover="v.album.blurPicUrl + '?param=300y300'"
                :idList="v.album.id.toString()"
              >
                <div slot="title">
                  <div class="title">{{ v.album.name }}</div>
                </div>
              </list-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="MV" name="second">
          <video-card
            :videoList="singerMvInfo.mvs"
            :isLoad="true"
            @clickCardItem="clickCardItem"
            @bottomLoad="bottomLoad"
          />
        </el-tab-pane>
        <el-tab-pane label="歌手详情" name="third">
          <div class="singe-desc">{{ singerInfo.briefDesc }}</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <go-top scroll=".singer-detail" />
  </div>
</template>

<style scoped>
.singer-detail {
  overflow-y: scroll;
}

.list-info {
  display: flex;
  padding: 25px 10px;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
}

.info {
  margin-top: 10px;
  width: calc(100% - 200px);
}

.name {
  font-size: 28px;
  padding: 15px 30px;
  font-weight: 800;
  width: 90%;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #373737;
}

.buttons {
  margin: 10px 0 0 20px;
  display: flex;
}

.button-item {
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transform: scale(0.9);
  padding: 10px 15px;
}

.button-item i {
  font-size: 14px;
  margin-right: 5px;
}

.music-info {
  margin: 15px 0 0 30px;
  display: flex;
  font-size: 14px;
}

.music-num {
  padding: 0 8px;
}

.music-list {
  margin: 0 10px;
  height: 601px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
}

.singe-desc {
  line-height: 30px;
  font-size: 18px;
  /** 定义一个块元素首行文本内容之前的缩进量 */
  text-indent: 2em;
  /** 设置文本字符的间距表现 */
  letter-spacing: 1px;
  color: #373737;
}
</style>