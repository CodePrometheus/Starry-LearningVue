<template>
  <div>
    <div class="title">周末去哪儿</div>
    <ul>
      <li class="item border-bottom" v-for="item of list" :key="item.id">
        <div class="item-img-wrapper">
          <img class="item-img" :src="item.imgUrl">
        </div>
        <div class="item-info">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-desc">{{ item.desc }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Weekend',
  props: {
    list: Array
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
@import '~@/assets/styles/mixins.styl'
.title
  line-height: .8rem
  background: #eee

.item-img-wrapper
  overflow: hidden
  height: 0
  padding-bottom: 33.9%

  .item-img
    center: center
    width: 100%

.item-info
  text-align: left
  padding: .1rem

  .item-title
    line-height: .54rem
    font-size: .28rem
    color: #212121
    ellipsis()

  .item-desc
    line-height: .4rem
    color: #616161
    font-size: .24rem
    width: 100%
    ellipsis()
</style>
