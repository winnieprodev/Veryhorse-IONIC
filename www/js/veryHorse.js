angular.module('app.veryHorse', ['app.dataService','app.filters'])

.controller('veryHorseCtrl', ['$scope', '$rootScope', '$window', '$state', '$timeout', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$ionicSideMenuDelegate', 'DataService', '$translate', '$ionicHistory', function ($scope, $rootScope, $window, $state, $timeout, $firebaseAuth, $firebaseObject, $firebaseArray, $ionicSideMenuDelegate, DataService, $translate, $ionicHistory) {
	$scope.rs = $rootScope;
	$scope.rs.proposalsReceived = [];
	$scope.renderView = false;

	$firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
	  if (firebaseUser) {
	  	$rootScope.user = firebaseUser;
	  	var ref = firebase.database().ref("/users/" + firebaseUser.uid);
	  	var obj = $firebaseObject(ref);
	  	$rootScope.openFirebaseConnections.push(obj);

	  	obj.$bindTo($rootScope, "user.userData").then(function(){		//Three way data binding to rootScope
	  		$rootScope.userLoaded = true;
	  		//console.log("loaded record:", $rootScope.user.userData);

	  		if(obj.idioma && obj.idioma !== window.localStorage['lang']){
	  			window.localStorage['lang'] = obj.idioma;
	  			$translate.use(obj.idioma);
	  			$ionicHistory.clearCache();
	  		}

	  		if($rootScope.user.userData.type === "user"){			//Redirect users to new demand
  				$state.go('veryHorse.mundoEquino');
  				refreshBadge($firebaseArray, $rootScope);

  			}else if($rootScope.user.userData.type === "transportista"){
  				refreshBadge($firebaseArray, $rootScope, DataService);
  				$rootScope.user.userData.interestedCountries = [];
                //if transporter has no interested countries selected, add Europe by default
                if(!$rootScope.user.userData.paises) {
                    $rootScope.user.userData.paises = [];
                    $rootScope.user.userData.paises.push({iso2: "CT-EU", iso3: "EUR", name: "Europe", nombre: "Europa"});
                }
  				angular.forEach($rootScope.user.userData.paises, function(p){
  					$rootScope.user.userData.interestedCountries.push(p.iso2);
  				});
  				//$state.go('veryHorse.queHacerUserTrans');
  				$state.go('veryHorse.mundoEquino');
  			}
  			$scope.renderView = true;
	  	});

	   // console.log("Signed in as:", firebaseUser.uid);

	  } else {
	  	$rootScope.userLoaded = true;
	  	if(angular.isUndefined($window.localStorage.presentacion) || $window.localStorage.presentacion === false){
	  		$state.go('veryHorse.presentacion');
	  	}else{
	  		$state.go('veryHorse.mundoEquino');
	  	}
	  	$scope.renderView = true;
	  }
	});

	$scope.logout = function(){
		angular.forEach($rootScope.openFirebaseConnections, function(con){
			con.$destroy();
		});
		$rootScope.user = null;
		$firebaseAuth().$signOut();
        //window.localStorage['lang'] = null;
		$state.go('veryHorse.mundoEquino');
		//$state.go('veryHorse.selectLanguage');
		$timeout(function(){
			$ionicSideMenuDelegate.toggleRight(false);
		},400);
	};
    
	$rootScope.refreshBadge = function(){
		refreshBadge($firebaseArray, $rootScope, DataService);
	};
}]);
