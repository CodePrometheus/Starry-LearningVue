<template>
  <div class="w">
    <city-header/>
    <city-search :cities="cities"/>
    <city-list :cities="cities" :hot="hotCities" :letter="letter"/>
    <city-alphabet :cities="cities" @change="handleLetterChange"/>
  </div>
</template>

<script>
import CityHeader from './components/CityHeader'
import CitySearch from './components/Search'
import CityList from './components/List'
import CityAlphabet from './components/Alphabet'
import axios from 'axios'

export default {
  name: 'City',
  components: {
    CityHeader,
    CitySearch,
    CityList,
    CityAlphabet
  },
  data () {
    return {
      cities: {},
      hotCities: [],
      letter: ''
    }
  },

  methods: {
    getCityInfo () {
      axios.get('/api/city.json')
        .then(this.handleGetCityInfoSuccess)
    },
    handleGetCityInfoSuccess (res) {
      console.log(res)
      res = res.data
      if (res.ret && res.data) {
        const data = res.data
        this.cities = data.cities
        this.hotCities = data.hotCities
      }
    },
    handleLetterChange (letter) {
      this.letter = letter
    }
  },

  // create也行，建议mounted
  mounted () {
    this.getCityInfo()
  }
}
</script>

<style lang="stylus" scoped>
* {
  font-family: Arial, "Microsoft Yahei", "Helvetica Neue", Helvetica, sans-serif;
}

.w {
  max-width: 13rem; /*移动端650px,并且最好使用max-width*/
  margin: 0 auto;
}
</style>
