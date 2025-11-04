import mitt from 'mitt';

type Events = {
	'business:updated': { };
//   'asset:changed': { user_id: number; delta: number };
  // ...其他类型
};

const emitter = mitt<Events>();
export default emitter;
