angular.module('app.myDemandsItem', ['app.dataService','app.filters'])

.controller('myDemandsItemCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$firebaseObject', '$firebaseArray', '$filter', '$ionicPopup', 'DataService', 'ionicDatePicker', '$translate', 'NgMap', '$timeout', function ($scope, $rootScope, $state, $stateParams, $http, $firebaseObject, $firebaseArray, $filter, $ionicPopup, DataService, ionicDatePicker, $translate, NgMap, $timeout) {
	$scope.horsesSex = DataService.getHorsesSex();
	$scope.horsesSize = DataService.getHorsesSize();
  	$scope.demand = $firebaseObject(firebase.database().ref("/demandas/"+$stateParams.id));
  	$scope.acceptedProposal = null;
	$scope.acceptedTransportista = null;
	$scope.acceptedUser = null;
	$scope.usersData = $firebaseArray(firebase.database().ref("/users/").orderByChild("type").equalTo("transportista"));
	
	$scope.proposal = {
		amount        : null,
		altPicDay     : null,
		altDelDay     : null,
		transportista : $rootScope.user.uid,
		desestimada	  : false,
        triptype: "one_way_trip"
	};
    $scope.banner = DataService.getRandomBanner();

	var dayConfigs = {
		pickDayIniObj : { callback: function (val) {
			$scope.proposal.altPicDay = val;
			$scope.showAltPicDay = new Date(val);

			var firstAvailableDate = new Date(val);
			firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);
			dayConfigs.pickDayEndObj.from = firstAvailableDate;
			dayConfigs.pickDayEndObj.inputDate = firstAvailableDate;
		} },
		pickDayEndObj : { callback: function (val) {
			$scope.proposal.altDelDay = val;
			$scope.showAltDelDay = new Date(val);
		} }
	};

	$scope.openDatePicker = function(type){
      ionicDatePicker.openDatePicker(dayConfigs[type]);
    };

	$scope.proposalSent = false;
	$scope.proposalAmountError = false;
	var sending = false;

	$scope.sendProposal = function(){
		$scope.proposalAmountError = false;

		if(isNaN($scope.proposal.amount)){
			$scope.proposalAmountError = true;
			return;
		}
		
		if($scope.proposal.vehicle === undefined || isNaN($scope.proposal.vehicle)) {
			$scope.proposalVehicleError = true;
			return;
		}

		if(!sending && $scope.proposal.amount !== null){
			sending = true;
			
			$scope.proposals.$add($scope.proposal).then(function(ref) {
			  	$scope.proposalSent = true;

	            $http.jsonp('http://admin.veryhorse.com/php/send.php', {
	                params   : {
	                    data 	: JSON.stringify({user: $scope.demand.user, demand: $stateParams.id, proposal: $scope.proposal, amount: parseFloat($filter('demandAmount')($scope.proposal.amount))}),
			  			action 	: "send_new_offer"
	                }
				});
			});
		}
	};



	$scope.mensaje = $translate.instant('ENVIAR_COTIZACION');

	$scope.cambiarMensaje=function() {
		$scope.mensaje = $translate.instant('ENVIANDO_COTIZACION');
	};

	$scope.desestimar = function(){
        var confirmPopup = $ionicPopup.confirm({
			title:$translate.instant('DESESTIMAR'),
		    template: $translate.instant('ARE_YOU_SURE'),
		    buttons: [
		    	{ 
                    text: $translate.instant('SI'),
                    type: 'button-positive',
                    onTap: function(e) {
                        $scope.rejectDemand();
                    }
	    	    },
                { text: $translate.instant('NO') }
		    ]
		});
	};

    $scope.deletequote = function()
	{
		var confirmPopup = $ionicPopup.confirm({
			title:$scope.proposal.$id,
		    template: $translate.instant('ARE_YOU_SURE'),
		    buttons: [
		    	{ 
                    text: $translate.instant('SI'),
                    type: 'button-positive',
                    onTap: function(e) {
                        $scope.deleteproposal();
                    }
	    	    },
                { text: $translate.instant('NO') }
		    ]
		});
	}

	$scope.deleteproposal = function()
	{
		firebase.database().ref("proposals/" + $scope.demand.$id).remove(function(){
			$state.go("veryHorse.listDemands");
		})

		refreshBadge($firebaseArray,$rootScope,DataService);
	}
	
    $scope.rejectDemand = function() {
        if(!$scope.demand.desestimadas){
			$scope.demand.desestimadas = [];
		}
		$scope.demand.desestimadas.push($rootScope.user.uid);
		$scope.demand.$save().then(function(){
			$state.go("veryHorse.listDemands");
		});
		refreshBadge($firebaseArray, $rootScope, DataService);
    };

	$scope.$on("$ionicView.afterEnter", function(event, data){
		$scope.mensaje = $translate.instant('ENVIAR_COTIZACION');
		$scope.demand.$loaded(function(){
			$scope.demandTitle = $translate.instant('DEMANDA_DE_TRASLADO')+" "+($scope.demand.status == "confirmed"?$translate.instant('CONFIRMADA'):'');

			if($scope.demand.status === "confirmed"){
				$scope.acceptedProposal = $firebaseObject(firebase.database().ref("/proposals/"+$scope.demand.$id+"/"+$scope.demand.acceptedProposal));

				if($scope.isTrans()){
					$scope.acceptedUser = $firebaseObject(firebase.database().ref("/users/"+$scope.demand.user));
				}else{
					$scope.acceptedTransportista = $firebaseObject(firebase.database().ref("/users/"+$scope.demand.userTrans));
				}
			}else{
				$scope.proposals = $firebaseArray(firebase.database().ref("/proposals/"+$scope.demand.$id));
			}
		});

		$scope.validProposals = 0;
		$scope.proposalSent = false;
		$scope.decideShow = false;
		$scope.myProposal = false;
		$scope.proposalsReceived = $firebaseArray(firebase.database().ref("/proposals/"+$scope.demand.$id));
		$scope.proposalsReceived.$loaded(function(list){
			var ratingsObject = {
		        iconOn: 'ion-ios-star',
		        iconOff: 'ion-ios-star',
		        iconOnColor: '#FFFFFF',
		        iconOffColor:  '#605e00',
		        minRating:0,
		        readOnly: true,
		        callback: function(rating, index) {}
		    };

			angular.forEach(list, function(prop){
				if(prop.transportista === $rootScope.user.uid){
					$scope.myProposal = true;
				}
				if(!prop.desestimada){
					$scope.validProposals++;
				}
				angular.forEach($scope.usersData, function(u){
					if(prop.transportista === u.$id){
						prop.user = u;
						prop.user.ratingsObject = angular.copy(ratingsObject);
						prop.user.ratingsObject.rating = 0;

						if(prop.user.valoraciones){
							var grade = 0;
							angular.forEach(prop.user.valoraciones, function(val){
								grade += val.points;
							});
							prop.user.ratingsObject.rating = parseInt(grade / prop.user.valoraciones.length);
						}
					}
				});
			});
			$scope.decideShow = true;
		});
	});

	$scope.isTrans = function(){
		return $rootScope.user && $rootScope.user.userData.type === "transportista";
	};

	$scope.deleteDemand = function(){
		var confirmPopup = $ionicPopup.confirm({
			title:$translate.instant('ANULAR_DEMANDA'),
		    //title: 'Anular demanda',
		    template: $translate.instant('SEGURIDAD2'),
		    //template: '¿Seguro que desea anular la demanda?',
		    buttons: [
		    	{ text: $translate.instant('CANCELAR') },
		    	{ text: $translate.instant('ANULAR'),
	    	      type: 'button-positive',
	    	      onTap: function(e) {
					$scope.demand.status = 'canceled';

	    	      	$scope.demand.$save().then(function(ref) {
          		    	$state.go('veryHorse.myDemands');
          		    });
	    	      }
	    	    }
		    ]
		});
	};
	
	$scope.showMap = false;
	var map;
	var scope = $scope;
	$timeout(function(){
		NgMap.getMap().then(function(evtMap) {
		    map = evtMap;
		    // console.log(map);
		    $timeout(function(){
		    	scope.showMap = true;
				// console.log('markers', map.markers);
		    },0);
		});	
    },0);
	

	$scope.shouldRenderAltPath = function(){
		if(!map || !map.directionsRenderers || !map.directionsRenderers[0].directions){
			return true;
		}else{
			return false;
		}
	}

	$scope.getMarkersPath = function(){
		var path = [];

		if(map && map.markers){
			path.push([map.markers[0].position.lat(), map.markers[0].position.lng()]);
			path.push([map.markers[1].position.lat(), map.markers[1].position.lng()]);
		}
		
		return path;
	}

	
	var rad = function(x) {
	  return x * Math.PI / 180;
	};

	$scope.getDistance = function() {
		if(!map || !map.markers){
			return ''
		}
		var p1 = map.markers[0].position;
		var p2 = map.markers[1].position;

		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(p2.lat() - p1.lat());
		var dLong = rad(p2.lng() - p1.lng());
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
	    Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;

		return parseInt(d/1000); // returns the distance in meter
	};

	$scope.getMapZoom = function(){
		if(!map || !map.markers){
			return '4'
		}else{
			return '1';
		}
	}

	$scope.getMapCenter = function(){
		if(!map || !map.markers){
			return '40.416775,-3.703790';
		}else{
			return '25,1.5';
		}
	}
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);
