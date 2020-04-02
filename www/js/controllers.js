angular.module('app.controllers', ['app.dataService','app.filters'])

function refreshBadge($firebaseArray, $rootScope, DataService){
	if($rootScope.user){
		var myToday = new Date();
		var today = +(new Date(myToday.getFullYear(), myToday.getMonth(), myToday.getDate(), 0, 0, 0));
		
		if($rootScope.user.userData.type === "transportista"){
			$rootScope.menuDemandsCount = 0;
			$rootScope.pendingValoracionesCount = 0;

			allDemands = $firebaseArray(firebase.database().ref("/demandas/").orderByChild("pickDayIni").startAt(today));
			allDemands.$loaded().then(function(list) {
			    angular.forEach(list,function(item){
			    	if(item.status === "pending" && isItemInteresting(item, $rootScope, DataService) && ((item.pickDayEnd && item.pickDayEnd > today) || item.pickDayIni > today)){
			    		$rootScope.menuDemandsCount++;
			    	}
			    });

			    allDemands = $firebaseArray(firebase.database().ref("/demandas/").orderByChild("pickDayEnd").startAt(today));
			    allDemands.$loaded().then(function(list) {
			        angular.forEach(list,function(item){
			        	if(item.pickDayIni < today){
			        		if(item.status === "pending" && isItemInteresting(item, $rootScope, DataService)){
					    		$rootScope.menuDemandsCount++;
					    	}
			        	}
			        });

			        
			    });
			});

		}else if($rootScope.user.userData.type === "user"){
			$rootScope.menuProposalsCount = 0;
			var allDemands = $firebaseArray(firebase.database().ref("/demandas/").orderByChild("user").equalTo($rootScope.user.uid));
			allDemands.$loaded().then(function(list) {
			    angular.forEach(list,function(item){
			    	if(item.status === "pending" && item.pickDayIni > today){
			    		item.proposals = $firebaseArray(firebase.database().ref("/proposals/"+item.$id+"/").orderByChild("desestimada").equalTo(false));
			    		item.proposals.$watch(function() { 
			    			$rootScope.proposalsReceived[item.$id] = item.proposals.length;

			    			$rootScope.menuProposalsCount++;
			    		});	
			    	}
			    });
			});

			var valoraciones = $firebaseArray(firebase.database().ref("/pending_valoraciones/"+$rootScope.user.uid).orderByChild("date").endAt(today));
			valoraciones.$loaded().then(function(list) {
				$rootScope.pendingValoracionesCount = list.length;
			});
		}
	}
}

function isItemInteresting(item, $rootScope, DataService){
	if(!item.desestimadas || item.desestimadas.indexOf($rootScope.user.uid) < 0) {
        if(!$rootScope.user.userData.interestedCountries) {
            $rootScope.user.userData.interestedCountries = [];
        }
		if($rootScope.user.userData.interestedCountries.indexOf(item.pickCountry) >= 0 || $rootScope.user.userData.interestedCountries.indexOf(item.deliverCountry) >= 0) {
			return true;
		} else {
			var continentPick = DataService.getContinentFromISO(item.pickCountry);
			var continentDel = DataService.getContinentFromISO(item.deliverCountry);

			if($rootScope.user.userData.interestedCountries.indexOf(continentPick) >= 0 || $rootScope.user.userData.interestedCountries.indexOf(continentDel) >= 0) {
				return true;
			}
		}
	}
	return false;
}

