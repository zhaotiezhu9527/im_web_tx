import request from './request'

/**
 * 登录
 * @param {*} params
 */
async function get_login(params) {
  return request({
    url: 'im-qtapi-test/user/login/V2',
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
    url: 'im-qtapi-test/user/register/v2',
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

/**
 * 修改密码
 * @param {*} params
 */
async function user_update_pwd(params) {
  return request({ url: 'user/updatePwd', method: 'post', data: params })
}

/**
 * 获取checksign过期时间
 * @param {*} params
 */
async function user_checkSign(params) {
  return request({
    url: 'im-qtapi-test/user/checkSign',
    method: 'get',
    data: params
  })
}

/**
 * 系统信息
 * @param {*} params
 */
async function system_config(params) {
  return request({
    url: 'im-qtapi-test/system/config',
    method: 'get',
    data: params
  })
}
export default {
  get_register,
  get_login,
  user_update_pwd,
  user_checkSign,
  system_config,
  get_logout
}
