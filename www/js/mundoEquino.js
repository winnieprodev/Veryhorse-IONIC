angular.module('app.mundoEquino', ['app.dataService','app.filters'])

.controller('mundoEquinoCtrl', ['$scope', '$stateParams', '$firebaseArray', 'DataService', function ($scope, $stateParams, $firebaseArray, DataService) {
	var list = $firebaseArray(firebase.database().ref("/mundoEquino/"));
    $scope.items = [];
    $scope.banner = DataService.getRandomBanner();
    list.$loaded().then(function(x) {
        var rows = [];
        angular.forEach(x, function(row) {
            rows.push(row);
        });
        rows.sort(function(a, b) {
            var aTime = Math.round(new Date(a.date).getTime()/1000),
                bTime = Math.round(new Date(b.date).getTime()/1000);
            return bTime - aTime;
        });
        $scope.items = rows;
        $scope.banner = DataService.getRandomBanner();
    });

	$scope.getTitle = function(item){
		var lang = window.localStorage['lang'] || 'es';
		return item.title[lang];
	};

	$scope.getExcerpt = function(item){
		var lang = window.localStorage['lang'] || 'es';
		return item.excerpt[lang];
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}])
;