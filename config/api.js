import request from './request'

/**
 * 登录
 * @param {*} params
 */
async function get_login(params) {
  return request({
    url: 'im-qtapi-test/user/login',
    method: 'post',
    data: params
  })
}

/**
 * 注册
 * @param {*} params
 */
async function get_register(params) {
  return request({
    url: 'im-qtapi-test/user/register',
    method: 'post',
    data: params
  })
}

/**
 * 退出登录
 * @param {*} params
 */
async function get_logout(params) {
  return request({
    url: 'im-qtapi-test/user/logout',
    method: 'post',
    data: params
  })
}

export default {
  get_register,
  get_login,
  get_logout
}
