<script>
import UserCard from '@/components/userCard/UserCard.vue'
import GoTop from '@/components/goTop/GoTop.vue'

export default {
  components: { UserCard, GoTop },
  created() {
    this.getUserFollow()
    this.getFollowInfo()
  },
  data() {
    return {
      userName: '',
      isMore: false,
      followList: [],
      page: 1
    }
  },
  methods: {
    async getUserFollow() {
      let res = await this.$request("/user/follows", {
        uid: this.$route.params.uid,
        offset: (this.page - 1) * 30
      })
      this.isMore = res.data.more
      this.followList.push(...res.data.follow)
    },
    async getFollowInfo() {
      let res = await this.$request(`/user/detail?uid=${this.$route.params.uid}`)
      this.userName = res.data.profile.nickname
    },
    bottomLoad() {
      this.page += 1
      this.getUserFollow()
    }
  }
}
</script>

<template>
  <div class="follow">
    <div class="title">{{ userName + "的关注" }}</div>
    <user-card
      :userList="followList"
      :isLoad="isMore"
      @bottomLoad="bottomLoad"
    />
    <go-top scroll=".follow"/>
  </div>
</template>

<style scoped>
.follow {
  overflow-y: scroll;
}

.title {
  font-weight: bold;
  font-size: 20px;
  margin: 20px 15px;
  color: #373737;
}
</style>