angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('veryHorse',                       {url: '/vh', templateUrl: 'templates/veryHorse.html',controller: 'veryHorseCtrl'})
  .state('veryHorse.mundoEquino',           {url: '/mundoEquino',                 views: {'vh': {templateUrl: 'templates/mundoEquino.html',                   controller: 'mundoEquinoCtrl'}}})
  .state('veryHorse.mundoEquinoItem',       {url: '/mundoEquino/:id',             views: {'vh': {templateUrl: 'templates/mundoEquinoItem.html',               controller: 'mundoEquinoItemCtrl'}}})
                          
  //.state('veryHorse.contacto',              {url: '/contacto',                    views: {'vh': {templateUrl: 'templates/contacto.html',                      controller: 'dummyCtrl'}}})
  .state('veryHorse.contacto',              {url: '/contacto',                    views: {'vh': {templateUrl: 'templates/contacto.html',                      controller: 'contactoCtrl'}}})
  .state('veryHorse.comoFunciona',          {url: '/comoFunciona',                views: {'vh': {templateUrl: 'templates/comoFunciona.html',                  controller: 'dummyCtrl'}}})
  //.state('veryHorse.comoFunciona',          {url: '/comoFunciona',                views: {'vh': {templateUrl: 'templates/comoFunciona_'+$translate.preferredLanguage()+'.html',  controller: 'dummyCtrl'}}})
  .state('veryHorse.emergencias24h',        {url: '/emergencias',                 views: {'vh': {templateUrl: 'templates/emergencias24h.html',                controller: 'emergencias24hCtrl'}}})
  .state('veryHorse.presentacion',          {url: '/presentacion',                views: {'vh': {templateUrl: 'templates/presentacion.html',                  controller: 'presentacionCtrl'}}})
  .state('veryHorse.login',                 {url: '/login',                       views: {'vh': {templateUrl: 'templates/login.html',                         controller: 'loginCtrl'}}})
  .state('veryHorse.forgotPassword',        {url: '/forgotPassword',              views: {'vh': {templateUrl: 'templates/forgotPassword.html',                controller: 'forgotPasswordCtrl'}}})
  .state('veryHorse.register',              {url: '/register',                    views: {'vh': {templateUrl: 'templates/register.html',                      controller: 'dummyCtrl'}}})
  .state('veryHorse.registerUser',          {url: '/registerUser',                views: {'vh': {templateUrl: 'templates/registerUser.html',                  controller: 'registerUserCtrl'}}})
                                
  .state('veryHorse.queHacerUser',          {url: '/queHacerUser',                views: {'vh': {templateUrl: 'templates/queHacerUser.html',                  controller: 'queHacerCtrl'}}})
  .state('veryHorse.queHacerUser2',         {url: '/queHacerUser2',               views: {'vh': {templateUrl: 'templates/queHacerUser2.html',                 controller: 'queHacerCtrl'}}})
                                
  .state('veryHorse.newDemand',             {url: '/newDemand',                   views: {'vh': {templateUrl: 'templates/newDemand.html',                     controller: 'newDemandCtrl'}}})
  .state('veryHorse.myDemands',             {url: '/myDemands',                   views: {'vh': {templateUrl: 'templates/myDemands.html',                       controller: 'myDemandsCtrl'}}})
  .state('veryHorse.myDemandsItem',         {url: '/myDemands/:id',               views: {'vh': {templateUrl: 'templates/demandItem.html',                    controller: 'myDemandsItemCtrl'}}})
  .state('veryHorse.AskPending',            {url: '/askpending',                  views: {'vh': {templateUrl: 'templates/askpending.html',                    controller: 'AskPedingItemCtrl'}}})
  .state('veryHorse.userProfile',           {url: '/userProfile',                 views: {'vh': {templateUrl: 'templates/userProfile.html',                   controller: 'userProfileCtrl'}}})
  .state('veryHorse.userProfileTrans',      {url: '/userProfileTrans',            views: {'vh': {templateUrl: 'templates/userProfileTrans.html',              controller: 'userProfileTransCtrl'}}})
                                
  .state('veryHorse.registerTrans',         {url: '/registerTrans',               views: {'vh': {templateUrl: 'templates/registerTrans.html',                 controller: 'registerTransCtrl'}}})
  .state('veryHorse.queHacerUserTrans',     {url: '/queHacerUserTrans',           views: {'vh': {templateUrl: 'templates/queHacerUserTrans.html',             controller: 'queHacerCtrl'}}})
                      
  .state('veryHorse.listDemands',           {url: '/listDemands',                 views: {'vh': {templateUrl: 'templates/demands.html',                       controller: 'demandsCtrl'}}})
  .state('veryHorse.proposal',              {url: '/proposal?demanda&proposal',   views: {'vh': {templateUrl: 'templates/proposalItem.html',                  controller: 'proposalItemCtrl'}}})

  .state('veryHorse.valoraciones',          {url: '/valoraciones',                views: {'vh': {templateUrl: 'templates/valoraciones.html',                  controller: 'valoracionesCtrl'}}})
  .state('veryHorse.valoracionesTrans',     {url: '/valoracionesTrans',           views: {'vh': {templateUrl: 'templates/valoracionesTrans.html',             controller: 'valoracionesTransCtrl'}}})
  .state('veryHorse.valoracionItem',        {url: '/valoraciones/:id',            views: {'vh': {templateUrl: 'templates/valoracionItem.html',                controller: 'valoracionesItemCtrl'}}})

  .state('veryHorse.userBlocked',           {url: '/userBlocked',                 views: {'vh': {templateUrl: 'templates/userBlocked.html',                   controller: 'queHacerCtrl'}}})

  .state('veryHorse.selectLanguage',        {url: '/selectLanguage',              views: {'vh': {templateUrl: 'templates/selectLanguage.html',                controller: 'selectLanguageCtrl'}}})

  .state('veryHorse.compartir',             {url: '/compartir',                   views: {'vh': {templateUrl: 'templates/compartir.html',                     controller: 'compartirCtrl'}}})
  .state('veryHorse.listHotels',            {url: '/listHotels',                  views: {'vh': {templateUrl: 'templates/hotelsList.html',                    controller: 'hotelsListCtrl'}}})
  .state('veryHorse.mapHotels',             {url: '/mapHotels',                   views: {'vh': {templateUrl: 'templates/hotelsMap.html',                     controller: 'hotelsMapCtrl'}}})
  .state('veryHorse.detailsHotels',         {url: '/detailsHotels/:id',           views: {'vh': {templateUrl: 'templates/hotelsDetails.html',                 controller: 'hotelsDetailsCtrl'}}})
  .state('veryHorse.helpSection',           {url: '/helpSection',                 views: {'vh': {templateUrl: 'templates/helpSection.html',                   controller: 'helpSectionCtrl'}}})
  .state('veryHorse.staticPage',            {url: '/staticPage/:name',            views: {'vh': {templateUrl: 'templates/staticPage.html',                    controller: 'staticPageCtrl'}}})
  ;

  $urlRouterProvider.otherwise('/vh/mundoEquino');

  

});