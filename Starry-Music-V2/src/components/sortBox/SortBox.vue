<script>
export default {
  data() {
    return {
      // 是否显示分类选择框
      isSortPopShow: false
    }
  },
  props: {
    currentTag: {
      type: Object,
      default() {
        return []
      }
    },
    sortList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    getSortList() {
      if (this.sortList.length === 0) {
        // 触发回调
        this.$emit('getSortList')
      }
    },
    clickItem(v) {
      // 向父组件传值
      this.$emit('clickSortBoxItem', v)
      // 点击完关闭弹窗
      this.isSortPopShow = false
    }
  }
};
</script>

<template>
  <div>
    <el-popover
      placement="bottom-start"
      width="350"
      popper-class="sort-pop"
      trigger="click"
      :visible-arrow="false"
      v-model="isSortPopShow"
      @show="getSortList"
    >
      <div class="sort-box" slot="reference">
        {{ currentTag.name }} <i class="iconfont icon-arrow-right-bold" />
      </div>
      <div class="tips" v-if="sortList.length === 0">正在加载分类数据...</div>
      <div class="sort-list" v-else>
        <div
          class="sort-item"
          v-for="(v, idx) in sortList"
          :class="currentTag.name === v.name ? 'current-item' : ''"
          :key="idx"
          @click="clickItem(v)"
        >
          {{ v.name }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped>
.sort-box {
  padding: 8px 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 25px;
  transform: scale(0.9);
  font-size: 14px;
}

.tips {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  color: rgb(145, 145, 145);
}

.sort-list {
  display: flex;
  /** flex 元素 被打断到多个行中 */
  flex-wrap: wrap;
}

.sort-item {
  width: 25%;
  text-align: center;
  padding: 5px 0;
  margin: 5px 0;
  cursor: pointer;
  color: rgb(85, 85, 85);
  border-radius: 30px;
  transform: scale(0.9);
}

.current-item {
  color: #eb4f4f;
  background-color: #fcebeb;
}
</style>