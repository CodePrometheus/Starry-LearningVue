<template>
  <div>
    <div class="title">周末去哪儿</div>
    <ul>
      <li class="item border-bottom" v-for="item of recommendList" :key="item.id">
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
  data () {
    return {
      recommendList: [
        {
          id: '0001',
          imgUrl: 'http://img1.qunarzz.com/sight/p0/201406/04/4f597aad25208a233999238c65af9b06.jpg_200x200_d1ea2bd2.jpg',
          title: '大连',
          desc: '海上乐园'
        },
        {
          id: '0002',
          imgUrl: 'http://img1.qunarzz.com/sight/p0/1805/9b/9b3cbcf2624bf8cea3.img.jpg_200x200_075bc9ef.jpg',
          title: '弘阳未来世界主题乐园',
          desc: '带你快乐一夏天'
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
@import '~@/assets/styles/mixins.styl'
.title
  margin-top: .2rem
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
