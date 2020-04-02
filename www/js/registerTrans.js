angular.module('app.registerTrans', ['app.dataService','app.filters'])

.controller('registerTransCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q', '$filter', '$timeout', '$http', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$ionicPopup', '$ionicScrollDelegate', 'DataService',  '$translate', function ($scope, $rootScope, $state, $stateParams, $q, $filter, $timeout, $http, $firebaseAuth, $firebaseObject, $firebaseArray, $ionicPopup, $ionicScrollDelegate, DataService, $translate) {
		$scope.countries = DataService.getCountries();
		$scope.idiomas = DataService.getLanguages();
		$scope.formData = {};
		$scope.formErrors = {};
		$scope.registerStep = 0;

		$scope.goStepBack = function() {
		    if($scope.registerStep > 0){
		    	$scope.registerStep--;
		    }
		};

		$scope.loadCountries = function(query){
			var deferred = $q.defer();
		    deferred.resolve( $filter('filterCountries')($scope.countries, query));
		    return deferred.promise;
		};

		$scope.$on("$ionicView.beforeEnter", function(event, data){
			$scope.isDisabled = false;
			$scope.registerStep = 0;
			$scope.formData = {
				name_comercial        : "",
				name_empresa          : "",
				numero_identificacion : "",
				responsable           : "",
				idioma                : window.localStorage['lang'] || null,
				
				address               : "",
				town                  : "",
				cp                    : "",
				country               : "",
				
				prefixFix             : "",
				phoneFix              : "",
				prefixMob             : "",
				phoneMob              : "",
				web                   : "",
				facebook              : "",
				 
				empleados             : "",
				antiguedad            : "",
				servicios             : "",
				paises                : [],
				email                 : "",
				confirmEmail		  : "",
				password  			  : "",
				confirmPassword 	  : "" ,
				tos 				  : false
			};

			$scope.addressAuto = {
				city: ""
			};
		});
		123456
		function resetErrors(){
			$scope.formErrors = {
				name_comercial        : false,
				name_empresa          : false,
				numero_identificacion : false,
				responsable           : false,
				idioma                : false,

				address               : false,
				town                  : false,
				cp                    : false,
				country               : false,

				email                 : false,
				password              : false,
				prefixFix             : false,
				phoneFix              : false,
				prefixMob             : false,
				phoneMob              : false,
				web                   : false,
				facebook              : false,

				empleados             : false,
				antiguedad            : false,
				servicios             : false,
				paises                : false,
				
				emailExist 			  : false,
				tos 				  : false 
			};
		}

		$scope.goToStep = function(step){
			resetErrors();
			var error = false;

			if(step == 1){
				//if($scope.formData.name_comercial === ""){ error = true; $scope.formErrors.name_comercial = true;}
				if($scope.formData.name_empresa === ""){ error = true; $scope.formErrors.name_empresa = true;}
				if($scope.formData.numero_identificacion === ""){ error = true; $scope.formErrors.numero_identificacion = true;}
				//if($scope.formData.responsable === ""){ error = true; $scope.formErrors.responsable = true;}
				if($scope.formData.idioma === null){ error = true; $scope.formErrors.idioma = true;}

			}else if(step == 2){
				if($scope.formData.address === ""){ error = true; $scope.formErrors.address = true;}
				if($scope.addressAuto.city && $scope.addressAuto.city !== ""){ 
					$scope.formData.town = $scope.addressAuto.city;
				} else{
					error = true; $scope.formErrors.town = true;
				}
				if($scope.formData.cp === ""){ error = true; $scope.formErrors.cp = true;}
				if($scope.formData.country === ""){ error = true; $scope.formErrors.country = true;}

			}else if(step == 3){
				// if($scope.formData.prefixFix === ""){ error = true; $scope.formErrors.phoneFix = true;}
				// if($scope.formData.phoneFix === null) { error = true; $scope.formErrors.phoneFix = true;}
				if($scope.formData.prefixMob === ""){ error = true; $scope.formErrors.phoneMob = true;}
				if($scope.formData.phoneMob === null) { error = true; $scope.formErrors.phoneMob = true;}

				if(!error){
					users = $firebaseArray(firebase.database().ref("/users/").orderByChild("phoneMob").startAt($scope.formData.phoneMob).endAt($scope.formData.phoneMob));
					users.$loaded().then(function(list) {
						if(list.length > 0){
							error = true; $scope.formErrors.phoneMobExists = true;
						}else{
							$scope.registerStep = step;
						}
					});
				}

			}else if(step == 4){
				//if($scope.formData.empleados === ""){ error = true; $scope.formErrors.empleados = true;}
				//if($scope.formData.antiguedad === ""){ error = true; $scope.formErrors.antiguedad = true;}
				//if($scope.formData.servicios === ""){ error = true; $scope.formErrors.servicios = true;}
				if($scope.formData.paises.length === 0){ error = true; $scope.formErrors.paises = true;}

				if($scope.formData.email === ""){ error = true; $scope.formErrors.email = true;}
				
				if($scope.formData.email !== $scope.formData.confirmEmail){
					error = true; $scope.formErrors.confirmEmailCoinciden = true;
				}



				if($scope.formData.password === ""){ error = true; $scope.formErrors.password = true;}

				if($scope.formData.password !== $scope.formData.confirmPassword){
					error = true; $scope.formErrors.confirmPasswordCoinciden = true;
				}


				if(!$scope.formData.tos){error = true; $scope.formErrors.tos = true;}
			}


			if(!error && step != 3){
				if(step < 4){
					$timeout(function(){
						$scope.registerStep = step;
					},100);
				}else{
			  		if(!$scope.isDisabled){
						$scope.isDisabled = true;
						$rootScope.creatingUser = true;
						
						$firebaseAuth().$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function(firebaseUser) {
							var obj = $firebaseObject(firebase.database().ref("/users/" + firebaseUser.uid));
							$rootScope.openFirebaseConnections.push(obj);
		
						  	delete($scope.formData.password);
						  	$scope.formData.type = "transportista";
						  	$scope.formData.createdAt = +(new Date());
						  	$scope.formData.aprobado = false;

						  	for(var p in $scope.formData){
						  		obj[p] = $scope.formData[p];
						  	}

		  					obj.interestedCountries = [];
		  					$scope.formData.interestedCountries = [];
		  	  				angular.forEach($scope.formData.paises, function(p){
		  	  					obj.interestedCountries.push(p.iso2);
		  	  					$scope.formData.interestedCountries.push(p.iso2);
		  	  				});
						  	
						  	obj.$save().then(function(ref) {
						  		$rootScope.user.userData = $scope.formData;
								 
								//Mailchimp suscribe list
								var mailchimpData = {
									name: $scope.formData.name_empresa,
									lastname: '',
									country: $scope.countries[$scope.formData.country].nombre,
									email: $scope.formData.email,
									type: 'transportista'
								}
								$http.jsonp('http://admin.veryhorse.com/php/mailchimp/sendSuscription.php', {
			                        params   : {
			                            data 	: JSON.stringify({data: mailchimpData}),
			                           	action 	: "send_suscription"
			                        }
			                    });

						  	  	$state.go("veryHorse.mundoEquino");		
						  	  	$rootScope.creatingUser = false;
                    
			                    $http.jsonp('http://admin.veryhorse.com/php/send.php', {
			                        params   : {
			                            //data     : JSON.stringify({data: $scope.formData}),
			                            data 	: JSON.stringify({data: $scope.formData}),
			                           	action 	: "send_new_transportista"
			                        }

			                    });

						  	}, function(error) {
						  	  	console.log("Error:", error);
						  	});

						}).catch(function(error) {
							if(error.code === "auth/email-already-in-use"){
								$scope.formErrors.registerError = true;
								$scope.registerErrorMessage = "Ya existe un usuario con el email indicado";
							}else if(error.code === "auth/weak-password"){
								$scope.formErrors.registerError = true;
								$scope.registerErrorMessage = "La contraseña debe tener un mínimo de 6 caracteres";
							}
							$scope.isDisabled = false;
						    console.error("Error: ", error);
						});
					}
				}
				$ionicScrollDelegate.scrollTop();
			}
		};

		$scope.showCondiciones = function(){
		$ionicPopup.alert({
		     //title: 'Condiciones generales de contratación',
		     title: $translate.instant('CONDICIONES_POPUP_TITLE'),
		     templateUrl: 'templates/condiciones_'+$translate.preferredLanguage()+'.html',
		     cssClass: 'tosPopup'
		   });
	};

		$scope.disableTap = function(){
		    container = document.getElementsByClassName('pac-container');
		    // disable ionic data tab
		    angular.element(container).attr('data-tap-disabled', 'true');
		    // leave input field if google-address-entry is selected
		    angular.element(container).on("click", function(){
		        document.getElementById('townInput').blur();
		    });
		};

}])
;