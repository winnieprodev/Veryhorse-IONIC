angular.module('app.hotelsDetails', ['app.dataService','app.filters', 'ng-countryflags', 'ngSanitize'])

.controller('hotelsDetailsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'DataService', '$translate', '$ionicSlideBoxDelegate', '$ionicPlatform', '$sce', function ($scope, $rootScope, $state, $stateParams, $http, DataService, $translate, $ionicSlideBoxDelegate, $ionicPlatform, $sce) {
	$scope.photos = [];
    $scope.title = $translate.instant('HOTELS');
    $scope.distance = '';
    $scope.myCoords = {latitude: null, longitude: null};
    $scope.banner = DataService.getRandomBanner();

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.hotel = {};
        $scope.lang = $translate.use();
        var url = 'https://newadmin.veryhorse.com/get-hotel-info?lang=' + $scope.lang + '&id=' + $stateParams.id;

        $http.get(url).then(function(response) {
            $scope.hotel = response.data.hotel;
            console.log($scope.hotel);
            $scope.title = $scope.hotel.name;
            $scope.hotel['cover_photo'] = 'https://newadmin.veryhorse.com/images/hotels/' + $scope.hotel['cover_photo'];
            if($scope.hotel['photos']) {
                for(var i in $scope.hotel['photos']) {
                    $scope.hotel['photos'][i] = 'https://newadmin.veryhorse.com/images/photos/' + $scope.hotel['photos'][i];
                }
                $scope.photos = $scope.hotel['photos'];
            }
            if($scope.hotel['whatsapp']) {
                $scope.hotel['whatsapp'] = 'https://api.whatsapp.com/send?phone=' + $scope.hotel['whatsapp'].replace(/[\D]+/, '');
            }
            
            if($scope.hotel['youtube']) {
               $scope.hotel['youtube'] = $sce.trustAsResourceUrl($scope.hotel['youtube']);
            } else {
               $scope.hotel['youtube'] = false;
            }
            $scope.setDistance();
        });
	});

    $scope.initSlides = function() {
        setTimeout(function() {
            $ionicSlideBoxDelegate.slide(0);
            $ionicSlideBoxDelegate.update();
            $scope.$apply();
        });
    };
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };

    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };

    $scope.callPhoneNumber = function(prefix, number) {
		console.log("" + prefix + "" + number);
        var clearPhoneNmber = 'tel:+' + ("" + prefix).replace(/([\D\+\-\s]+)/g, '') + ("" + number).replace(/([\D\+\-\s]+)/g, '');
        clearPhoneNmber = clearPhoneNmber.replace(' ', '').replace(/[\s]+/g, '');
        console.log("calling " + clearPhoneNmber);
        window.open(clearPhoneNmber);
    };

    $scope.showRoute = function(latitude, longitude) {
        var destination = latitude + ',' + longitude;
        if($ionicPlatform.is('ios')) {
            window.open('maps://?q=' + destination, '_system');
        } else {
        	var label = encodeURI($scope.hotel.name);
            window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
        }
    };

    $scope.setDistance = function() {
        //get current position
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude);
                $scope.myCoords = position.coords;
                $scope.distance = ', ' + $scope.findDistance($scope.hotel);
                console.log($scope.hotel.name + ' = ' + $scope.distance);
                $scope.$apply();
            }, function(error) {
                console.log(error);
            }, {maximumAge: 30000, timeout: 5000, enableHighAccuracy: false }
        );
    };

	$scope.findDistance = function(hotel) {
        if($scope.myCoords.latitude === null && $scope.myCoords.longitude === null) {
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

		return distanceInKm + ' km';
	};

}]);
