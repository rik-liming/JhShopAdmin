import pusher from '../pusher';
import emitter from '../eventBus';

export function initBusinessListener() {
  const channel = pusher.subscribe('jh-admin');

  channel.bind('AdminBusinessUpdated', async (data: any) => {
	  emitter.emit('business:updated', data);
  });

  channel.bind('AdminReddotUpdated', async (data: any) => {
	  emitter.emit('reddot:updated', data);
  });
}
