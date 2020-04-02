angular.module('app.userProfileTrans', ['app.dataService','app.filters'])

.controller('userProfileTransCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$filter', '$q', 'DataService', '$firebaseObject', '$firebaseAuth', '$ionicScrollDelegate', '$ionicPopup', '$translate', '$ionicHistory', function ($scope, $rootScope, $state, $stateParams, $filter, $q, DataService, $firebaseObject, $firebaseAuth, $ionicScrollDelegate, $ionicPopup, $translate,$ionicHistory) {
	$scope.countries = DataService.getCountries();
	$scope.idiomas = DataService.getLanguages();
	$scope.formData = {};
	$scope.formErrors = {};
    $scope.banner = DataService.getRandomBanner();
	

	$scope.loadCountries = function(query){
		var deferred = $q.defer();
	    deferred.resolve( $filter('filterCountries')($scope.countries, query));
	    return deferred.promise;
	};
	var ref = firebase.database().ref("/users/" + $rootScope.user.uid);
	var obj;
	var sending = false;

	$scope.$on("$ionicView.afterEnter", function(event, data){
		sending = false;
		$scope.formSaved = false;

		obj = $firebaseObject(ref);
		obj.$loaded(function(){
			$scope.formData = {
				name_comercial        : obj.name_comercial,
				name_empresa          : obj.name_empresa,
				numero_identificacion : obj.numero_identificacion,
				responsable           : obj.responsable,
				idioma                : obj.idioma,
				
				address               : obj.address,
				town                  : obj.town,
				cp                    : obj.cp,
				country               : obj.country,
				
				prefixFix 			  : obj.prefixFix?obj.prefixFix:null,
				phoneFix  			  : obj.phoneFix?parseInt(obj.phoneFix):null,
				prefixMob 			  : obj.prefixMob?obj.prefixMob:null,
				phoneMob  			  : obj.phoneMob?parseInt(obj.phoneMob):null,
				web                   : obj.web,
				facebook              : obj.facebook,
				 
				empleados             : obj.empleados,
				antiguedad            : obj.antiguedad,
				servicios             : obj.servicios,
				paises                : obj.paises,
				email                 : obj.email,
				confirmEmail		  : "",
				password              : "",
				confirmPassword 	  : ""
			};
		});
		resetErrors();
	});

	function resetErrors(){
		$scope.formErrors = {
			name_comercial           : false,
			name_empresa             : false,
			numero_identificacion    : false,
			responsable              : false,
			idioma                   : false,
			
			address                  : false,
			town                     : false,
			cp                       : false,
			country                  : false,
			
			email                    : false,
			password                 : false,
			prefixFix                : false,
			phoneFix                 : false,
			prefixMob                : false,
			phoneMob                 : false,
			web                      : false,
			facebook                 : false,
			
			empleados                : false,
			antiguedad               : false,
			servicios                : false,
			paises                   : false,
			
			emailExist               : false,
			tos                      : false,
			confirmPasswordCoinciden : false,
			login_again				 : false
		};
	}

	$scope.send = function(){
		resetErrors();
		var changePassword = false;
		var error = false;

		if($scope.formData.name_empresa  === ""){ error = true; $scope.formErrors.name_empresa = true;}
		if($scope.formData.numero_identificacion       === ""){ error = true; $scope.formErrors.numero_identificacion = true;}
		if($scope.formData.idioma       === null){ error = true; $scope.formErrors.idioma = true;}
		if($scope.formData.address   === ""){ error = true; $scope.formErrors.address = true;}
		if($scope.formData.town      === ""){ error = true; $scope.formErrors.town = true;}
		if($scope.formData.cp        === ""){ error = true; $scope.formErrors.cp = true;}
		if($scope.formData.country   === ""){ error = true; $scope.formErrors.country = true;}
		// if($scope.formData.prefixFix === ""){ error = true; $scope.formErrors.phoneFix = true;}
		// if($scope.formData.phoneFix  === ""){ error = true; $scope.formErrors.phoneFix = true;}
		if($scope.formData.prefixMob === ""){ error = true; $scope.formErrors.phoneMob = true;}
		if($scope.formData.phoneMob  === ""){ error = true; $scope.formErrors.phoneMob = true;}
		if($scope.formData.paises  === ""){ error = true; $scope.formErrors.paises = true;}
				
		if($scope.formData.email && $scope.formData.email  !== ""){ 		}

		if($scope.formData.password && $scope.formData.password  !== ""){ 
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

				//obj.name_comercial      = $scope.formData.name_comercial     ;
				obj.name_empresa      = $scope.formData.name_empresa     ;
				obj.numero_identificacion      = $scope.formData.numero_identificacion     ;
				//obj.responsable  = $scope.formData.responsable ;
				obj.idioma       = $scope.formData.idioma      ;
				obj.address   = $scope.formData.address  ;
				obj.town      = $scope.formData.town     ;
				obj.cp        = $scope.formData.cp       ;
				obj.country   = $scope.formData.country  ;
				obj.prefixFix = $scope.formData.prefixFix;
				obj.phoneFix  = $scope.formData.phoneFix ;
				obj.prefixMob = $scope.formData.prefixMob;
				obj.phoneMob  = $scope.formData.phoneMob ;
				obj.paises  = $scope.formData.paises ;
				obj.web  = $scope.formData.web ;

				obj.$save().then(function(ref) {
					if(obj.idioma && obj.idioma !== window.localStorage['lang']){
						window.localStorage['lang'] = obj.idioma;
						$translate.use(obj.idioma);
						$ionicHistory.clearCache();
					}

					$rootScope.user.userData.interestedCountries = [];
	  				angular.forEach(obj.paises, function(p){
	  					$rootScope.user.userData.interestedCountries.push(p.iso2);
	  				});

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
						    $state.go('veryHorse.mundoEquino');
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