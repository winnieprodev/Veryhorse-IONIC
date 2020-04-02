angular.module('app.demands', ['app.dataService','app.filters', 'ng-countryflags'])

.controller('demandsCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', 'DataService', '$translate', function ($scope, $rootScope, $stateParams, $firebaseArray, DataService, $translate) {
	$scope.title = $translate.instant('TRASLADO');
	$scope.section = "transportistaDemands";
    $scope.banner = DataService.getRandomBanner();
	$scope.changeList = function(list){
		$scope.activeList = list;
        window.sessionStorage.setItem('activeDemandTab', list);
	};

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.activeList = window.sessionStorage.getItem('activeDemandTab') || 'pending';
		$scope.pendings = [];
		$scope.confirmed = [];
		$scope.sent = [];
		var allDemands = [];
		var myToday = new Date();
		var today = +(new Date(myToday.getFullYear(), myToday.getMonth(), myToday.getDate(), 0, 0, 0));
        var transporterId = $rootScope.user.uid;
        console.log("user id = " + transporterId);
		allDemands = $firebaseArray(firebase.database().ref("/demandas/").orderByChild("pickDayEnd").startAt(today));
		allDemands.$loaded().then(function(list) {
            console.log(list);
		    angular.forEach(list, function(item){
		    	parseDemand(item);
            });

		})
		.catch(function(error) {console.log("Error:", error);});

		function parseDemand(item){
            //вот тут проверяется на reject
	    	if(!item.desestimadas || item.desestimadas.indexOf($rootScope.user.uid) < 0){
	    		if(item.status === "confirmed" && item.userTrans === $rootScope.user.uid){
    				if((item.deliverDayEnd && item.deliverDayEnd >= today) || (item.deliverDayIni && item.deliverDayIni >= today)){
    					$scope.confirmed.push(item);
    				}
    			} else if(item.status === "pending" && isItemInteresting(item, $rootScope, DataService)){
    				var proposals = $firebaseArray(firebase.database().ref("/proposals/"+item.$id+"/").orderByChild("desestimada").equalTo(false));
                    proposals.$loaded().then(function(list) {
                        var added = false;
                        angular.forEach(list,function(proposal, key){
                            if(proposal.transportista === transporterId) {
                                var itemCopy = iterationCopy(item);
                                itemCopy.amount = proposal.amount;
                                if(proposal.triptype) {
                                    itemCopy.tripTitle = proposal.triptype === 'one_way_trip' ?  $translate.instant('TRIP_ONE_WAY') : $translate.instant('TRIP_ROUND');
                                    itemCopy.tripTitle = '(' + itemCopy.tripTitle + ')';
                                } else {
                                    itemCopy.tripTitle = '';
                                }
                                //console.log(itemCopy);
                                $scope.sent.push(itemCopy);
                                added = true;
                            } else {
                                added = false;
                            }
                        });
                        if(!added) {
                            $scope.pendings.push(item);
                        }
                    });
    			}
	    	}
		}
        
        function iterationCopy(src) {
            let target = {};
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    target[prop] = src[prop];
                }
            }
            return target;
        }
	});
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);
