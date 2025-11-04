import pusher from '../pusher';
import emitter from '../eventBus';

export function initBusinessListener() {
  const channel = pusher.subscribe('jh-admin');

  channel.bind('BusinessUpdated', async (data: any) => {
	  emitter.emit('business:updated', data);
  });
}
