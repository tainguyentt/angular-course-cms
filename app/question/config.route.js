(function () {
	'use strict';

	angular
		.module('app.question')
		.config(configFunction);

	configFunction.$inject = ['$routeProvider'];

	function configFunction($routeProvider) {
		$routeProvider.when('/question/:questionId', {
			templateUrl: 'question/question.template.html',
			controller: 'QuestionController',
			controllerAs: 'vm',
		});
	}

})();
