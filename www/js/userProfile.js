angular.module('app.userProfile', ['app.dataService','app.filters'])

.controller('userProfileCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', 'DataService', '$firebaseObject', '$firebaseAuth', '$ionicScrollDelegate', '$translate', '$ionicHistory', function ($scope, $rootScope, $state, $stateParams, $ionicPopup, DataService, $firebaseObject, $firebaseAuth, $ionicScrollDelegate, $translate, $ionicHistory) {
	$scope.countries = DataService.getCountries();
    $scope.banner = DataService.getRandomBanner();
	$scope.idiomas = DataService.getLanguages();
	var ref = firebase.database().ref("/users/" + $rootScope.user.uid);
	var obj;
	var sending = false;

	$scope.$on("$ionicView.afterEnter", function(event, data){
		$scope.formSaved = false;
		sending = false;

		obj = $firebaseObject(ref);
		obj.$loaded(function(){
			$scope.formData = {
				name      		: obj.name,
				lastname  		: obj.lastname,
				age       		: parseInt(obj.age),
				idioma          : obj.idioma,
				 
				address   		: obj.address,
				town      		: obj.town,
				cp        		: parseInt(obj.cp),
				country   		: obj.country,
				 
				prefixFix 		: obj.prefixFix?obj.prefixFix:null,
				phoneFix  		: obj.phoneFix?parseInt(obj.phoneFix):null,
				prefixMob 		: obj.prefixMob?obj.prefixMob:null,
				phoneMob  		: obj.phoneMob?parseInt(obj.phoneMob):null,
				 
				email     		: obj.email,
				confirmEmail    : "",
				password  		: "",
				confirmPassword : ""

			};
		});
		resetErrors();
	});

	function resetErrors(){
		$scope.formErrors = {
			name                     : false,
			lastname                 : false,
			age                      : false,
			idioma 					 : false,
			
			address                  : false,
			town                     : false,
			cp                       : false,
			country                  : false,
			
			phoneFix                 : false,
			phoneMob                 : false,
			
			password                 : false,
			confirmPassword          : false,
			confirmPasswordCoinciden : false,
			login_again				 : false

			//confirmPassword          : false,
			//confirmPasswordCoinciden : false
			
		};
	}


	
	//var sending = false;
	$scope.send = function(){
			resetErrors();
			var changePassword = false;
			var error = false;

			if($scope.formData.name      === ""){ error = true; $scope.formErrors.name = true;}
			if($scope.formData.lastname  === ""){ error = true; $scope.formErrors.lastname = true;}
			if($scope.formData.address   === ""){ error = true; $scope.formErrors.address = true;}
			if($scope.formData.idioma    === null || $scope.formData.idioma === ""){ error = true; $scope.formErrors.idioma = true;}
			if($scope.formData.town      === ""){ error = true; $scope.formErrors.town = true;}
			if($scope.formData.cp        === ""){ error = true; $scope.formErrors.cp = true;}
			if($scope.formData.country   === ""){ error = true; $scope.formErrors.country = true;}
			// if($scope.formData.prefixFix === ""){ error = true; $scope.formErrors.phoneFix = true;}
			// if($scope.formData.phoneFix  === ""){ error = true; $scope.formErrors.phoneFix = true;}
			if($scope.formData.prefixMob === ""){ error = true; $scope.formErrors.phoneMob = true;}
			if($scope.formData.phoneMob  === "" || isNaN($scope.formData.phoneMob)){ error = true; $scope.formErrors.phoneMob = true;}
			

		if($scope.formData.password  !== ""){ 
			changePassword = true;

			if($scope.formData.password.length < 6){
				error = true; $scope.formErrors.password = true;
			}
			if($scope.formData.confirmPassword.length < 6){
				error = true; $scope.formErrors.confirmPassword = true;
			}

			if($scope.formData.password !== $scope.formData.confirmPassword){
				error = true; $scope.formErrors.confirmPasswordCoinciden = true;
			}	
		}

		if(!error){
			if(!sending){
				sending = true;
			
				obj.name      = $scope.formData.name     ;
				obj.lastname  = $scope.formData.lastname ;
				obj.idioma    = $scope.formData.idioma ;
				//obj.age       = $scope.formData.age      ;
				obj.address   = $scope.formData.address  ;
				obj.town      = $scope.formData.town     ;
				obj.cp        = $scope.formData.cp       ;
				obj.country   = $scope.formData.country  ;
				obj.prefixFix = $scope.formData.prefixFix;
				obj.phoneFix  = $scope.formData.phoneFix ;
				obj.prefixMob = $scope.formData.prefixMob;
				obj.phoneMob  = $scope.formData.phoneMob ;

				obj.$save().then(function(ref) {

					if(obj.idioma && obj.idioma !== window.localStorage['lang']){
						window.localStorage['lang'] = obj.idioma;
						$translate.use(obj.idioma);
						$ionicHistory.clearCache();
					}

					if(changePassword){
						$firebaseAuth().$updatePassword($scope.formData.password).then(function() {
						  console.log("Password changed successfully!");
						  $scope.formSaved = true;
						  $ionicScrollDelegate.scrollTop();
						}).catch(function(error) {
							if(error.code === "auth/requires-recent-login"){
								$scope.formErrors.login_again = true;
							}
							sending = false;
						  console.error("Error: ", error);
						});
					}else{
						$scope.formSaved = true;
						$ionicScrollDelegate.scrollTop();
					}
				  
				}, function(error) {
				  console.log("Error:", error);
				});
			}
		}

	};

	$scope.deleteAccount = function(){
		var confirmPopup = $ionicPopup.confirm({
		    title:$translate.instant('ELIMINAR_CUENTA'),
		    template: $translate.instant('SEGURIDAD'),
		    buttons: [
				{ text: $translate.instant('CANCELAR') },
			    { 
			    	//text: '<b>Si</b>',
			    	text: $translate.instant('SI'),
			      	type: 'button-vh',
			       	onTap: function(e) {

			       		confirmPopup.then(function(res){
			       			obj.$remove();
			    			angular.forEach($rootScope.openFirebaseConnections, function(con){
			    				con.$destroy();
			    			});
						    $rootScope.user = null;
						    $firebaseAuth().$deleteUser();
						    $firebaseAuth().$signOut();
						    //$state.go('veryHorse.mundoEquino');
						    $state.go('veryHorse.selectLanguage');
			       		});
			        }
			   	}
			]
		});
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);