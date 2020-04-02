angular.module('app.presentacion', ['app.dataService','app.filters'])

.controller('presentacionCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$window', '$timeout', '$translate', function ($scope, $rootScope, $stateParams, $state, $window, $timeout, $translate) {
	$scope.tabs = [
		{picture: "1.jpg", title: $translate.instant('TRANSPORTE'), 			text: $translate.instant('TEXTO_TRANSPORTE_CALIDAD')},
		{picture: "2.jpg", title: $translate.instant('MEJOR'),					text: $translate.instant('TEXTO_MEJOR_TRASLADO')},
		{picture: "3.jpg", title: $translate.instant('CERTIFICADO_GARANTIA'),	text: $translate.instant('TEXTO_CERTIFICADO_GARANTIA')},
		{picture: "4.jpg", title: $translate.instant('PROFESIONALES'), 			text: $translate.instant('TEXTO_PROFESIONALES_ALCANCE')}
	]; 

	$scope.showTab = function(index){
		if(index >= 0 && index < $scope.tabs.length){
			$timeout.cancel($scope.slidesTimer);
			$scope.nextSlideTimer();
			$scope.currentTab = index;
		}
	};

	$scope.slidesTimer = null;
	$scope.nextSlideTimer = function(){
		$scope.slidesTimer = $timeout(function(){
			$scope.showTab($scope.currentTab+1);
		},6000);
	};
	$scope.currentTab = 0;
	$scope.$on("$ionicView.afterEnter", function(event, data){
		$scope.currentTab = 0;
		$scope.nextSlideTimer();
	});

	$timeout(function(){
		$window.localStorage.presentacion = true;
	},1000);
	
	$scope.start = function(){
		if($rootScope.user){
			$state.go("veryHorse.mundoEquino");		
		}else{
			$state.go("veryHorse.login");	
		}
	};
}]);
