<script>
export default {
  data() {
    return {
      loginForm: {
        passwd: '',
        phoneNum: ''
      }
    }
  },
  methods: {
    login() {
      this.genPhoneReq()
    },
    async genPhoneReq() {
      let timestamp = Date.parse(new Date())
      let res = await this.$request('/login/cellphone', {
        phone: this.loginForm.phoneNum,
        password: this.loginForm.passwd,
        withCredentials: true,
        timestamp,
      })
      if (res.data.code === 200) {
        window.localStorage.setItem("userId", res.data.profile.userId)
        // 将userInfo传回父组件
        this.$emit("getUserInfo", res.data.profile)
        this.$message.success("登录成功!")
        this.$store.commit("updateLoginState", true)
      } else if (res.data.code === 400) {
        this.$message.error("手机号错误!")
        return
      } else if (res.data.code === 502) {
        this.$message.error("密码错误!")
        return
      } else {
        this.$message.error("登录失败，请稍后重试!")
        return
      }
      this.loginForm = {}
    }
  }
}
</script>

<template>
  <div class="login">
    <div class="title">Login</div>
    <el-form
      ref="form"
      v-model="loginForm"
      label-width="80px"
      label-position="right"
      size="mini"
    >
      <el-form-item
        label="手机号: "
        size="mini"
        label-width="100px"
        required
      >
        <input
          type="text"
          v-model="loginForm.phoneNum"
          class="input"
        />
      </el-form-item>
      <el-form-item
          label="密码: "
          size="mini"
          label-width="100px"
          required
      >
        <input
            type="password"
            v-model="loginForm.passwd"
            class="input"
        />
      </el-form-item>
      <div class="button">
        <el-button
          type="danger"
          @click="login"
          size="mini"
        >
          登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.el-form {
  padding-top: 20px;
}

.input {
  width: 170px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #999;
  padding-left: 5px;
  outline: none;
}

.button {
  width: 100%;
  text-align: center;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.button .el-button {
  width: 200px;
}
</style>