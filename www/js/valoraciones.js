angular.module('app.valoraciones', ['app.dataService','app.filters'])

.controller('valoracionesCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$translate', 'DataService', function ($scope, $rootScope, $stateParams, $firebaseArray, $translate, DataService) {
	//$scope.title = "Valoraciones pendientes";
    $scope.banner = DataService.getRandomBanner();
	$scope.title = $translate.instant('VALORACIONES_PEN');
	$scope.valoraciones = $firebaseArray(firebase.database().ref("/pending_valoraciones/"+$rootScope.user.uid).orderByChild("date").endAt(+(new Date())));
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);