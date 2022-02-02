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
    }
  },
  methods: {
    inputComment(v) {

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
    submitFloorComment() {
    },
    personal(id) {

    },
    likeComment() {
    },
    floorComment() {
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
              :class="v.liked ? 'likeComment' : ''"
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

.submit-comment:focus {
  /** 焦点选择颜色 */
  background-color: #fff;
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

.el-textarea >>> .el-textarea__inner {
  height: 65px !important;
  font-size: 12px;
  resize: none;
}

.el-textarea >>> .el-textarea__inner:focus {
  border-color: #aaa;
}
</style>