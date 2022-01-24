<script>
export default {
  props: {
    listCard: {
      type: Array,
      default() {
        return []
      }
    },
    isLoad: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      disabled: true
    }
  },
  methods: {
    clickCardItem(id) {
      this.$emit('clickCardItem', id)
    },
    // 触底触发
    load() {
      this.$emit('bottomLoad')
      this.disabled = true
    }
  },
  watch: {
    listCard() {
      if (this.isLoad === true) {
        if (this.listCard.length !== 0) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    }
  }
}
</script>

<template>
  <div
    class="list-card"
    v-infinite-scroll="load"
    :infinite-scroll-disabled="disabled"
    :infinite-scroll-distance="300"
    :infinite-scroll-immediate="false"
    ref="listCard"
  >
    <div
      class="card-item"
      v-for="(v, idx) in listCard"
      :key="idx"
      @click="clickCardItem(v.id)"
    >
      <div class="image">
        <img
          :src="(v.picUrl || v.coverImgUrl) + '?param=400y400'"
          :draggable="false"
        />
      </div>
      <div class="title">{{ v.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.list-card {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
}

.card-item {
  width: 18.4%;
  margin: 0 2% 20px 0;
  overflow: hidden;
  cursor: pointer;
}

.card-item:nth-child(5n) {
  margin-right: 0;
}

.image {
  width: 100%;
  padding-bottom: 100%;
  height: 0;
  position: relative;
}

.image::after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("../../assets/img/imgLoading.png") no-repeat center;
  background-size: contain;
  border-radius: 10px;
  z-index: -1;
}

.image img {
  width: 100%;
  border-radius: 10px;
}

.title {
  margin-top: 8px;
  padding: 0 2px;
  font-size: 12px;
  color: black;
  line-height: 17px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  /** 溢出省略号 */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>