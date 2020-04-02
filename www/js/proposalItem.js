angular.module('app.proposalItem', ['app.dataService','app.filters', 'ngSanitize'])
.controller('proposalItemCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$firebaseObject', '$firebaseArray', '$filter', '$ionicHistory', '$ionicPopup', 'DataService', 'ionicDatePicker', '$translate', 'stripe', '$ionicLoading', '$sce', function ($scope, $rootScope, $http, $state, $stateParams, $firebaseObject, $firebaseArray, $filter, $ionicHistory, $ionicPopup, DataService, ionicDatePicker, $translate, stripe, $ionicLoading, $sce) {
	$scope.lang = $translate.use();
	$scope.ask_description = "";
	$scope.ratingsObject = {
	    iconOn: 'ion-ios-star',   
	    iconOff: 'ion-ios-star',  
	    iconOnColor: '#FFFFFF', 
	    iconOffColor:  '#605e00',
	    minRating:0,
	    rating: 0,
	    readOnly: true,
	    callback: function(rating, index) {}
	};
    $scope.banner = DataService.getRandomBanner();
    
    //$scope.stripePubKey = 'pk_live_CUtewGOibrc8BaMb6EyJEXkg';

	$scope.demand = $firebaseObject(firebase.database().ref("/demandas/"+$stateParams.demanda));

	$scope.proposal = $firebaseObject(firebase.database().ref("/proposals/"+$stateParams.demanda+"/"+$stateParams.proposal));
	$scope.proposal.$loaded(function(){
		$scope.transportista = $firebaseObject(firebase.database().ref("/users/"+$scope.proposal.transportista));
		$scope.transportista.$loaded(function(){
			if($scope.transportista.valoraciones){
				var grade = 0;
				angular.forEach($scope.transportista.valoraciones, function(val){
					grade += val.points;
				});
				$scope.ratingsObject.rating = parseInt(grade / $scope.transportista.valoraciones.length);
			}
		});
	});

	$scope.paySuccess = false;
	$scope.formData = {tos: false};
	$scope.formErrors = {tos: false};
	$scope.ask = {
		description:""
	}
	$scope.payForm = {
		cc: "",
		name: "",
		mes: "",
		year : "",
		ccv: ""
	};

	$scope.resetErrors = function(){
		$scope.formError = false;
		$scope.formErrors = {
			cc   : false,
			name : false,
			mes  : false,
			year : false,
			ccv  : false
		};
	};
    
    $scope.getBeforePaymentDesc = function() {
        return $translate.instant('BEFORE_PAYMENT');
    };

	$scope.reservar = function(){
		$scope.formErrors = {tos: false};
		if($scope.formData.tos){
			var myPopup = $ionicPopup.show({
			    templateUrl: 'templates/payform.html',
			    title: $translate.instant('INFORMACION'),
			    //title: 'Introduzca la información de su tarjeta',
			    scope: $scope,
			    buttons: [
			      { text: $translate.instant('CANCELAR') },
			      {
			        text: $translate.instant('ENVIAR2'),
			        type: 'button-vh',
			        onTap: function(e) {
			        	$scope.resetErrors();
			        	$scope.formError = false;

			        	if($scope.payForm.cc   === ""){ $scope.formError = true; $scope.formErrors.cc   = true; }
			        	if($scope.payForm.name === ""){ $scope.formError = true; $scope.formErrors.name = true; }
			        	if($scope.payForm.mes  === ""){ $scope.formError = true; $scope.formErrors.mes  = true; }
			        	if($scope.payForm.year === ""){ $scope.formError = true; $scope.formErrors.year = true; }
			        	if($scope.payForm.ccv  === ""){ $scope.formError = true; $scope.formErrors.ccv  = true; }

			          	if (!$scope.formError) {
				            return $scope.payForm;
			            
			         	} else {
			            	e.preventDefault();
			          	}
			        }
			      }
			    ]
			  });

			myPopup.then(function(res) {
				var amountPaid = parseFloat($filter('payAmount')($scope.proposal.amount));
				if(!$scope.formError){
                    // Setup the loader
                    $ionicLoading.show({
                      content: 'Loading',
                      animation: 'fade-in',
                      showBackdrop: true,
                      maxWidth: 200,
                      showDelay: 0
                    });
                    //stripe payment goes here
                    var cardDetails = {
                        number: $scope.payForm.cc,
                        cvc: $scope.payForm.ccv,
                        exp_month: $scope.payForm.mes,
                        exp_year: $scope.payForm.year,
                        name: $scope.payForm.name
                    };
                    
                    stripe.card.createToken(cardDetails).then(function (response) {
                        console.info('token created for card ending in ', response.card.last4);
                        
                        var payment = {
                            token: response.id,
                            price: amountPaid,
                        }
                        
                        console.log(payment);

                        return $http.post("https://newadmin.veryhorse.com/reservation-payment", payment).then(function(response) {
                            console.log(response);
                            $ionicLoading.hide();
                            if(response.data.status === "succeeded") {
                                console.log('successfully submitted payment for eurocents ', response.data.paidAmount);
                                paymentCompleted(response.data.paidAmount / 100);
                            } else {
                                $ionicLoading.hide();
                                if(response.data.code == "card_declined") {
                                    $ionicPopup.alert({
                                        title: $translate.instant('ERROR_T'),
                                        template: $translate.instant('TARJETA_R') + ' ' + response.data.message,
                                        okType: 'button-vh'
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Error',
                                        template: $translate.instant('ERROR_PAGO') + ' ' + response.data.message,
                                        okType: 'button-vh'
                                    });
                                }
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            console.warn("failed to call reservation-payment", error);
                            $ionicPopup.alert({
                                title: 'Error',
                                template: $translate.instant('ERROR_PAGO') + ' ' + error,
                                okType: 'button-vh'
                            });
                        });
                    }, function (error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Error',
                            template: $translate.instant('ERROR_PAGO'),
                            okType: 'button-vh'
                        });
                        console.warn("failed to generate token from Stripe", error);
                    });
                    
		            /*stripe.charges.create({
	                  	// amount is in cents so * 100
	                  	amount: amountPaid * 100,
	                  	currency: 'eur',
	                  	card: {
	                    	"number": $scope.payForm.cc,
	                        "exp_month": $scope.payForm.mes,
	                        "exp_year": $scope.payForm.year,
		                    "cvc": $scope.payForm.ccv,
	    	                "name": $scope.payForm.name
	        	        },
	                  	description: $translate.instant('PAGO_VERY')
	                },
	                function(response) {
	                	if(response.status === "succeeded"){
	                		console.log("OK: ", response);
	                		paymentCompleted(amountPaid);
	                	}else{
	                		if(response.error){
	                			if(response.error.code == "card_declined"){
	                				$ionicPopup.alert({
	                				     title: $translate.instant('ERROR_T'),
	                				     template: $translate.instant('TARJETA_R'),
	                				     okType: 'button-vh'
	                				   });
	                			}else{
	                				$ionicPopup.alert({
	                				     title: 'Error',
	                				     template: $translate.instant('ERROR_PAGO'),
	                				     okType: 'button-vh'
	                				   });
	                			}

	                		}else{
	                			$ionicPopup.alert({
	                			     title: 'Error',
	                			     template: $translate.instant('ERROR_PAGO'),
	                			     okType: 'button-vh'
	                			   });
	                		}
	                	}
	                },
	                function(response) {
	                  console.log("Error: ",response);
	                });*/
				} 
			});
		}else{
			$scope.formErrors = {tos: true};
		}
	};

	$scope.reservarPaypal = function(){
		$scope.formErrors = {tos: false};

		if($scope.formData.tos){
			var amountPaid = parseFloat($filter('payAmount')($scope.proposal.amount));
			var amountPaid = amountPaid%1 > 0 ? amountPaid.toString() : amountPaid+".00";

			var paymentDetails = new PayPalPaymentDetails(amountPaid, "0.00", "0.00");
			var payment = new PayPalPayment(amountPaid, "EUR", "Reserva Very Horse", "Sale", paymentDetails);

			PayPalMobile.renderSinglePaymentUI(payment
				, function(payment){
					paymentCompleted(amountPaid);
					console.log("payment success: " + JSON.stringify(payment, null, 4));

				},function(result){
					console.log(result);
					$ionicPopup.alert({
					    title: 'Error',
					    template: $translate.instant('ERROR_PAGO'),
					    okType: 'button-vh'
					});

				});
		}else{
			$scope.formErrors = {tos: true};
		}
	};

	function paymentCompleted(amountPaid){
		refreshBadge($firebaseArray, $rootScope);
		$scope.demand = $firebaseObject(firebase.database().ref("/demandas/"+$stateParams.demanda));
		$scope.demand.$loaded(function(){
			$scope.demand.status = "confirmed";
			$scope.demand.userTrans = $scope.proposal.transportista;
			$scope.demand.paymentDate = +(new Date());
			$scope.demand.amountPaid = amountPaid;
			$scope.demand.acceptedProposal = $stateParams.proposal;

			if($scope.proposal.altPicDay && $scope.proposal.altPicDay != ""){
				$scope.demand.pickMod = "day";
				$scope.demand.pickDayIni = $scope.proposal.altPicDay;
				$scope.demand.pickDayEnd = "";
			}

			if($scope.proposal.altDelDay && $scope.proposal.altDelDay != ""){
				$scope.demand.deliverMod = "day";
				$scope.demand.deliverDayIni = $scope.proposal.altDelDay;
				$scope.demand.deliverDayEnd = "";
			}

			$scope.demand.$save().then(function(){
				refreshBadge($firebaseArray, $rootScope);
				var alertPopup = $ionicPopup.alert({
				     //title: 'Pago realizado',
				     //template: '<p style="color: #000;">Su pago se ha realizado correctamente y su demanda de traslado está confirmada. En breve recibirá un e-mail con los datos del transportista asi como en sus demandas confirmadas para ponerse en contacto.</p><p style="color: #000;">Muchas gracias</p>',
				     //$translate.instant('PAGO_REALIZADO'),
				     title: $translate.instant('PAGO_REALIZADO'),
				     template: $translate.instant('TEXTO_PAGO_REALIZADO'),
				     okType: 'button-vh'
				   });
				$scope.paySuccess = true;
				
                $http.jsonp('http://admin.veryhorse.com/php/send.php', {
                    params   : {
                        data 	: JSON.stringify({demand: $stateParams.demanda, proposal: $stateParams.proposal, transportista: $scope.proposal.transportista, user: $rootScope.user.uid}),
						action 	: "send_offer_accepted"
                    }
                }); 
				$state.go("veryHorse.myDemandsItem",{id:$scope.demand.$id});
			});
			var nowDate = new Date();
			var nowSeconds = $scope.demand.deliverDayIni + (1000 * ((nowDate.getHours() * 3600) + (nowDate.getMinutes() * 60) + nowDate.getSeconds()));

			var pendingVals = $firebaseArray(firebase.database().ref("/pending_valoraciones/"+$scope.demand.user));
			pendingVals.$add({
				date: nowSeconds,
				trans: $scope.proposal.transportista,
				transName : $scope.transportista.name_empresa,
				demandName: $scope.demand.pickCity+" a "+$scope.demand.deliverCity
			}).then(function(ref) {
				console.log(ref);
			});
		});
	}

	PayPalMobile.init({
    	"PayPalEnvironmentProduction": "AVv3vM7y10lkYDGPryyHXvVYCkb_h0LuBl0hJsh7kBz0YNg2HUNpYpbMknhTpWRg2n4PvwW4W7oCFR6R",
    	"PayPalEnvironmentSandbox": "AfCJjbcIewqOC2_WJFLnD80pIAFoZnxvByTId9g8XOdfEjP4sVcl94g9DEZRr3Fzli_V3MdCevf-n6hJ"
    }, function(){
    	var config = new PayPalConfiguration({merchantName: "Very Horse", merchantPrivacyPolicyURL: "http://www.veryhorse.com/terminos-uso-app-transporte-equino/", merchantUserAgreementURL: "http://www.veryhorse.com/terminos-uso-app-transporte-equino/"});

    	PayPalMobile.prepareToRender("PayPalEnvironmentProduction", config, null);
  });

	$scope.desestimar = function(){
		var confirm = $ionicPopup.confirm({
			title:$translate.instant('DESESTIMAR_QUOTE'),
			template:$translate.instant('DESESTIMAR_CONFIRM'),
			buttons:[
		    	{ text: $translate.instant('CANCELAR') },
		    	{ text: $translate.instant('ANULAR'),
	    	      type: 'button-positive',
	    	      onTap: function(e) {
					$scope.proposal.desestimada = true;
					$scope.proposal.$save().then(function(){
						refreshBadge($firebaseArray, $rootScope);
						
						$http.jsonp('http://admin.veryhorse.com/php/send.php', {
							params   : {
								data 	: JSON.stringify({demand: $scope.demand.pickCity+" a "+$scope.demand.deliverCity, user: $scope.proposal.transportista}),
								action 	: "send_offer_dismissed"
							}
						}); 
						$ionicHistory.goBack();	
					});
	    	      }
	    	    }
		    ]
		})
		
	};

	$scope.showCondiciones = function(){
		$ionicPopup.alert({
		     //title: 'Condiciones generales de contratación',
		     title: $translate.instant('CONDICIONES_POPUP_TITLE'),
		     templateUrl: 'templates/condiciones_'+$translate.preferredLanguage()+'.html',
		     cssClass: 'tosPopup'
		   });
	};
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
	};
	
	$scope.send_email = function()
	{
		
		var users = $firebaseObject(firebase.database().ref("/users/"+$scope.proposal.transportista));
		users.$loaded(function(){
			$http({
				url:'https://api.sendgrid.com/v3/mail/send',
				method:"POST",
				headers:{
					'Authorization':"Bearer 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",
					"Content-Type":"application/json"
				},
				data:{
					"personalizations": [{"to": [{"email": "info@veryhorse.com"}]}],"from": {"email": $rootScope.user.userData.email},"subject": $translate.instant("ASK_CARRIER"),"content": [{"type": "text/html", "value": '<html><body><div><strong>User : ' + users.name + '</strong></div><div><strong>User Email : ' + users.email + '</strong></div><div><strong>Price : ' + parseFloat($filter('demandAmount')($scope.proposal.amount)) + '€ </strong> </div><div><strong>Vehicle : ' + $scope.proposal.vehicle + '</strong></div><div><p>' + $scope.ask.description +'</p></div></body></html>'}]}
			}).then(function(res){
				$state.go("veryHorse.AskPending");
			}).catch(function(err){
				alert(err.getMessage());
			})
		})
		
	}
}]);
