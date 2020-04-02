angular.module('app.staticPage', ['app.dataService','app.filters'])

.controller('staticPageCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$translate', 'DataService', function ($scope, $rootScope, $state, $stateParams, $http, $translate, DataService) {
	$scope.banner = DataService.getRandomBanner();
    $scope.$on("$ionicView.beforeEnter", function(event, data){
        if(!$rootScope.staticPages) {
            $scope.getStaticPages();
        } else {
            $scope.setVars();
        }
	});
    
    $scope.setVars = function() {
        $scope.pageName = $stateParams.name;
        $scope.title = $rootScope.staticPages[$scope.pageName].title;
        $scope.page = {};
        $scope.lang = $translate.use();
        $scope.getStaticPage();
    };
    
    $scope.getStaticPage = function() {
        console.log($scope.pageName);
        var url = 'http://newadmin.veryhorse.com/get-static-page/' + $scope.pageName + '?lang=' + $scope.lang;
        $http.get(url).then(function(response) {
            $scope.page = response.data.page;
        });
    };
    
    $scope.getStaticPages = function(){
        var url = 'http://newadmin.veryhorse.com/get-static-pages?lang=' + $translate.use();
        $http.get(url).then(function(response) {
            angular.forEach(response.data.pages, function(value, key) {
                $rootScope.staticPages[value.name] = value;
            });
            $scope.setVars();
        });
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);
