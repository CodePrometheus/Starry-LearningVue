<script>
export default {
  data() {
    return {
      disabled: true
    }
  },
  props: {
    userList: {
      type: Array,
      default() {
        return []
      }
    },
    userType: {
      type: String,
      default() {
        return "personalPage"
      }
    },
    isLoad: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods:  {
    load() {
      this.$emit("bottomLoad")
      this.disabled = true
    },
    clickUser(uid) {
      this.$router.push({ name: "personal", params: { uid }})
    }
  },
  watch: {
    userList() {
      if (this.isLoad === true) {
        this.disabled = this.userList.length === 0;
      }
    }
  }
}
</script>

<template>
  <div
    class="list-main"
    v-infinite-scroll="load"
    :infinite-scroll-disabled="disabled"
    :infinite-scroll-distance="300"
    :infinite-scroll-immediate="false"
  >
    <div
      class="item-main"
      v-for="(v, idx) in userList"
      :key="idx"
      @click="clickUser(v.userId)"
    >
      <div class="item">
        <div class="left">
          <img :src="v.avatarUrl + '?param=200y200'" class="avatar" :draggable="false" />
        </div>
        <div class="right">
          <div class="name">{{ v.nickname }}</div>
          <div class="signature">{{ v.signature }}</div>
          <div class="num-item" v-if="userType === 'personalPage'">
            <div class="music-count">{{ "歌单: " + v.playlistCount }}</div>
            <div class="over">|</div>
            <div class="followed-count">{{ "粉丝: " + v.followeds }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-main {
  display: flex;
  flex-wrap: wrap;
}

.item-main {
  margin: 0 auto;
}

.item {
  display: flex;
  width: 350px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.item:hover {
  background-color: #f9f9f9;
}

.avatar {
  height: 70px;
  width: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
  margin-right: 10px;
}

.name {
  margin: 8px 0 5px;
  font-size: 14px;
  color: #373737;
}

.signature {
  font-weight: lighter;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  width: 250px;
  height: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.over {
  color: #ddd;
  margin: 0 10px;
}

.num-item {
  display: flex;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  color: #888;
}
</style>