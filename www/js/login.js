angular.module('app.login', ['app.dataService','app.filters'])

.controller('loginCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseAuth', '$translate', function ($scope, $rootScope, $stateParams, $firebaseAuth, $translate) {
	$scope.formData = {
		email     : "",
		password : ""
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.doingLogin = false;
		$scope.formError = {msg     : ""};
	});	

	$scope.login = function(){
		$scope.doingLogin = true;
		$scope.formError.msg = "";

		$firebaseAuth().$signInWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function(firebaseUser) {
		  	console.log("Logged in");
		}).catch(function(error) {
			$scope.doingLogin = false;
			if(error.code === "auth/user-not-found" || error.code === "auth/wrong-password"){
				$scope.formError.msg = $translate.instant('EMAIL_CONTRASEÑA_INCORRECTO');
			}
		  	console.error("Authentication failed:");
		  	console.log(error.code);
		});
	};

	
}]);