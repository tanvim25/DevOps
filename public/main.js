var app = angular.module("app", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/main.html',
	})
	.otherwise('/');
}]);