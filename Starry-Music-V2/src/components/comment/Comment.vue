<script>
import { formatDate } from '@/plugins/utils'

export default {
  data() {
    return {
      commentContent: '',
      isCommentDialogShow: false,
      // 评论模式 true是常规评论 false是楼层评论
      commentMode: true,
      // 楼层回复前面几个字的长度
      floorCommentInputLength: 0,
      // 用于暂存楼层评论id
      floorCommentId: '',
    }
  },
  props: {
    comments: {
      type: Array,
      default() {
        return []
      },
    },
    commentType: {
      type: String,
      default() {
        return ''
      },
    },
    commentId: {
      type: String,
      default() {
        return ''
      },
    },
    isHotComment: {
      type: Boolean,
      default() {
        return true
      },
    },
    // 歌曲评论需要歌曲名称
    musicTitle: {
      type: String,
      default() {
        return ''
      },
    },
  },
  watch: {
    comments() {
      this.commentContent = ''
      this.isCommentDialogShow = false
      this.commentMode = true
      this.floorCommentInputLength = 0
      this.floorCommentId = ''
    },
  },
  methods: {
    inputComment() {
      if (this.commentMode === false) {
        if (this.commentContent.length < this.floorCommentInputLength) {
          this.commentMode = true
        }
      }
    },
    async submitComment() {
      if (!this.$store.state.isLogin) {
        this.$message.error('只有登陆后才能评论哦!')
        return
      }
      if (this.commentContent === '') {
        this.$message.error('评论内容不能为空!')
        return
      }
      // 判断评论的类型
      let type
      switch (this.commentType) {
        case 'album':
          type = 3
          break
        case 'musicList':
          type = 2
          break
        case 'music':
          type = 0
          break
        case 'mv':
          type = 1
          break
        case 'video':
          type = 5
          break
      }
      let res = await this.$request('/comment', {
        t: 1,
        id: this.commentId,
        type,
        content: this.commentContent,
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
      if (!res) return
      if (res.data.code === 200) {
        // 单曲卡片评论，还需要关闭卡片
        if (this.commentType === 'music') {
          this.isCommentDialogShow = false
        }
        this.commentContent = ''
        this.$emit('getComment')
      } else {
        this.$message.error('评论失败,请稍后重试!')
      }
    },
    async submitFloorComment() {
      if (!this.$store.state.isLogin) {
        this.$message.warning('只有登陆后才能评论哦!')
        return
      }
      let type
      switch (this.commentType) {
        case 'music':
          type = 0
          break
        case 'mv':
          type = 1
          break
        case 'musicList':
          type = 2
          break
        case 'album':
          type = 3
          break
        case 'video':
          type = 5
          break
      }
      // t:1 发送, 2 回复
      let res = await this.$request("/comment", {
        t: 2,
        id: this.commentId,
        type,
        content: this.commentContent,
        commentId: this.floorCommentId
      }).catch(e => {
        this.$message.error(e.response.data.msg)
      })
      if (!res) return
      if (res.data.code === 200) {
        if (this.commentType === 'music') {
          this.isCommentDialogShow = false
        }
        this.commentContent = ''
        this.commentMode = true
        this.floorCommentInputLength = 0
        this.floorCommentId = ''
        this.isCommentDialogShow = false
        this.$emit("getComment")
      } else {
        this.$message.error("评论失败,请稍后重试!")
      }
    },
    personal(uid) {
      this.$router.push({
        name: 'personal',
        params: { uid }
      })
      if (this.commentType === 'music') {
        this.$store.commit("changeMusicDetailState", false)
      }
    },
    async likeComment(flag, cid) {
      if (!this.$store.state.isLogin) {
        this.$message.warning('只有登陆后才能点赞哦!')
        return
      }
      let timestamp = Date.parse(new Date())
      let type
      switch (this.commentType) {
        case 'music':
          type = 0
          break
        case 'mv':
          type = 1
          break
        case 'musicList':
          type = 2
          break
        case 'album':
          type = 3
          break
        case 'video':
          type = 5
          break
      }
      let res = await this.$request("/comment/like", {
        id: this.commentId,
        cid,
        t: flag ? 0 : 1,
        type,
        timestamp
      })
      if (res.data.code === 200) {
        this.$emit("getComment")
      } else {
        this.$message.error("点赞失败,请稍后重试!")
      }
    },
    // 点击楼层评论
    floorComment(commentId, nickName) {
      if (this.isHotComment === false) {
        this.$emit('transToHotComment', { commentId, nickName })
      }
      if (this.commentType !== 'music') {
        this.$emit('scrollToComment')
        let input = document.querySelector('.comment-area')
        // 阻止focus定位
        input.children[0].focus({ preventScroll: true })
      } else {
        this.openDialog()
      }
      this.commentContent = '回复' + nickName + ': '
      this.floorCommentInputLength = this.commentContent.length
      this.commentMode = false
      this.floorCommentId = commentId
    },
    openDialog() {
      this.isCommentDialogShow = !this.isCommentDialogShow
      this.$nextTick(() => {
        // 评论框获得焦点
        let input = document.querySelector('.music-comment-area')
        input.children[0].focus()
      })
    },
    closeCommentDialog() {
      this.commentContent = ''
      this.isCommentDialogShow = false
      this.commentMode = true
      this.floorCommentInputLength = 0
      this.floorCommentId = ''
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
  <div class="hot-comment">
    <!-- video评论 -->
    <div class="comments" v-if="commentType !== '' && commentType !== 'music' && isHotComment">
      <el-input
        type="textarea"
        class="comment-area"
        maxlength="200"
        v-model="commentContent"
        show-word-limit
        placeholder="留下你的评论"
        @input="inputComment"
      />
      <div class="comment-btn">
        <el-button
          size="mini"
          round
          @click="commentMode ? submitComment() : submitFloorComment()"
          class="submit-comment"
        >
          评论
        </el-button>
      </div>
    </div>
    <!-- 音乐单曲评论 -->
    <div class="music-comment" v-else-if="commentType !== '' && commentType === 'music'">
      <el-button class="comment-card-button" size="mini" round @click="openDialog">
        <i class="iconfont icon-ziyuan"/> 发表我的音乐评论
      </el-button>
      <el-dialog
        :visible="isCommentDialogShow"
        width="450px"
        @close="closeCommentDialog"
        append-to-body
        class="comment-dialog"
      >
        <div class="music-title">歌曲：{{ musicTitle }}</div>
        <el-input
          type="textarea"
          class="comment-area music-comment-area"
          maxlength="140"
          show-word-limit
          v-model="commentContent"
          @input="inputComment"
          placeholder="留下你的评论"
        />
        <div class="comment-btn">
          <el-button
            size="mini"
            round
            @click="commentMode ? submitComment() : submitFloorComment()"
            class="submit-comment music-submit-comment"
          >
            评论
          </el-button>
        </div>
      </el-dialog>
    </div>
    <div class="comment-header">
      <slot name="title"/>
    </div>
    <div class="comment-item" v-for="(v, idx) in comments" :key="idx">
      <div class="comment-avatar">
        <img
          :src="v.user.avatarUrl + '?param=100y100'"
          @click="personal(v.user.userId)"
          :draggable="false"
        />
      </div>
      <div class="comment-main">
        <div class="comment-content">
          <span
            class="nickname"
            @click="personal(v.user.userId)"
          >
            {{ v.user.nickname }}
          </span>
          <span>{{ v.content }}</span>
        </div>
        <div class="replied">
          <div
            class="replied-item"
            v-for="(item, index) in v.beReplied"
            :key="index"
          >
            <span class="replied-user" @click="personal(v.user.userId)">
              @{{ item.user.nickname }}:
            </span>
            <span class="replied-content">{{ item.content }}</span>
          </div>
        </div>
        <div class="comment-bottom">
          <div class="created-time">
            {{ v.time | showDate }}
          </div>
          <div class="comment-button">
            <div
              @click="likeComment(v.liked, v.commentId)"
              :class="v.liked ? 'like-comment' : ''"
            >
              <i class="iconfont icon-good"/> {{ v.likedCount }}
            </div>
            <div><i class="iconfont icon-zhuanfa"/></div>
            <div><i class="iconfont icon-pinglun" @click="floorComment(v.commentId, v.user.nickname)"/></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-btn {
  width: 100%;
  text-align: right;
  margin: 10px 0;
}

.el-button:hover {
  background-color: #f2f2f2;
}

.hot-comment {
  margin-bottom: 20px;
  width: 100%;
}

.comment-header {
  font-size: 22px;
  color: rgb(26, 26, 26);
  margin-top: 70px;
  font-weight: 600;
}

.comment-item {
  margin: 15px 0;
  padding: 10px 0 10px;
  border-bottom: 1px solid #eee;
  display: flex;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.comment-avatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.comment-main {
  width: calc(100% - 40px);
}

.nickname {
  color: #5a8ab9;
  cursor: pointer;
}

.comment-content > span {
  line-height: 20px;
}

.comment-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: rgb(172, 172, 172);
}

.comment-button {
  display: flex;
  align-items: center;
}

.comment-button div {
  margin-top: 3px;
  padding: 0 8px;
  transform: scale(0.9);
}

.comment-button div:nth-child(1) {
  font-size: 18px;
}

.replied {
  background-color: #f4f4f4;
  margin: 10px 4px;
  border-radius: 10px;
}

.replied-item {
  padding: 10px 14px;
  line-height: 20px;
}

.replied-user {
  color: #5a8ab9;
  cursor: pointer;
}

.el-textarea /deep/ .el-textarea__inner {
  height: 100px !important;
  font-size: 14px;
  resize: none;
}

.el-textarea /deep/ .el-textarea__inner:focus {
  border-color: #aaa;
}

.comment-card-button {
  position: fixed;
  left: 50%;
  top: calc(100vh - 120px);
  transform: translateX(-50%) !important;
  font-size: 14px;
  border: none;
  background-color: #f1f1f1;
  line-height: 15px;
  padding: 10px 10px 10px 30px;
}

.comment-card-button:hover {
  background-color: #e1e1e1;
}

.comment-card-button i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.music-comment-area /deep/ .el-textarea__inner {
  height: 130px !important;
}

.submit-comment:focus {
  /** 焦点选择颜色 */
  background-color: #fff;
}

.music-submit-comment {
  padding: 8px 20px;
  font-size: 14px;
  background-color: #ec4141;
  color: white;
  border: none;
}

.music-submit-comment:hover {
  background-color: #eb2e2e;
  color: white;
}

.music-submit-comment:focus {
  color: white;
  background-color: #ec4141;
}

.el-button {
  transform: scale(0.9) translateX(5%);
}

.comment-dialog /deep/ .el-dialog__body {
  padding-bottom: 15px !important;
}

.like-comment, .like-comment i {
  color: #ec4141 !important;
}

.music-title {
  width: 100%;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 10px;
  font-size: 20px;
  margin-top: 10px;
}
</style>