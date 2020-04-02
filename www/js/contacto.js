angular.module('app.contacto', ['app.dataService','app.filters'])

.controller('contactoCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$firebaseObject', '$firebaseArray', '$filter', '$ionicHistory', '$ionicPopup', 'DataService', 'ionicDatePicker', '$translate', function ($scope, $rootScope, $http, $state, $stateParams, $firebaseObject, $firebaseArray, $filter, $ionicHistory, $ionicPopup, DataService, ionicDatePicker, $translate) {
	$scope.formErrors = false;
    $scope.banner = DataService.getRandomBanner();
	$scope.contactSent = false;
	$scope.send = function(){
		$scope.formErrors = false;
		if(!$scope.contactSent && $scope.formData.nombre != "" && $scope.formData.asunto != "" && $scope.formData.telefono!= "" && $scope.formData.explicacion != ""){
			$scope.contactSent = true;

			var data = $scope.formData;
			data.lang = window.localStorage['lang'];

            $http.jsonp('http://admin.veryhorse.com/php/send.php', {
                params   : {
                   	data 	: JSON.stringify(data),
		    		action 	: "send_emergencias"
                }

			}); 
		}else{
			$scope.formErrors = true;
		}
	};

	$scope.$on('$ionicView.beforeEnter', function() {
      	$scope.formData = {
      		nombre : $rootScope.user.userData.type == "user" ? $rootScope.user.userData.name +' '+$rootScope.user.userData.lastname : $rootScope.user.userData.name_empresa,
			asunto: '',
			telefono: $rootScope.user.userData.prefixMob + ' ' +$rootScope.user.userData.phoneMob,
			explicacion: ''
		};
		$scope.contactSent = false;
  	});
    
    $scope.showCondiciones = function(){
		$ionicPopup.alert({
		     //title: 'Condiciones generales de contratación',
		     //title: $translate.instant('CONDICIONES_POPUP_TITLE'),
		     title: $translate.instant('TERMINOS_USO_POLITICA'),
		     templateUrl: 'templates/condiciones_'+(window.localStorage.lang?window.localStorage.lang:'es')+'.html',
		     cssClass: 'tosPopup'
		   });
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };

}]);