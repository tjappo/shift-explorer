import AppTools from '../app/app-tools.module';

const relHref = AppTools.directive('relHref', ($rootScope) => ({
	link: ($scope, $element, $attrs) => {
		$attrs.$set('href', $rootScope.baseUrl($attrs.relHref));
	},
}));

export default relHref;
