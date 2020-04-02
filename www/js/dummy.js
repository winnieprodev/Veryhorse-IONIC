angular.module('app.dummy', ['app.dataService','app.filters'])

.controller('dummyCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {

  $scope.lang = window.localStorage['lang'] ? window.localStorage['lang'] : 'es';

	$scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.selected = {
      propietarioSelected: false,
      transportistaSelected: false
    };
  });

  $scope.status0 = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

  $scope.status3 = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

  $scope.status4 = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

  function resetStatusVars(){
    $scope.status = {
      section1: false,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
      section6: false,
      section7: false,
      section8: false,
      section9: false,
      section10: false,
      section11: false,
      section12: false,
      section13: false,
      section14: false,
      section15: false
    };
  }
  resetStatusVars();


  $scope.toggleSection = function(section){
    if($scope.status[section]){
      $scope.status[section] = false;
    }else{
      resetStatusVars();
      $scope.status[section] = true;
    }
  }

}]);