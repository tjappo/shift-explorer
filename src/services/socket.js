import io from 'socket.io-client';
import AppServices from './services.module';

/**
 * @todo isolate socket.io
 */
AppServices.factory('$socket',
	($location, $rootScope, $window) => (namespace) => {
		const nodes = $window.nodes;
		const node = nodes[Math.floor(Math.random() * nodes.length)];
		const socketNode = node.replace(/^.+\/\//, '');
		const socket = io(`${socketNode}${namespace}`, { forceNew: true });

		return {
			on(eventName, callback) {
				socket.on(eventName, (...args) => {
					$rootScope.$apply(() => {
						callback.apply(socket, args);
					});
				});
			},

			emit(eventName, data, callback) {
				socket.emit(eventName, data, (...args) => {
					$rootScope.$apply(() => {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			},

			removeAllListeners(eventName, callback) {
				socket.removeAllListeners(eventName, (...args) => {
					$rootScope.$apply(() => {
						callback.apply(socket, args);
					});
				});
			},
		};
	});
