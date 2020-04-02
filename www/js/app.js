// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'firebase', 'ionic-datepicker','ngTagsInput', 'ngSanitize', 'ionic-ratings','credit-cards','vsGoogleAutocomplete', 'pascalprecht.translate', 'ui.bootstrap', 'app.mundoEquino', 'app.mundoEquinoItem', 'app.contacto', 'app.dummy', 'app.valoraciones', 'app.valoracionesItem', 'app.valoracionesTrans', 'app.compartir', 'app.newDemand', 'app.myDemands', 'app.demands', 'app.myDemandsItem', 'app.proposalItem', 'app.userProfile', 'app.askpending','app.userProfileTrans', 'app.registerTrans', 'app.queHacer', 'app.login', 'app.forgotPassword', 'app.emergencias24h', 'app.presentacion', 'app.registerUser', 'app.selectLanguage', 'app.veryHorse', 'app.hotelsList', 'app.hotelsMap', 'app.hotelsDetails', 'app.helpSection', 'app.staticPage', 'ngMap', 'angular-stripe'])

.run(function($ionicPlatform, $rootScope, $window, $state) {
  $rootScope.openFirebaseConnections = [];
  $rootScope.userLoaded = false;

  $ionicPlatform.ready(function() {

    if(navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBupBBq1tkCuwxzAtxmkYx_b5cZa8P3eaA",
      authDomain: "very-horse.firebaseapp.com",
      databaseURL: "https://very-horse.firebaseio.com",
      storageBucket: "very-horse.appspot.com",
      messagingSenderId: "893260808920"
    };
    firebase.initializeApp(config);

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
    var userLang = window.localStorage['lang'];
    if(toState.name !== 'veryHorse.selectLanguage' && !userLang){
      event.preventDefault();
      $state.go('veryHorse.selectLanguage');
      return;
    } else if(toState.name !== 'veryHorse.selectLanguage') {
      if(!$rootScope.userLoaded && toState.name !== "veryHorse" && toState.name !== "veryHorse.mundoEquino" && toState.name !== "veryHorse.presentacion"){
        event.preventDefault();
        $state.go("veryHorse");
      }

      if(toState.name !== "veryHorse.presentacion" && (angular.isUndefined($window.localStorage.presentacion) || $window.localStorage.presentacion === false) ){
        event.preventDefault();
        $state.go("veryHorse.presentacion");

      }else if($rootScope.user){
        if($rootScope.user.userData.bloqueado){
          if(toState.name !== 'veryHorse.userBlocked'){
              event.preventDefault();
              $state.go('veryHorse.userBlocked');
          }
        }else if(!$rootScope.user.userData.aprobado){
          if($rootScope.user.userData.type === 'transportista' && toState.name === 'veryHorse.listDemands'){
            if(!$rootScope.user.userData.aprobado){
              event.preventDefault();
              $state.go('veryHorse.queHacerUserTrans');
            }
          }else if($rootScope.user.userData.type === 'user' && (toState.name === 'veryHorse.newDemand' || toState.name === 'veryHorse.myDemands')){
            event.preventDefault();
            $state.go('veryHorse.queHacerUser');
          }
        }
      }
    }

  });

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
      $rootScope.currentState = toState.name;
  });


  $rootScope.$on('$stateChangeError',
  function(event, toState, toParams, fromState, fromParams, error){
    console.log(error);
  });


})
.config(function (ionicDatePickerProvider, stripeProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Seleccione una fecha',
      setLabel: 'Ok',
      todayLabel: 'Hoy',
      closeLabel: 'Cerrar',
      mondayFirst: true,
      weeksList: ["D", "L", "M", "X", "J", "V", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(),
      to: new Date(2025, 8, 1),
      showTodayButton: false,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: true
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
    
    //set stripe publishable key
    stripeProvider.setPublishableKey('pk_live_CUtewGOibrc8BaMb6EyJEXkg');
    //stripeProvider.setPublishableKey('pk_test_QtB5IQeO5AHxjGd9r2QHzZSs');
    
  });
