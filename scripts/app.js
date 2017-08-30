'use strict';

// declare modules
angular.module('Random', []);
angular.module('Mixto', []);
angular.module('Multiplicativo', []);
angular.module('Normal', []);
angular.module('Exponencial', []);
angular.module('SimulacioneApp', [
    'Random',
    'Mixto',
    'Multiplicativo',
    'Normal',
    'Exponencial',
    'ngRoute',
    'ui.bootstrap',
    'angular-confirm',
    'ui-notification',
    ])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/random', {
        controller: 'RandomController',
        templateUrl: 'modules/random/views/random.html'
    })
    .when('/multiplicativo', {
        controller: 'MultiplicativoController',
        templateUrl: 'modules/multiplicativo/views/multiplicativo.html'
    })
    .when('/mixto', {
        controller: 'MixtoController',
        templateUrl: 'modules/mixto/views/mixto.html'
    })
    .when('/normal', {
        controller: 'NormalController',
        templateUrl: 'modules/normal/views/normal.html'
    })
    .when('/exponencial', {
        controller: 'ExponencialController',
        templateUrl: 'modules/exponencial/views/exponencial.html'
    })
    .otherwise({ redirectTo: '/random' });
}])

.run(['$rootScope', '$location', '$http',
    function ($rootScope, $location, $http) {	
		
        
    }]);