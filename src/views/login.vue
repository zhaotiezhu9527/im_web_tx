<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="title">用户登录</div>
      <a-form ref="formRef" :rules="rules" layout="vertical" :model="form">
        <a-form-item label="账号：" name="userName">
          <a-input size="large" v-model:value="form.userName" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="密码：" name="loginPwd">
          <a-input-password size="large" v-model:value="form.loginPwd" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item>
          <a-button class="button" size="large" block type="primary" @click="userLogin">
            登录
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button
            class="button"
            size="large"
            block
            type="success"
            @click="router.push('/register')"
          >
            立即注册
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useToken } from '@/store'
import { ref } from 'vue'

const router = useRouter()
const form = ref({
  userName: '',
  loginPwd: ''
})
const rules = ref({
  userName: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    }
  ],
  loginPwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '请输入6位数以上的密码',
      trigger: 'blur'
    }
  ]
})
const formRef = ref({})
let usetoken = useToken()
function userLogin() {
  formRef.value.validate().then(() => {
    window.$api.get_login(form.value).then((data) => {
      if (data.code === '0') {
        usetoken.setToken(data.token)
        usetoken.setUsersig(data.usersig)
        Cookies.set('token', data.token)
        Cookies.set('userID', form.value.userName)
        Cookies.set('usersig', data.usersig)
        window.location.href = '/'
      } else {
        window.$message.error(data.msg)
      }
    })
  })
}
</script>
<style>
.login-wrapper {
  width: 520px;
  height: 510px;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #ebedf0;
  box-shadow: 0px 2px 6px rgba(23, 23, 26, 0.1);
  padding: 74px 30px 80px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: 500;
}
.sub_title {
  text-align: center;
  color: #666666;
  font-size: 14px;
  margin-bottom: 30px;
  padding-top: 10px;
}
.button {
  border-radius: 0 !important;
}
</style>
