angular.module('app.myDemands', ['app.dataService','app.filters'])

.controller('myDemandsCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$translate', 'DataService', function ($scope, $rootScope, $stateParams, $firebaseArray, $translate, DataService) {
	$scope.title = $translate.instant('MI_DEMANDA');
    $scope.banner = DataService.getRandomBanner();
	$scope.changeList = function(list){
		$scope.activeList = list;		
	};

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.activeList = 'pending';
		$scope.pendings = [];
		$scope.confirmed = [];
		$scope.sent = [];
		var allDemands = [];
		var myToday = new Date();
		var today = +(new Date(myToday.getFullYear(), myToday.getMonth(), myToday.getDate(), 0, 0, 0));

		allDemands = $firebaseArray(firebase.database().ref("/demandas/").orderByChild("user").equalTo($rootScope.user.uid));
		allDemands.$loaded().then(function(list) {
		    angular.forEach(list,function(item){
                var proposals = $firebaseArray(firebase.database().ref("/proposals/"+item.$id+"/").orderByChild("desestimada").equalTo(false));
		    	if(item.status === "pending") {
		    		if((item.pickDayEnd && item.pickDayEnd > today) || item.pickDayIni > today){
		    			item.proposals = proposals;
		    			$scope.pendings.push(item);	
		    		}
		    	} else if(item.status === "confirmed") {
		    		if((item.deliverDayEnd && item.deliverDayEnd > today) || (item.deliverDayIni && item.deliverDayIni > today)){
		    			$scope.confirmed.push(item);
		    		}
		    		
		    	} 
                console.log(item);
		    });
		})
		.catch(function(error) {console.log("Error:", error);});
	});
    
    $scope.openBanner = function() {
        $scope.openInBrowser($scope.banner.link);
    };
    
    $scope.openInBrowser = function(url) {
        window.cordova.InAppBrowser.open(url, '_system');
    };
}]);