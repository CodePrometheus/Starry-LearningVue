<script>
import { handleMusicTime } from '@/plugins/utils'

export default {
  created() {
    this.getMatch()
    this.getSearchSong()
  },
  data() {
    return {
      count: 0,
      page: 1,
      match: {},
      songList: [],
    }
  },
  methods: {
    async getMatch() {
      let res = await this.$request('/search/multimatch', {
        keywords: this.$route.params.id,
      })
      this.match = res.data.result
    },
    async getSearchSong() {
      let res = await this.$request('/cloudsearch', {
        keywords: this.$route.params.id,
        offset: 30 * (this.page - 1),
        type: 1
      })
      this.count = res.data.result.songCount
      this.songList = res.data.result.songs
      this.songList.forEach((v, idx) => {
        this.songList[idx].dt = handleMusicTime(v.dt)
      })
    },
    goToSingerDetail(id) {
      this.$router.push({ name: 'singer-detail', params: { id } })
    },
    dblclick(row) {
      // 获取当前的歌单列表和歌曲索引
      let musicList = this.$store.state.musicList
      let currentIndex = this.$store.state.currentIndex
      // 判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      let isExist = musicList.find(v => v.id === row.id)
      if (isExist) {
        // 如果已经存在 则只提交歌曲id
        this.$store.commit("updateMusicId", row.id)
        return
      }
      this.$store.commit("changePlayState", false)
      // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      let splice = musicList.splice(currentIndex + 1, 0, row)
      this.$store.commit("updateMusicId", row.id)
      this.$store.commit("updateMusicList", {
        musicList,
        musicListId: this.$store.state.musicListId
      })
    },
    clickCell() {

    },
    handleIndex(idx) {
      idx = idx + 1 + 30 * (this.page - 1)
      if (idx < 10) {
        return "0" + idx
      } else {
        return idx
      }
    },
    pageChange(v) {
      this.page = v
      this.songList = []
      this.getSearchSong()
    }
  },
}
</script>

<template>
  <div class="search-song">
    <div class="tip">找到 {{ count }} 首单曲</div>
    <div class="match" v-if="match.artist && page === 1">
      <div class="title">最佳匹配</div>
      <div class="result" @click="goToSingerDetail(match.artist[0].id)">
        <div class="cover">
          <img :src="match.artist[0].img1v1Url + '?param==200y200'" :draggable="false"/>
        </div>
        <div class="name">歌手：{{ match.artist[0].name }}</div>
        <i class="iconfont icon-arrow-right-bold"></i>
      </div>
    </div>
    <el-table
      :data="songList"
      size="mini"
      style="width: 100%;"
      @row-dblclick="dblclick"
      @cell-click="clickCell"
      highlight-current-row
      stripe
    >
      <el-table-column width="30" type="index" :index="handleIndex"/>
      <el-table-column width="23">
        <i class="iconfont icon-download"/>
      </el-table-column>
      <el-table-column prop="name" label="音乐标题" min-width="200"/>
      <el-table-column prop="ar[0].name" label="歌手" min-width="100"/>
      <el-table-column prop="al.name" label="专辑" min-width="170"/>
      <el-table-column prop="dt" label="时长" min-width="60"/>
    </el-table>
    <div class="page" v-if="songList.length != 0">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="count"
          small
          :page-size="30"
          :current-page="page"
          @current-change="pageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.search-song {
  padding: 0 15px;
}

.tip {
  font-weight: bold;
  color: rgb(34, 34, 34);
  margin-top: 15px;
  margin-bottom: 10px;
}

.title {
  font-size: 14px;
  color: rgb(34, 34, 34);
  margin: 5px 0;
}

.result {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background-color: #f4f4f4;
  width: 320px;
  height: 70px;
  margin-bottom: 20px;
  cursor: pointer;
}

.cover {
  width: 70px;
  height: 70px;
}

.cover img {
  border-radius: 5px;
  width: 100%;
  height: 100%;
}

.name {
  font-size: 14px;
  color: rgb(31, 31, 31);
  margin-left: 10px;
}

.match i {
  position: absolute;
  right: 20px;
  transform: translateY(-50%);
  top: 50%;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
  margin: 20px 0;
}
</style>