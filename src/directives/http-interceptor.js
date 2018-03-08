import AppTools from '../app/app-tools.module';

AppTools.config(['$httpProvider', '$windowProvider',
	($httpProvider, $windowProvider) => {
		$httpProvider.interceptors.push(() => ({
			request: (requestConfig) => {
				if (requestConfig.url.startsWith('/')) {
					const nodes = $windowProvider.$get().nodes;
					const node = nodes[Math.floor(Math.random() * nodes.length)];
					requestConfig.url = `${node}${requestConfig.url}`;
				}

				return requestConfig;
			},
		}));
	}]);
