angular.module('app.compartir', ['app.dataService','app.filters'])

.controller('compartirCtrl', ['$scope','$rootScope', '$stateParams', '$http', 'DataService', function ($scope, $rootScope, $stateParams, $http, DataService) {

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.formData = {
			nombre      : $rootScope.user.userData.type === "transportista"? $rootScope.user.userData.name_comercial: $rootScope.user.userData.name,
			email       : $rootScope.user.userData.email,
			friend      : "",
			friendEmail : ""
		};

		$scope.contactSent = false;
		$scope.formErrors = false;
        $scope.banner = DataService.getRandomBanner();
	});

	$scope.contactSent = false;  
	$scope.send = function(){
		if(!$scope.contactSent && $scope.formData.nombre !== "" && $scope.formData.email !== "" && $scope.formData.friend !== "" && $scope.formData.friendEmail !== ""){
			$scope.contactSent = true;

			var data = $scope.formData;
			data.lang = window.localStorage['lang'];

            $http.jsonp('http://admin.veryhorse.com/php/send.php', {
                params   : {
                   	data 	: JSON.stringify({data: data}),
					action 	: "send_friend"
                }
			}); 
				
			$scope.contactSent = true;
		}else{
			$scope.formErrors = true;
		}
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);