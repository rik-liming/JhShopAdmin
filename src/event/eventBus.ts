import mitt from 'mitt';

type Events = {
	'business:updated': { };
	'reddot:updated': { };
	'admin:statusChanged': { admin_id: number };
	'admin:roleStatusChanged': { role: string };
	'admin:privilegeChanged': { role: string };
	'admin:passwordChanged': { admin_id: number };
	
//   'asset:changed': { user_id: number; delta: number };
  // ...其他类型
};

const emitter = mitt<Events>();
export default emitter;
