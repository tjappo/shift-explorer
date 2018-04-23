import io from 'socket.io-client';
import AppServices from './services.module';

/**
 * @todo isolate socket.io
 */
AppServices.factory('$socket',
	($location, $rootScope, $window) => (namespace) => {
		const node = $window.currentnode;
		const socketNode = node.replace(/^.+\/\//, '');
		const socket = io(`${socketNode}${namespace}`, {
			forceNew: true,
			timeout: 3000,
			reconnection: false });

		socket.on('connect_error', () => {
			$window.cyclenode();
			socket.io.uri = $window.currentnode;
			setTimeout(() => socket.io.reconnect(), 100);
		});

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
