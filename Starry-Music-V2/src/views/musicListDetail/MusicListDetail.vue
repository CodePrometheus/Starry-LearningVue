<script>
import GoTop from '@/components/goTop/GoTop.vue'
import Comment from '@/components/comment/Comment.vue'
import UserCard from '@/components/userCard/UserCard.vue'
import { formatDate, handleMusicTime, handleNum } from '@/plugins/utils'

export default {
  components: { GoTop, Comment, UserCard },
  async mounted() {
    if (this.$store.state.isLogin) {
      // 判断是否是用户创建的歌单
      this.getIsCreated()
      if (!this.isCreated) {
        // 判断是否是收藏的歌单
        this.getIsCollect()
      }
    }
    await this.getMusicList()
    this.$nextTick(() => {
      // 判断是否和上一次打开的歌单相同
      if (this.$route.params.id === this.$store.state.musicListId) {
        this.handleDom(this.$store.state.musicUrl)
      }
    })
  },
  watch: {
    '$store.state.musicUrl'(current, last) {
      this.handleDom(current, last)
    },
    '$store.state.createdMusicList'(current, last) {
      if (last.length === 0) {
        this.getIsCollect()
      }
    }
  },
  data() {
    return {
      musicListDetail: null,
      isMore: false,
      isCollect: false,
      // 是否是用户创建的歌单
      isCreated: false,
      disabled: false,
      isCommentLoading: false,
      comments: {},
      // 收藏者列表
      followedData: {
        page: 1,
        followedList: [],
        isMore: false,
        // 是否已经加载过列表数据 （用于点击收藏者tab后第一次加载数据）
        isLoaded: false,
      },
      page: 1,
    }
  },
  methods: {
    getIsCreated() {
      this.isCollect = this.$store.state.createdMusicList.find(v => v.id === this.$route.params.id)
    },
    getIsCollect() {
      this.isCollect = this.$store.state.collectMusicList.find(v => v.id === this.$route.params.id)
    },
    // 渲染当前选择播放的样式
    handleDom(current, last) {
      if (document.querySelector('.music-list-detail')) {
        let tableRows = document
        .querySelector('.music-list-detail')
        .querySelectorAll('.el-table__row')
        // 遍历当前musicList 找到当前播放的index的行进行渲染
        // console.log(tableRows);
        let index = this.musicListDetail.tracks.findIndex(
          item => item.id === current,
        )
        // console.log(index);
        if (index !== -1) {
          // 直接修改dom样式的颜色无效
          // 通过引入全局样式解决
          // 将正在播放的音乐前面的索引换成小喇叭
          tableRows[index].children[0].querySelector(
            '.cell',
          ).innerHTML = `<div><i class="iconfont icon-yinliang"></i></div>`
          tableRows[index].children[0].querySelector('.iconfont').classList.add('current-row')
          tableRows[index].children[2].querySelector('.cell').classList.add('current-row')
        }
        // 清除上一首的样式
        if (last !== -1) {
          let lastIndex = this.musicListDetail.tracks.findIndex(
            item => item.id === last,
          )
          if (lastIndex !== -1) {
            // 将上一个播放的dom的小喇叭换回索引
            tableRows[lastIndex].children[0].querySelector(
              '.cell',
            ).innerHTML = `<div>${
              lastIndex + 1 < 10 ? '0' + (lastIndex + 1) : lastIndex + 1
            }</div>`

            // 将上一首的类名删掉  小喇叭的html已经被替换了，不需要再还原
            tableRows[lastIndex].children[2]
            .querySelector('.cell')
            .classList.remove('current-row')
          }
        }
      }
    },
    // 查询歌单
    async getMusicList() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request('/playlist/detail', {
        id: this.$route.params.id,
        timestamp,
      })
      this.musicListDetail = res.data.playlist
      if (this.musicListDetail.tracks.length !== this.musicListDetail.trackIds.length) {
        this.isMore = true
      }
      this.musicListDetail.tracks.forEach((v, idx) => {
        this.musicListDetail.tracks[idx].dt = handleMusicTime(v.dt)
      })
    },
    playAll() {
      this.$store.commit('updateMusicId', this.musicListDetail.tracks[0].id)
      this.$store.commit('updateMusicList', {
        musicList: this.musicListDetail.tracks,
        musicListId: this.musicListDetail.id,
      })
    },
    async collectList() {
      if (!this.$store.state.isLogin) return
      this.isCollect = !this.isCollect
      let timestamp = Date.parse(new Date())
      await this.$request("/playlist/subscribe", {
        id: this.$route.params.id,
        t: this.isCollect ? 1 : 2,
        timestamp
      })
      await this.getUserSubMusicList()
    },
    async getUserSubMusicList() {
      let timestamp = Date.parse(new Date())
      let info = window.localStorage.getItem("userInfo")
      this.userInfo = info && JSON.parse(info)
      let res = await this.$request("/user/playlist", {
        uid: this.userInfo.userId,
        timestamp
      })
      res = res.data.playlist
      let index = res.findIndex(v => v.subscribed === true)
      this.collectedMusicList = res.slice(index)
      this.$store.commit("updateCollectMusicList", this.collectedMusicList)
    },
    clickTab(e) {
      if (e.index === '1' && !this.comments.comments) {
        this.getMusicListComment()
      } else if (e.index === '2' && !this.followedData.isLoaded) {
        this.getMusicListFollowed()
        this.followedData.isLoaded = true
      }
    },
    loadMore() {
      if (!this.$store.state.isLogin) {
        this.$message.error('请先进行登录操作!')
        return
      }
      let res = this.musicListDetail.trackIds.slice(this.musicListDetail.tracks.length)
      if (res.length > 100) {
        res = res.slice(0, 100)
      }
      let ids = ''
      res.forEach(v => ids += v.id + ',')
      ids = ids.substr(0, ids.length - 1)
      this.getDetail(ids)
    },
    async getDetail(ids) {
      if (this.isMore === false) return
      this.disabled = true
      let res = await this.$request("/song/detail", { ids })
      res.data.songs.forEach((v, idx) => {
        res.data.songs[idx].dt = handleMusicTime(v.dt)
      })
      this.musicListDetail.tracks.push(...res.data.songs)
      if (this.musicListDetail.tracks.length < this.musicListDetail.trackIds.length) {
        this.isMore = true
        this.disabled = false
      } else {
        this.isMore = false
      }
    },
    async clickDbRow(row) {
      this.$store.commit('updateMusicId', row.id)
      if (this.musicListDetail.id !== this.$store.state.musicListId) {
        this.$store.commit('updateMusicList', {
          musicList: this.musicListDetail.tracks,
          musicListId: this.musicListDetail.id,
        })
      }
    },
    clickCell() {
    },
    handleIndex(idx) {
      idx += 1
      if (idx < 10) {
        return '0' + idx
      } else {
        return idx
      }
    },
    // 获取歌单评论
    async getMusicListComment(type) {
      let timestamp = Date.parse(new Date())
      this.isCommentLoading = true
      if (type === 'changePage') {
        this.scrollToComment()
      }
      let res = await this.$request('/comment/playlist', {
        id: this.$route.params.id,
        offset: (this.page - 1) * 50,
        limit: 50,
        timestamp,
      })
      if (res.data.code !== 200) {
        this.$message.error('获取评论失败,请稍后重试!')
      }
      this.comments = res.data
      this.isCommentLoading = false
    },
    scrollToComment() {
      let musicDetail = document.querySelector('.music-list-detail')
      let listInfo = document.querySelector('.list-info')
      musicDetail.scrollTo({
        behavior: 'smooth',
        // 一个元素的content + padding的高度
        top: listInfo.clientHeight - 70,
      })
    },
    changePage(page) {
      this.page = page
      this.getMusicListComment('changePage')
    },
    async getMusicListFollowed() {
      let res = await this.$request('/playlist/subscribers', {
        id: this.$route.params.id,
        offset: (this.followedData.page - 1) * 20,
      })
      this.followedData.isMore = res.data.more
      this.followedData.followedList.push(...res.data.subscribers)
    },
    bottomLoad() {
      this.followedData.page += 1
      this.getMusicListFollowed()
    },
  },
  filters: {
    showDate(value) {
      const date = new Date(value)
      return formatDate(date, 'yyyy-MM-dd')
    },
    handleNum,
  },
}
</script>

<template>
  <div class="music-list-detail" v-if="musicListDetail">
    <div class="list-info">
      <div class="list-avatar">
        <img :src="musicListDetail.coverImgUrl" :draggable="false"/>
      </div>
      <div class="right">
        <div class="title">
          <div class="tag">歌单</div>
          <div class="name">{{ musicListDetail.name }}</div>
        </div>
        <div class="user">
          <div class="user-avatar">
            <img :src="musicListDetail.creator.avatarUrl" :draggable="false"/>
          </div>
          <div class="user-name"
               @click="$router.push({ name: 'personal', params: { uid: musicListDetail.creator.userId }})">
            {{ musicListDetail.creator.nickname }}
          </div>
          <div class="create-time">
            {{ musicListDetail.createTime | showDate }} 创建
          </div>
        </div>
        <div class="buttons">
          <div class="button-item play-all" @click="playAll">
            <i class="iconfont icon-bofang playAll"/>
            <span>播放全部</span>
          </div>
          <div class="button-item" v-if="!isCreated" @click="collectList">
            <i class="iconfont icon-xihuan" :class="isCollect ? 'red' : ''"/>
            <span>{{ isCollect ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="button-item">
            <i class="iconfont icon-zhuanfa"/>
            <span>分享</span>
          </div>
        </div>
        <div class="tags">
          标签 :
          <div
            class="tag-item"
            v-for="(v, idx) in musicListDetail.tags"
            :key="idx"
          >
            {{ v }}
          </div>
        </div>
        <div class="other-info">
          <div class="player-num">歌曲 : {{ musicListDetail.trackCount | handleNum }}</div>
          <div class="player-count">播放 : {{ musicListDetail.playCount | handleNum }}</div>
        </div>
        <div class="desc" v-if="musicListDetail.description">
          简介 : {{ musicListDetail.description }}
        </div>
        <div class="desc" v-else>简介 : 暂无简介</div>
      </div>
    </div>
    <div class="music-list">
      <el-tabs value="first" @tab-click="clickTab">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table
            :data="musicListDetail.tracks"
            size="mini"
            style="width: 100%"
            @row-dblclick="clickDbRow"
            @cell-click="clickCell"
            highlight-current-row
            lazy
            :row-key="(row) => { return row.id }"
            v-infinite-scroll="this.$store.state.isLogin ? loadMore : ''"
            :infinite-scroll-disabled="disabled"
            :infinite-scroll-distance="1500"
            :infinite-scroll-immediate="false"
            stripe
          >
            <el-table-column
              width="40"
              type="index"
              :index="handleIndex"
            />
            <el-table-column width="23">
              <i class="iconfont icon-download"/>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" min-width="350"/>
            <el-table-column prop="ar[0].name" label="歌手" min-width="120"/>
            <el-table-column prop="al.name" label="专辑" min-width="170"/>
            <el-table-column prop="dt" label="时长" min-width="100"/>
          </el-table>
          <div class="load-more" v-if="isMore && !this.$store.state.isLogin">
            登陆后查看更多音乐
          </div>
          <div class="placeholder" v-else/>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <div
            class="comment-list"
            v-if="comments.comments"
            v-loading="isCommentLoading"
          >
            <!-- 精彩评论 -->
            <comment
              :comments="comments.hotComments"
              :commentType="'musicList'"
              :commentId="musicListDetail.id + ''"
              @getComment="getMusicListComment"
              @scrollToComment="scrollToComment"
              v-if="comments.hotComments"
              ref="hotComments"
            >
              <div slot="title">精彩评论</div>
            </comment>
            <!-- 最新评论 -->
            <comment
              :comments="comments.comments"
              :commentType="'musicList'"
              :commentId="musicListDetail.id + ''"
              :isHotComment="!comments.hotComments"
              @getComment="getMusicListComment"
              @scrollToComment="scrollToComment"
              @transToHotComment="(info) =>
                  $refs.hotComments.floorComment(info.commentId, info.nickName)"
            >
              <div slot="title">最新评论</div>
            </comment>
          </div>
          <div class="page" v-show="comments.comments && comments.comments.length !== 0">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="comments.total"
              small
              :page-size="50"
              :current-page="page"
              @current-change="changePage"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="收藏" name="third">
          <user-card
            userType="musicListDetail"
            :userList="followedData.followedList"
            :isLoad="followedData.isMore"
            @bottomLoad="bottomLoad"
          />
          <div
            class="tip"
            v-if="followedData.followedList.length === 0 && followedData.isLoaded === true"
          >
            暂无收藏者
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <go-top scroll=".music-list-detail"/>
  </div>
</template>

<style scoped>
.music-list-detail {
  overflow-y: scroll;
}

.list-info {
  display: flex;
  padding: 25px 25px;
  align-items: center;
}

.list-avatar {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
  position: relative;
}

.list-avatar::after {
  content: '';
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  position: absolute;
  background: url("../../assets/img/imgLoading.png") no-repeat;
  background-size: contain;
}

.list-avatar img {
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
  padding: 5px 5px;
  border-radius: 5px;
  transform: scale(0.9);
}

.name {
  font-size: 24px;
  color: #373737;
  margin-left: 8px;
  font-weight: 600;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.user-avatar {
  height: 30px;
  width: 30px;
  margin-right: 8px;
}

.user img {
  width: 100%;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  color: #6191c2;
  cursor: pointer;
  margin-right: 12px;
}

.create-time {
  font-size: 14px;
  transform: scale(0.9);
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

.tags {
  display: flex;
  align-items: center;
  margin: 20px 0 0 15px;
  font-size: 14px;
}

.tag-item {
  color: #6191c2;
  padding: 3px 5px;
}

.other-info {
  display: flex;
  align-items: center;
  margin: 5px 0 0 15px;
  font-size: 14px;
}

.player-count {
  margin-left: 10px;
}

.desc {
  font-size: 14px;
  margin: 7px 0 0 15px;
}

.music-list {
  margin: -15px 15px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.placeholder {
  width: 100%;
  height: 50px;
}

.load-more {
  width: 100%;
  height: 50px;
  font-size: 14px;
  color: #aaa;
  text-align: center;
  line-height: 50px;
}
</style>