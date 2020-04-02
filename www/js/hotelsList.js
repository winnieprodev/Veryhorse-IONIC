angular.module('app.hotelsList', ['app.dataService','app.filters', 'ng-countryflags'])

.controller('hotelsListCtrl', ['$scope', '$http', '$translate', '$ionicLoading', 'DataService', function ($scope, $http, $translate, $ionicLoading, DataService) {
	$scope.title = $translate.instant('HOTELS');
	$scope.myCoords = {latitude: null, longitude: null};
    $scope.banner = DataService.getRandomBanner();

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.hotels = [];
        $scope.lang = $translate.use();
        
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.getData();
        console.log($scope.banner);
	});
    
    $scope.getData = function() {
        var url = 'http://newadmin.veryhorse.com/get-hotels-list?lang=' + $scope.lang;
		var hotelsData = [];
        $http.get(url).then(function(response) {
            angular.forEach(response.data.hotels, function(value, key) {
                value['cover_photo'] = 'http://newadmin.veryhorse.com/images/hotels/' + value['cover_photo'];
                value['distance'] = '';
                this.push(value);
            }, hotelsData);
            
            try {
                if(!$scope.isCoordsEmpty()) {
                    //position is cached, set data
                    console.log('$scope.myCoords exist', $scope.myCoords);
                    $scope.setDistance(hotelsData);
                } else {            
                    //get current position
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            console.log('Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude);
                            $scope.myCoords = position.coords;
                            $scope.setDistance(hotelsData);
                        }, function(error) {
                            console.log('getCurrentPosition error', error);
                            $scope.setData(hotelsData);
                        }, {maximumAge: 30000, timeout: 7000, enableHighAccuracy: false }
                    );
                }
            } catch(e) {
                console.error('catch block', e);
                $scope.setData(hotelsData);
            }
        });
    };
    
    $scope.setDistance = function(hotelsData) {
        console.log(hotelsData.length);
        for(var i in hotelsData) {
            hotelsData[i].offset = $scope.findDistance(hotelsData[i]);
            hotelsData[i].distance = hotelsData[i].offset ? hotelsData[i].offset + ' km' : '';
        }

        //sort by distance
        hotelsData.sort(function(a, b) {
            if(a.offset !== null && b.offset !== null) {
                return a.offset - b.offset;
            }
            return 0;
        });
        $scope.setData(hotelsData);
    };
    
    $scope.setData = function(hotelsData) {
        $scope.hotels = hotelsData;
        $ionicLoading.hide();
        $scope.$apply();
    };
    
    $scope.isCoordsEmpty = function() {
        return $scope.myCoords.latitude === null && $scope.myCoords.longitude === null;
    };
    
	$scope.findDistance = function(hotel) {
        if($scope.isCoordsEmpty()) {
            console.error('$scope.myCoords is empty', $scope.myCoords);
            return null;
        }
        
		var rad = function(x) {
            return parseFloat(x) * Math.PI / 180;
        };
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad($scope.myCoords.latitude - parseFloat(hotel.latitude));
		var dLong = rad($scope.myCoords.longitude - parseFloat(hotel.longitude));
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(rad(hotel.latitude)) * Math.cos(rad($scope.myCoords.latitude)) *
	    Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
        
        var distanceInKm = Math.ceil(d/1000);

		return distanceInKm;
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);
