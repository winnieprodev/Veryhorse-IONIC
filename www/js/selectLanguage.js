angular.module('app.selectLanguage', [])

.controller('selectLanguageCtrl', ['$scope', '$state', '$translate', '$ionicHistory', function ($scope, $state, $translate, $ionicHistory) {
	$scope.languageSelected = false;
	$scope.lang = null;

	$scope.selectLang = function(lang){
		$scope.languageSelected = true;
		$scope.lang = lang;
		window.localStorage['lang'] = lang;
		$translate.use(lang);
		$ionicHistory.clearCache();
		$state.go("veryHorse.mundoEquino");
	};
}]);