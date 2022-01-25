<script>
export default {
  props: {
    officialDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    isFindAllShow: {
      type: Boolean,
      default() {
        return true
      }
    },
    idList: {
      type: String,
      default() {
        return ''
      }
    },
    cover: {
      type: String,
      default() {
        return ''
      }
    }
  },
  methods: {
    clickRow(e) {
      let path
      if (e.path[0].localName === 'tr') {
        path = e.path[0]
      } else {
        path = e.path[1]
      }
      this.$emit('clickRow', path)
    },
    dbClickRow(id, idx) {
      let list = this.idList
      this.$emit('dbClickRow', { id, idx, list })
    },
    clickFindAll(id) {
      let list = this.idList
      this.$emit('clickFindAll', { id, list })
    }
  }
}
</script>

<template>
  <div>
    <div class="official-item">
      <div class="list-cover">
        <img
          :src="officialDetail.coverImgUrl || cover"
          @click="officialDetail.coverImgUrl ? clickFindAll(officialDetail.id) : ''"
          :draggable="false"
        />
      </div>
      <div class="list-main">
        <slot name="title" />
        <table>
          <tr
            class="list-row"
            v-for="(v, idx) in
            (officialDetail.tracks && officialDetail.tracks.slice(0, 5)) ||
            (officialDetail.topSongs && (officialDetail.isOpen ?
             officialDetail.topSongs : officialDetail.topSongs.slice(0, 10))) ||
             officialDetail.songs.slice(0, 10)"
            :key="idx"
            @click="clickRow"
            @dblclick="dbClickRow(officialDetail.id || v.id, idx)"
          >
            <td class="idx">{{ idx + 1 }}</td>
            <td class="name">{{ v.name }}</td>
            <td class="singer">{{ v.ar[0].name }}</td>
          </tr>
        </table>
        <div
          class="find-all"
          @click="clickFindAll(officialDetail.id)"
          v-show="isFindAllShow"
        >
          查看全部 <i class="iconfont icon-arrow-right-bold" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.official-item {
  display: flex;
  margin: 20px 0 50px 0;
}

.list-cover {
  width: 180px;
  height: 180px;
  cursor: pointer;
  margin-right: 20px;
}

.list-cover img {
  width: 100%;
  border-radius: 20px;
}

.list-main {
  width: calc(100% - 200px);
  margin-left: 25px;
}

table {
  width: 100%;
  /** 决定表格的边框是分开的还是合并的 collapse合并 separate分开 */
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
}

.list-row {
  height: 35px;
  width: 100%;
  color: rgb(153, 153, 153);
  display: flex;
  align-items: center;
  position: relative;
}

.list-row:nth-child(odd) {
  background-color: #f9f9f9;
}

.list-row:hover {
  background-color: #f4f4f4;
}

.list-row td {
  transform: scale(0.9);
}

.list-row .name {
  color: rgb(31, 31, 31);
  transform: translate(-5%, -5%) scale(0.9);
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.idx {
  text-align: center;
  line-height: 28px;
  width: 35px;
}

.singer {
  text-align: right;
  /** 固定 防换行*/
  position: absolute;
  right: 10px;
}

.find-all {
  color: rgb(134, 134, 134);
  width: 100px;
  height: 30px;
  transform: scale(0.9) translateX(-5%);
  cursor: pointer;
  line-height: 30px;
}

.find-all i {
  font-size: 14px;
}
</style>