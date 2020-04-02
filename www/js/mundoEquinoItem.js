angular.module('app.mundoEquinoItem', ['app.dataService','app.filters'])

.controller('mundoEquinoItemCtrl', ['$scope', '$stateParams', '$firebaseObject', 'DataService', function ($scope, $stateParams, $firebaseObject, DataService) {
	$scope.item = $firebaseObject(firebase.database().ref("/mundoEquino/"+$stateParams.id));
    $scope.banner = DataService.getRandomBanner();

	$scope.getTitle = function(){
		var lang = window.localStorage['lang'] || 'es';
		return $scope.item.title[lang];
	};

	$scope.getContent = function(){
		var lang = window.localStorage['lang'] || 'es';
		return $scope.item.content[lang];
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);