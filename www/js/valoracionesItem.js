angular.module('app.valoracionesItem', ['app.dataService','app.filters'])

.controller('valoracionesItemCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$firebaseArray', '$firebaseObject', 'DataService', function ($scope, $rootScope, $state, $stateParams, $http, $firebaseArray, $firebaseObject, DataService) {
	$scope.contactSent = false;
	$scope.formErrors = false;
    $scope.banner = DataService.getRandomBanner();
    var sending = false;

	$scope.ratingsObject = {
        iconOn: 'ion-ios-star',   
        iconOff: 'ion-ios-star',  
        iconOnColor: '#FFFFFF', 
        iconOffColor:  '#605e00',
        minRating:0,   
        rating: 0,
        readOnly: false,
        callback: function(rating, index) {
        	$scope.userVal.rating = rating;
        }
    };
    $scope.valoracion = $firebaseObject(firebase.database().ref("/pending_valoraciones/"+$rootScope.user.uid+"/"+$stateParams.id));
    $scope.valoracion.$loaded(function(){
    	$scope.transportista = $firebaseObject(firebase.database().ref("/users/"+$scope.valoracion.trans));
    });
    
    $scope.userVal = {
    	rating: 0,
    	desc: ""
    }

    $scope.valorar = function(){

            $scope.formErrors = false;

            if($scope.userVal.rating == 0 || $scope.userVal.desc == ""){
                $scope.formErrors = true;
            }else{
                if(!sending){
                    sending = true;

                    if(!$scope.transportista.valoraciones){
                        $scope.transportista.valoraciones = [];
                    }
                    $scope.transportista.valoraciones.push({points: $scope.userVal.rating, desc: $scope.userVal.desc, user:$rootScope.user.uid, userName:$rootScope.user.userData.name+" "+$rootScope.user.userData.lastname, demandName: $scope.valoracion.demandName});
                    $scope.transportista.$save();
                    
                    $http.jsonp('http://admin.veryhorse.com/php/send.php', {
                        params   : {
                            data    : JSON.stringify({user: $scope.transportista.name_empresa, userEmail: $scope.transportista.email, demandName: $scope.valoracion.demandName, lang: $scope.transportista.idioma}),
                            action  : "send_valoracion"
                        }

                    }); 

                    $scope.valoracion.$remove();
                    $state.go('veryHorse.valoraciones');
                    $scope.contactSent = true;
                }
            }
    };
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);