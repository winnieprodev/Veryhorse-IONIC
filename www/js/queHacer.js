angular.module('app.queHacer', ['app.dataService','app.filters'])

.controller('queHacerCtrl', ['$scope', '$rootScope', '$stateParams', 'DataService', function ($scope, $rootScope, $stateParams, DataService) {
	$scope.getUserName = function(){
		if($rootScope.user && $rootScope.user.userData){
			if($rootScope.user.userData.type === "user"){
				return $rootScope.user.userData.name;		
			}else if($rootScope.user.userData.type === "transportista"){
				return $rootScope.user.userData.name_comercial;		
			}
			
		}else{
			return "";
		}
		
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.aprobado = $rootScope.user.userData.aprobado;
		$scope.bloqueado = $rootScope.user.userData.bloqueado;
	});	
}]);