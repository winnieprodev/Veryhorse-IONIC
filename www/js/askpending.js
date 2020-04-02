angular.module("app.askpending",['app.dataService','app.filters', 'ngSanitize']).controller('AskPedingItemCtrl',['$scope','$state',function($scope,$state){
    $scope.selectpending = function(){
        $state.go("veryHorse.myDemands");
    }
}])