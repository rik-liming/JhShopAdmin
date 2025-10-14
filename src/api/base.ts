import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 Element UI 的 ElMessage
import router from '@/router'; // 假设你使用的是 Vue Router

const axiosInstance = axios.create({
  baseURL: 'http://be.jhshop.kuntai-tech.com',
  timeout: 5000 // 请求超时
});

axiosInstance.interceptors.response.use(
  (response) => {
    // 检查返回的 response.data.code 是否是 10002
    if (response.data.code === 10002) {
      // 弹框提示用户登录失效
        ElMessage.warning('登录已失效，请重新登录。')
        
        router.push('/forcelogout')
        return
    }
    return response; // 正常响应返回
  },
  (error) => {
    return Promise.reject(error); // 如果有其他错误，则继续抛出
  }
);

export default axiosInstance;
