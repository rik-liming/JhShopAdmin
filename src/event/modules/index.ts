import { initBusinessListener } from './businessListener';
import { initAdminListener } from './adminListener';

export function initEventListeners() {
	initBusinessListener();
	initAdminListener();
}
