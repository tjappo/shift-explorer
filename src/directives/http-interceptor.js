import AppTools from '../app/app-tools.module';

AppTools.config(['$httpProvider', '$windowProvider',
	($httpProvider, $windowProvider) => {
		$httpProvider.interceptors.push(() => ({
			request: (requestConfig) => {
				if (requestConfig.url.startsWith('/')) {
					const node = $windowProvider.$get().currentnode;
					requestConfig.timeout = 3500;
					requestConfig.url = `${node}${requestConfig.url}`;
				}

				return requestConfig;
			},
		}));
	}]);
