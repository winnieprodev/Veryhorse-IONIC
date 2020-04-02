angular.module('app.registerUser', ['app.dataService','app.filters'])

.controller('registerUserCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$ionicScrollDelegate', 'DataService', '$translate', '$http', function ($scope, $rootScope, $state, $stateParams, $timeout, $firebaseAuth, $firebaseObject, $firebaseArray, $ionicScrollDelegate, DataService, $translate, $http) {
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

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.registerStep = 0;
		$scope.isDisabled = false;
		$scope.formData = {
				name      		: "",
				lastname  		: "",
				age       		: "",
				idioma			: window.localStorage['lang'] || 'es',
				 
				address   		: "",
				town      		: "",
				cp        		: "",
				country   		: "0",
				 
				prefixFix 		: "",
				phoneFix  		: "",
				prefixMob 		: "",
				phoneMob  		: "",
				 
				email     		: "",
				confirmEmail	: "",
				password  		: "",
				confirmPassword : "",
				tos 			: false

			};
		$scope.addressAuto = {
			city: ""
		};
	});
	
	function resetErrors(){
		$scope.formErrors = {
			name           : false,
			lastname       : false,
			age            : false,
			idioma 		   : false,
			
			address        : false,
			town           : false,
			cp             : false,
			country        : false,
			
			phoneFix       : false,
			phoneMob       : false,
			
			phoneFixExists : false,
			phoneMobExists : false,
			
			email          : false,
			password       : false,
			
			emailExist     : false
		};
	}

	$scope.goToStep = function(step){
		resetErrors();
		var error = false;

		if(step == 1){
			if($scope.formData.name === ""){ error = true; $scope.formErrors.name = true;}
			if($scope.formData.lastname === ""){ error = true; $scope.formErrors.lastname = true;}
			//if($scope.formData.age === ""){ error = true; $scope.formErrors.age = true;}
			if($scope.formData.idioma === null || $scope.formData.idioma === ""){ error = true; $scope.formErrors.idioma = true;}

		}else if(step == 2){
			if($scope.formData.address === ""){ error = true; $scope.formErrors.address = true;}
			if($scope.addressAuto.city && $scope.addressAuto.city !== ""){ 
				$scope.formData.town = $scope.addressAuto.city;
			} else{
				error = true; $scope.formErrors.town = true;
			}
			if($scope.formData.cp === null){ error = true; $scope.formErrors.cp = true;}
			if($scope.formData.country == "0"){ error = true; $scope.formErrors.country = true;}

		}else if(step == 3){
			// if($scope.formData.prefixFix === "")  { error = true; $scope.formErrors.phoneFix = true;}
			// if($scope.formData.phoneFix === null) { error = true; $scope.formErrors.phoneFix = true;}
			if($scope.formData.prefixMob === "")  { error = true; $scope.formErrors.phoneMob = true;}
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
			if($scope.formData.email === ""){ error = true; $scope.formErrors.email = true;}
			if($scope.formData.confirmEmail === ""){ error = true; $scope.formErrors.confirmEmail = true;}

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

						console.log("user created");
					  	delete($scope.formData.password);
					  	$scope.formData.type = "user";
					  	$scope.formData.createdAt = +(new Date());
					  	$scope.formData.aprobado = true;
					  	
					  	for(var p in $scope.formData){
					  		obj[p] = $scope.formData[p];
					  	}

					  	obj.$save().then(function(ref) {
							console.log("user saved");
					  		$rootScope.user.userData = $scope.formData;
					  	  	// $state.go('veryHorse.queHacerUser');

							//Mailchimp suscribe list
							var mailchimpData = {
								name: $scope.formData.name,
								lastname: $scope.formData.lastname,
								country: $scope.formData.country,
								email: $scope.formData.email,
								type: ''
							}
							$http.jsonp('http://admin.veryhorse.com/php/mailchimp/sendSuscription.php', {
								params   : {
									data 	: JSON.stringify({data: mailchimpData}),
									action 	: "send_suscription"
								}
							});

					  	  	$state.go("veryHorse.mundoEquino");		
					  	  	$rootScope.creatingUser = false;

					  	}, function(error) {
					  	  	console.log("Error:", error);
					  	});

					}).catch(function(error) {
						if(error.code === "auth/email-already-in-use"){
							$scope.formErrors.registerError = true;
							$scope.registerErrorMessage = "Ya existe un usuario con el email indicado";
						}else if(error.code === "auth/weak-password"){
							$scope.formErrors.registerError = true;
							//$scope.registerErrorMessage = "La contraseña debe tener un mínimo de 6 caracteres";
							$scope.registerErrorMessage = $translate.instant('CONTRASENA_6_CARACTERES_MINIMO');
							
						}
						$scope.isDisabled = false;
					    console.error("Error: ", error);
					});
				}
			}
			$ionicScrollDelegate.scrollTop();
		}
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

}]);