<script>
import GoTop from '@/components/goTop/GoTop.vue'
import Comment from '@/components/comment/Comment.vue'
import { formatDate, handleMusicTime } from '@/plugins/utils'

export default {
  components: { GoTop, Comment },
  created() {
    this.getAlbumComment()
  },
  async mounted() {
    await this.getAlbumDetail()
    this.$nextTick(() => {
      if (this.$route.params.id === this.$store.state.musicListId) {
        this.handleDom(this.$store.state.musicId)
      }
    })
    if (this.$store.state.collectedAlbum == null) {
      await this.getAlbumSubList()
    }
    this.getIsSub()
  },
  watch: {
    '$store.state.musicId'(current, last) {
      this.handleDom(current, last)
    },
  },
  data() {
    return {
      albumInfo: {},
      comments: {},
      page: 1,
      isSub: false,
      isCommentLoading: false,
    }
  },
  methods: {
    handleDom(current, last) {
      if (document.querySelector('.album')) {
        let tableRows = document.querySelector('.album').querySelectorAll('.el-table__row')
        let index = this.albumInfo.songs.findIndex(
          (item) => item.id === current,
        )
        if (index !== -1) {
          tableRows[index].children[0].querySelector(
            '.cell',
          ).innerHTML = `<div><i class="iconfont icon-yinliang"></i></div>`
          tableRows[index].children[0].querySelector('.iconfont').classList.add('current-row')
          tableRows[index].children[2].querySelector('.cell').classList.add('current-row')
        }
        if (last !== -1) {
          let lastIndex = this.albumInfo.songs.findIndex(
            (item) => item.id === last,
          )
          if (lastIndex !== -1) {
            tableRows[lastIndex].children[0].querySelector(
              '.cell',
            ).innerHTML = `<div>${
              lastIndex + 1 < 10 ? '0' + (lastIndex + 1) : lastIndex + 1
            }</div>`
            tableRows[lastIndex].children[2].querySelector('.cell').classList.remove('current-row')
          }
        }
      }
    },
    async getAlbumSubList() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request('/album/sublist', {
        limit: 1000,
        timestamp,
      })
      this.$store.commit('updateCollectedAlbum', res.data.data)
    },
    getIsSub() {
      this.isSub = this.$store.state.collectedAlbum.find(
        item => item.id === this.$route.params.id,
      )
    },
    async getAlbumDetail() {
      let res = await this.$request('album', { id: this.$route.params.id })
      res = res.data
      res.songs.forEach((v, idx) => {
        res.songs[idx].dt = handleMusicTime(v.dt)
      })
      this.albumInfo = res
    },
    async getAlbumComment(type) {
      let timestamp = Date.parse(new Date())
      this.isCommentLoading = true
      if (type === 'changePage') {
        let album = document.querySelector('.album')
        let info = document.querySelector('.list-info')
        album.scrollTo({
          behavior: 'smooth',
          top: info.clientHeight - 50,
        })
      }
      let res = await this.$request('/comment/album', {
        id: this.$route.params.id,
        offset: (this.page - 1) * 50,
        limit: 50,
        timestamp,
      })
      this.isCommentLoading = false
      if (res.data.code !== 200) {
        this.$message.error('获取评论失败,请稍后重试!')
        return
      }
      this.comments = res.data
    },
    playAll() {
      this.$store.commit('updateMusicId', this.albumInfo.songs[0].id)
      this.$store.commit('updateMusicList', {
        musicList: this.albumInfo.songs,
        musicListId: this.albumInfo.album.id,
      })
    },
    async subAlbum() {
      this.isSub = !this.isSub
      await this.$request('/album/sub', {
        id: this.$route.params.id,
        t: this.isSub ? 1 : 0,
      })
      await this.getAlbumSubList()
    },
    handleIndex(idx) {
      idx += 1
      if (idx < 10) {
        return '0' + idx
      } else {
        return idx
      }
    },
    async dblclick(row) {
      this.$store.commit('updateMusicId', row.id)
      if (this.albumInfo.album.id !== this.$store.state.musicListId) {
        this.$store.commit('updateMusicList', {
          musicList: this.albumInfo.songs,
          musicListId: this.albumInfo.album.id,
        })
      }
    },
    async clickCell(row, column, cell) {
      if (cell.querySelector('.icon-download')) {
        let res = await this.$request('/song/url', { id: row.id })
        if (res.data.data[0].url == null) {
          this.$message.warning('暂时无法获取该资源哦!')
          return
        }
        let url = res.data.data[0].url.match(/\http.*?\.net/)
        let serve = url[0].match(/http:\/(\S*).music/)[1]
        if (
          serve !== '/m7' &&
          serve !== '/m701' &&
          serve !== '/m8' &&
          serve !== '/m801'
        ) {
          this.$message.error('匹配不到对应的代理,下载失败!')
          return
        }
        let params = res.data.data[0].url.slice(url[0].length)
        let downloadMusicInfo = {
          url: serve + params,
          name:
            row.name +
            ' - ' +
            row.ar[0].name +
            '.' +
            res.data.data[0].type.toLowerCase(),
        }
        this.$store.commit('updateDownloadMusicInfo', downloadMusicInfo)
      }
    },
    changePage(page) {
      this.page = page
      this.getAlbumComment('changePage')
    },
  },
  filters: {
    showDate(value) {
      const date = new Date(value)
      return formatDate(date, 'yyyy-MM-dd')
    },
  },
}
</script>

<template>
  <div class="album" v-if="albumInfo.album">
    <div class="list-info">
      <div class="avatar">
        <img :src="albumInfo.album.picUrl + '?param=300?300'" :draggable="false"/>
      </div>
      <div class="right">
        <div class="title">
          <div class="tag">专辑</div>
          <div class="name">{{ albumInfo.album.name }}</div>
        </div>
        <div class="buttons">
          <div class="button-item play-all" @click="playAll">
            <i class="iconfont icon-bofang playAll"/>
            <span>播放全部</span>
          </div>
          <div class="button-item" @click="subAlbum">
            <i class="iconfont icon-xihuan" :class="isSub ? 'red' : ''"/>
            <span>{{ isSub ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="button-item">
            <i class="iconfont icon-zhuanfa"/>
            <span>分享</span>
          </div>
        </div>
        <div class="other-info">
          <div class="singer-name">
            歌手 :
            <span @click="$router.push({ name: 'singer-detail', params: { id: albumInfo.album.artist.id }})">
              {{ albumInfo.album.artist.name }}
            </span>
          </div>
        </div>
        <div class="other-info">
          <div class="play-count">
            时间 : {{ albumInfo.album.publishTime | showDate }}
          </div>
        </div>
      </div>
    </div>
    <div class="music-list">
      <el-tabs value="first">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table
            :data="albumInfo.songs"
            size="mini"
            style="width: 100%;"
            @row-dblclick="dblclick"
            @cell-click="clickCell"
            highlight-current-row
            stripe
          >
            <el-table-column
              width="30"
              type="index"
              :index="handleIndex"
            />
            <el-table-column label="" width="23">
              <!-- 下载按钮 -->
              <i class="iconfont icon-download"></i>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" min-width="200">
            </el-table-column>
            <el-table-column prop="ar[0].name" label="歌手" min-width="100">
            </el-table-column>
            <el-table-column prop="al.name" label="专辑" min-width="140">
            </el-table-column>
            <el-table-column prop="dt" label="时长" min-width="100">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <div class="comment-list" v-loading="isCommentLoading">
            <!-- 精彩评论 -->
            <comment
              :comments="comments.hotComments"
              :commentType="'album'"
              :commentId="albumInfo.album.id + ''"
              @getComment="getAlbumComment"
              v-if="comments.hotComments"
            >
              <div slot="title">精彩评论</div>
            </comment>
            <!-- 最新评论 -->
            <comment
              :comments="comments.comments"
              :commentType="'album'"
              :commentId="albumInfo.album.id + ''"
              :isHotComment="!comments.hotComments"
              @getComment="getAlbumComment"
            >
              <div slot="title">热门评论</div>
            </comment>
          </div>
          <!-- 分页 -->
          <div class="page" v-if="comments && comments.comments">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="comments.total"
              small
              :page-size="50"
              :current-page="page"
              @current-change="changePage"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="专辑详情" name="third">
          <div class="desc">{{ albumInfo.album.description }}</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <go-top scroll=".album"/>
  </div>
</template>

<style scoped>
.album {
  overflow-y: scroll;
  height: calc(100vh - 100px);
}

.list-info {
  display: flex;
  align-items: center;
  padding: 30px 20px;
}

.avatar {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
}

.avatar img {
  width: 100%;
}

.right {
  width: calc(100% - 250px);
}

.title {
  display: flex;
  align-items: center;
}

.tag {
  font-size: 12px;
  color: #ec4141;
  border: 1px solid #ec4141;
  padding: 4px 4px;
  border-radius: 5px;
  transform: scale(0.9);
}

.name {
  font-size: 24px;
  color: #373737;
  margin-left: 8px;
  font-weight: 600;
}

.buttons {
  display: flex;
  margin: 15px 0 0 8px;
}

.button-item {
  border-radius: 20px;
  padding: 8px 15px;
  margin-right: 10px;
  border: 1px solid #eee;
  font-size: 14px;
  margin-bottom: 10px;
}

.button-item i {
  margin-right: 7px;
  transform: scale(0.9);
}

.button-item:nth-child(1) {
  font-size: 16px;
}

.play-all {
  background-color: #ec4141;
  color: white;
}

.other-info {
  display: flex;
  align-items: center;
  margin: 10px 10px 0 20px;
  font-size: 14px;
}

.music-list {
  margin: -15px 15px 0;
}

.singer-name {
  cursor: pointer;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.desc {
  font-size: 16px;
  color: #373737;
  line-height: 25px;
  letter-spacing: 2px;
  text-indent: 2em;
}

.album /deep/ .el-loading-spinner {
  top: 40px;
}
</style>