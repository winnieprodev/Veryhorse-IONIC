angular.module('app.hotelsMap', ['app.dataService','app.filters', 'ng-countryflags'])

.controller('hotelsMapCtrl', ['$scope', '$rootScope', '$stateParams', '$http', 'DataService', '$translate', 'NgMap', function ($scope, $rootScope, $stateParams, $http, DataService, $translate, NgMap) {
	$scope.title = $translate.instant('HOTELS');
	$scope.mapCenter = '40.416775,-3.703790';
    $scope.zoomLevel = 5;
    $scope.map = NgMap.getMap();
    $scope.fiveStarsTop = 0;
    $scope.fiveStartChangeInProgress = false;
    $scope.banner = DataService.getRandomBanner();

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.hotels = [];
        $scope.lang = $translate.use();
        var url = 'http://newadmin.veryhorse.com/get-hotels-list?lang=' + $scope.lang;

        $http.get(url).then(function(response) {
            angular.forEach(response.data.hotels, function(value) {
                this.push(value);
            }, $scope.hotels);
            $scope.placeMarkersOnMap();
        });

        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });
	});

    $scope.placeMarkersOnMap = function() {
        if($scope.hotels) {
            var allLat = 0, allLong = 0, count = 0;
            for(var i in $scope.hotels) {
                var lat = parseFloat($scope.hotels[i].latitude), long = parseFloat($scope.hotels[i].longitude);
                allLat += lat;
                allLong += long;
                count++;
            }
            allLat = allLat / count;
            allLong = allLong / count;
            $scope.mapCenter = allLat + ',' + allLong;
        }
    };

    $scope.showItem = function (evt, id) {
        $scope.selectedHotel = $scope.hotels[id];
        $scope.map.showInfoWindow.apply(this, [evt, 'details']);
    };

    $scope.getIcon = function (hotel) {
        var img = hotel.five_stars > 0 ? "'img/map_green.png'" : "'img/map_orange.png'";
        return "{url: " + img + ", scaledSize:[28,48]}";
    };

    $scope.changeFiveStarsTop = function($event) {
        if($scope.fiveStartChangeInProgress) {
            return false;
        }
        
        var button = angular.element($event.currentTarget);
        if($scope.fiveStarsTop == 0) {
            $scope.fiveStarsTop = 1;
            button.addClass('activePins');
        } else {
            $scope.fiveStarsTop = 0;
            button.removeClass('activePins');
        }
        $scope.fiveStartChangeInProgress = true;
        //$scope.$apply();
        setTimeout(function() {
            $scope.fiveStartChangeInProgress = false;
        }, 2000);
        return true;
    };
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);
