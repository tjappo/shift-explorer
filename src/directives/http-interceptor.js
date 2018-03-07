import AppTools from '../app/app-tools.module';
import config from '../config.json';

AppTools.config(['$httpProvider',
	($httpProvider) => {
		$httpProvider.interceptors.push(() => ({
			request: (requestConfig) => {
				if (requestConfig.url.startsWith('/')) {
					const node = config.nodes[Math.floor(Math.random() * config.nodes.length)];
					requestConfig.url = `http://${node}${requestConfig.url}`;
				}

				return requestConfig;
			},
		}));
	}]);
