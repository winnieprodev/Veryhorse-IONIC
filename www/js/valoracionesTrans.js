angular.module('app.valoracionesTrans', ['app.dataService','app.filters'])

	.controller('valoracionesTransCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$translate', 'DataService', function ($scope, $rootScope, $stateParams, $firebaseArray, $translate, DataService) {
	//$scope.title = "Valoraciones";
	$scope.title = $translate.instant('VALORACION');
	$scope.valoraciones = angular.copy($rootScope.user.userData.valoraciones);
    $scope.banner = DataService.getRandomBanner();
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
	
	angular.forEach($scope.valoraciones, function(v){
		v.ratingsObject = {
	        iconOn: 'ion-ios-star',   
	        iconOff: 'ion-ios-star-outline',  
	        iconOnColor: '#605e00', 
	        iconOffColor:  '#605e00',
	        minRating:0,   
	        rating: v.points,
	        readOnly: false,
	        callback: function(rating, index) {}
	    };
	})
}]);