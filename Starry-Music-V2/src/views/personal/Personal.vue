<script>
import ListCard from '@/components/listCard/ListCard.vue'

export default {
  components: { ListCard },
  async created() {
    await this.getUserInfo()
    await this.getMusicList()
    if (window.localStorage.getItem("userId")) {
      this.isCurrentUser = window.localStorage.getItem("userId")
      === this.$route.params.uid
    }
  },
  data() {
    return {
      userInfo: {},
      createdMusicList: [],
      collectedMusicList: [],
      isCurrentUser: false
    }
  },
  methods: {
    async getUserInfo() {
      let res = await this.$request(`/user/detail?uid=${this.$route.params.uid}`)
      if (!res) {
        this.$message.error("获取用户信息失败!")
        return
      }
      console.log("getUserInfo: ", res);
      // 等级
      res.data.profile['level'] = res.data.level
      this.userInfo = res.data.profile
    },
    async getMusicList() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request('/user/playlist', {
        uid: this.$route.params.uid,
        timestamp
      })
      res = res.data.playlist
      let idx = res.findIndex(v => v.subscribed === true)
      res[0].name = `${this.userInfo.nickname}喜欢的音乐`
      this.createdMusicList = res.slice(0, idx)
      this.collectedMusicList = res.slice(idx)
    },
    async logout() {
      let res = await this.$request('/logout')
      if (res.data.code !== 200) {
        this.$message("退出登录失败, 请稍后重试!")
        return
      }
      window.localStorage.removeItem("userId")
      this.$store.commit("updateLoginState", false)
      this.$message.success("退出成功!")
      this.isCurrentUser = false
    },
    clickCardItem(id) {
      this.$router.push({
        name: "music-list-detail",
        params: {
          id
        }
      })
    }
  },
  watch: {
    "$store.state.lsLogin"(current) {
      if (window.localStorage.getItem("userId") && current) {
        this.isCurrentUser =
            window.localStorage.getItem("userId") === this.$route.params.uid
      }
    }
  }
}
</script>

<template>
  <div class="personal">
    <div class="user-info">
      <div>
        <img :src="userInfo.avatarUrl + '?param=400y400'" :draggable="false" class="avatar">
      </div>
      <div class="right">
        <div class="top">
          <div class="name">
            <span>{{ userInfo.nickname }}</span>
            <div class="logout" @click="logout" v-if="isCurrentUser && this.$store.state.isLogin">
              <i class="iconfont icon-zhuxiao1"/>
              <span>退出登录</span>
            </div>
          </div>
          <div class="tags">
            <div class="level">{{ "Lv " + userInfo.level }}</div>
            <!-- 0 保密 1男 2女 -->
            <div class="gender">
              {{ userInfo.gender === '0' ? "保密" : userInfo.gender === 1 ? "女" : "男"}}
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="nums">
            <div class="nums-item">
              <div class="item-top">
                {{ userInfo.eventCount }}
              </div>
              <div class="item-bottom">
                动态
              </div>
            </div>
            <div class="nums-item" @click="$router.push({ name: 'follows', params: { uid: $route.params.uid }})">
              <div class="item-top">
                {{ userInfo.newFollows }}
              </div>
              <div class="item-bottom">
                关注
              </div>
            </div>
            <div class="nums-item" @click="$router.push({ name: 'followeds', params: { uid: $route.params.uid }})">
              <div class="item-top">
                {{ userInfo.followeds }}
              </div>
              <div class="item-bottom">
                粉丝
              </div>
            </div>
          </div>
          <div class="other-info">
            <div class="other-item">
              用户id : {{ userInfo.userId }}
            </div>
            <div class="other-item">
              所在地区 : {{ userInfo.province + " " + userInfo.city }}
            </div>
            <div class="other-item">
              个性签名 : {{ userInfo.signature === "" ? "暂无" : userInfo.signature }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="music-list">
      <div class="list-title" v-if="createdMusicList.length !== 0">
        {{ userInfo.nickname }}创建的歌单({{ createdMusicList.length }})
      </div>
      <list-card
        :listCard="createdMusicList"
        @clickCardItem="clickCardItem"
      />
      <div class="list-title" v-if="collectedMusicList.length !== 0">
        {{ userInfo.nickname }}收藏的歌单({{ collectedMusicList.length }})
      </div>
      <list-card
        :listCard="collectedMusicList"
        @clickCardItem="clickCardItem"
      />
    </div>
  </div>
</template>

<style scoped>
.personal {
  height: calc(100vh - 120px);
  overflow-y: scroll;
}

.user-info {
  margin: 50px 20px;
  display: flex;
}

.avatar {
  margin-top: 5px;
  border-radius: 50%;
  height: 200px;
  width: 200px;
  /* 指定可替换元素的内容应该如何适应到其使用的高度和宽度确定的框 */
  object-fit: cover;
}

.right {
  margin-left: 30px;
  /* flex-grow 项在 flex 容器中分配剩余空间的相对比例 */
  flex: 1;
}

.top {
  width: 100%;
  border-bottom: 1px solid #ddd;
}

.name {
  color: #373737;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.logout {
  margin-right: 10px;
  display: flex;
  height: 30px;
  align-items: center;
  color: #373737;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  font-weight: lighter;
  transform: scale(0.9);
  font-size: 16px;
  border: 1px solid #ddd;
  padding: 10px 20px;
}

.logout:hover {
  background-color: #f2f2f2;
}

.logout i {
  font-size: 12px;
  margin-right: 3px;
}

.logout span {
  font-size: 14px;
}

.level {
  font-size: 12px;
  background-color: #f0f0f0;
  border: 1px solid #eee;
  padding: 2px 5px;
  border-radius: 10px;
}

.gender {
  margin-left: 10px;
  transform: scale(0.8);
  color: #5a8ab9;
}

.tags {
  display: flex;
  margin: 10px 0;
}

.nums {
  display: flex;
  margin: 20px 0 5px;
}

.nums-item {
  cursor: pointer;
  border-left: 1px solid #eee;
  padding: 0 30px;
  text-align: center;
}

.nums-item:nth-child(1) {
  border-left: none;
  padding-left: 3px;
}

.item-top {
  color: #373737;
  font-size: 20px;
}

.item-bottom {
  transform: scale(0.9);
  margin-top: 5px;
}

.other-info {
  margin-top: 30px;
  display: flex;
  font-size: 14px;
  margin-left: -8px;
  transform: scale(0.9) translateX(-5%);
  user-select: text;
}

.other-item {
  padding: 0 8px;
}

.music-list {
  max-width: 1500px;
  margin: 0 auto;
  padding-bottom: 30px;
}

.list-title {
  color: #373737;
  font-weight: bold;
  font-size: 14px;
}
</style>