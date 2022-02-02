<script>
import UserCard from '@/components/userCard/UserCard.vue'
import GoTop from '@/components/goTop/GoTop.vue'

export default {
  components: { UserCard, GoTop },
  created() {
    this.getUserFollowed()
    this.getFollowedInfo()
  },
  data() {
    return {
      followedList: [],
      isMore: false,
      page: 1,
      userName: ''
    }
  },
  methods: {
    bottomLoad() {
      this.page += 1
      this.getUserFollowed()
    },
    async getUserFollowed() {
      let res = await this.$request("/user/followeds", {
        uid: this.$route.params.uid,
        offset: (this.page - 1) * 30
      })
      this.isMore = res.data.more
      this.followedList.push(...res.data.followeds)
    },
    async getFollowedInfo() {
      let res = await this.$request(`/user/detail?uid=${this.$route.params.uid}`)
      this.userName = res.data.profile.nickname
    },
  }
}
</script>

<template>
  <div class="followed">
    <div class="title">{{ userName + "的粉丝" }}</div>
    <user-card
      :userList="followedList"
      :isLoad="isMore"
      @bottomLoad="bottomLoad"
    />
    <go-top scroll=".followed"/>
  </div>
</template>

<style scoped>
.followed {
  overflow-y: scroll;
}

.title {
  font-weight: bold;
  font-size: 20px;
  margin: 20px 15px;
  color: #373737;
}
</style>