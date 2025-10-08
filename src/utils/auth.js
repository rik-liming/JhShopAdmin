import Cookies from 'js-cookie';

const tokenKeyPrefix = 'login-token-';

/**
 * 获取 token
 * @param userId 用户 ID
 */
export function getToken(userId) {
  return Cookies.get(`${tokenKeyPrefix}${userId}`);
}

/**
 * 设置 token
 * @param userId 用户 ID
 * @param token token 值
 */
export function setToken(userId, token) {
  return Cookies.set(`${tokenKeyPrefix}${userId}`, token);
}

/**
 * 删除 token
 * @param userId 用户 ID
 */
export function removeToken(userId) {
  return Cookies.remove(`${tokenKeyPrefix}${userId}`);
}
