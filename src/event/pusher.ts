import Pusher from 'pusher-js';

// 从环境变量加载配置
const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

export default pusher;
