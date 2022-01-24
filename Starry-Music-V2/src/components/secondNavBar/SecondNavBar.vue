<script>
export default {
  props: {
    secondData: {
      type: Array,
      default() {
        return []
      }
    },
    width: {
      type: Number,
      default() {
        return 40
      }
    },
    currentTag: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tag: 0
    }
  },
  methods: {
    clickSecondItem(idx) {
      if (this.tag === idx) {
        return
      }
      this.tag = idx
      this.$emit('clickSecondItem', idx)
    }
  },
  watch: {
    currentTag(tag) {
      this.tag = this.secondData.findIndex(
          v => v.name === tag.name
      )
    }
  }
}
</script>

<template>
  <div class="nav-bar">
    <div
      class="nav-item"
      v-for="(v, idx) in secondData"
      :key="idx"
      :class="idx === tag ? 'active' : ''"
      @click="clickSecondItem(idx)"
      :style="width === 0 ? '' : 'width:' + width + 'px;'"
    >
      {{ v.name }}
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  display: flex;
  flex-wrap: wrap;
}

.nav-item {
  border-radius: 30px;
  padding: 5px 10px;
  margin: 4px -2px;
  text-align: center;
  /** content-box  是默认值。如果设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中 */
  box-sizing: content-box;
  transform: scale(0.9);
  cursor: pointer;
}

.active {
  color: #ec4747;
  background-color: #fdf5f5;
  border-radius: 10px;
}
</style>