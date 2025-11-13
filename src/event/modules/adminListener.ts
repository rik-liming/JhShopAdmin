import pusher from '../pusher';
import emitter from '../eventBus';

export function initAdminListener() {
  const channel = pusher.subscribe('jh-admin');

  channel.bind('AdminStatusChanged', async (data: any) => {
	  emitter.emit('admin:statusChanged', data);
  });

  channel.bind('AdminRoleStatusChanged', async (data: any) => {
	  emitter.emit('admin:roleStatusChanged', data);
  });
}
