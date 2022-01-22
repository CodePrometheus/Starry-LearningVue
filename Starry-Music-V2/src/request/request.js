import axios from 'axios'
import store from '../store/index'

export function request(url, params) {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true,
  })

  instance.interceptors.request.use(
    (config) => {
      return config
    },
    (err) => {
      console.log(err)
    }
  )

  instance.interceptors.response.use(
    (config) => {
      return config
    },
    (err) => {
      console.log([err])
      if (err.response.data.msg === 'Need To Login') {
        store.state.isLogin = false
      } else {
        console.log(err.response.data.msg)
      }
    }
  )

  instance.defaults.withCredentials = true

  if (params) {
    params = {
      params: params,
    }
    return instance.get(url, params)
  } else {
    return instance.get(url)
  }
}
