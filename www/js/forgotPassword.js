angular.module('app.forgotPassword', ['app.dataService','app.filters'])

.controller('forgotPasswordCtrl', ['$scope', '$stateParams', 'DataService', function ($scope, $stateParams, DataService) {
	var sending = false;

    $scope.banner = DataService.getRandomBanner();

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.contactSent = false;
		sending = false;
	});

	$scope.send = function(){
		if(!sending){
			sending = true;
			var auth = firebase.auth();
			
			auth.sendPasswordResetEmail($scope.formData.email).then(function() {
			  	$scope.contactSent = true;
			  	$scope.$apply();
			}, function(error) {
		  		console.log(error);
			});	
		}
	};

	$scope.$on('$ionicView.beforeEnter', function() {
      	$scope.formData = {
			email: ""
		};

		$scope.contactSent = false;
  	});
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}])
;