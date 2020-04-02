angular.module('app.helpSection', ['app.dataService','app.filters'])

.controller('helpSectionCtrl', ['$scope', '$rootScope', '$stateParams', '$http', 'DataService', '$translate', '$ionicPopup', function ($scope, $rootScope, $stateParams, $http, DataService, $translate, $ionicPopup) {
	$scope.title = $translate.instant('HELP');
    $scope.banner = DataService.getRandomBanner();
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.pages = [];
        $scope.lang = $translate.use();
        var url = 'http://newadmin.veryhorse.com/get-static-pages?lang=' + $scope.lang;
		
        $http.get(url).then(function(response) {
            $rootScope.staticPages = {};
            angular.forEach(response.data.pages, function(value, key) {
                $rootScope.staticPages[value.name] = value;
                this.push(value);
            }, $scope.pages);
        });
	});
    
    $scope.appVersion = function(){
        if (window.cordova) {
            cordova.getAppVersion(function(version) {
                var appVersion = version;
                $ionicPopup.alert({
                    title: $translate.instant('APP_VERSION'),
                    template: $translate.instant('APP_VERSION_TEXT') + appVersion
                });
            });
        }
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);
