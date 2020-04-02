angular.module('app.newDemand', ['app.dataService', 'app.filters'])



.controller('newDemandCtrl', ['$scope', '$rootScope', '$stateParams', '$http', '$timeout', '$firebaseArray', '$ionicActionSheet', 'ionicDatePicker', '$ionicScrollDelegate', 'DataService', '$translate', 'NgMap', function ($scope, $rootScope, $stateParams, $http, $timeout, $firebaseArray, $ionicActionSheet, ionicDatePicker, $ionicScrollDelegate, DataService, $translate, NgMap)
    {
        $scope.countries = DataService.getCountries();
        $scope.banner = DataService.getRandomBanner();

        $scope.step = 0;
        $scope.formData = {};
        $scope.formErrors = {};

        $scope.goStepBack = function ()
        {
            if ($scope.step > 0) {
                $scope.step--;
            }
            if ($scope.step == 3)
                $scope.step = 2;
        };

        $scope.$on("$ionicView.beforeEnter", function (event, data)
        {
            $scope.mensaje2 = $translate.instant('ENVIAR_DEMANDA');
            $scope.mensaje3 = $translate.instant('CONFIRMAR4');

            $scope.pickAddress = {
                city: "",
                country: "",
                countryName: "",
                cp: ""
            };

            $scope.deliverAddress = {
                city: "",
                country: "",
                countryName: "",
                cp: ""
            };

            $scope.step = 0;
            $scope.formData = {
                pickCity: "",
                pickCountry: "",
                pickCountryName: "",
                pickCP: "",
                pickMod: null,
                pickDayIni: null,
                pickDayEnd: null,
                deliverCity: "",
                deliverCountry: "",
                deliverCountryName: "",
                deliverCP: "",
                deliverMod: null,
                deliverDayIni: null,
                deliverDayEnd: null,
                numHorses: '0',
                special: "",
                specialDesc: "",
                lugage: "",
                lugageDesc: "",
                //horsesInfo     : [],
                status: 'pending'
            };
            $scope.showPicDayIni = "";
            $scope.showPicDayEnd = "";
            $scope.showDelDayIni = "";
            $scope.showDelDayEnd = "";

            $scope.contactSent = false;
            $scope.isDisabled = false;

        });

        var dayConfigs = {
            pickDayIniObj: {callback: function (val)
                {
                    $scope.formData.pickDayIni = val;
                    $scope.showPicDayIni = new Date(val);

                    var firstAvailableDate = new Date(val);
                    //firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);
                    dayConfigs.pickDayEndObj.from = firstAvailableDate;
                    dayConfigs.pickDayEndObj.inputDate = firstAvailableDate;

                    dayConfigs.deliverDayIniObj.from = firstAvailableDate;
                    dayConfigs.deliverDayIniObj.inputDate = firstAvailableDate;
                }},
            pickDayEndObj: {callback: function (val)
                {
                    $scope.formData.pickDayEnd = val;
                    $scope.showPicDayEnd = new Date(val);
                }},
            deliverDayIniObj: {callback: function (val)
                {
                    $scope.formData.deliverDayIni = val;
                    $scope.showDelDayIni = new Date(val);

                    var firstAvailableDate = new Date(val);
                    //firstAvailableDate.setDate(firstAvailableDate.getDate() + 1);
                    dayConfigs.deliverDayEndObj.from = firstAvailableDate;
                    dayConfigs.deliverDayEndObj.inputDate = firstAvailableDate;
                }},
            deliverDayEndObj: {callback: function (val)
                {
                    $scope.formData.deliverDayEnd = val;
                    $scope.showDelDayEnd = new Date(val);
                }}
        };

        $scope.limitInputNumHorses = function ()
        {
            if (parseInt($scope.formData.numHorses) > 99) {
                $scope.formData.numHorses = 99;
            }
        }

        $scope.openDatePicker = function (type)
        {
            ionicDatePicker.openDatePicker(dayConfigs[type]);
        };

        function resetErrors()
        {
            $scope.formErrors = {
                pickCity: false,
                pickCP: false,
                pickMod: false,
                pickDayIni: false,
                pickDayEnd: false,
                deliverCity: false,
                deliverCP: false,
                deliverMod: false,
                deliverDayIni: false,
                deliverDayEnd: false,
                numHorses: false,
                special: false,
                specialDesc: "",
                lugage: false,
                lugageDesc: ""
                    //horsesInfo     : []
            };
        }

        $scope.mensaje2 = $translate.instant('ENVIAR_DEMANDA');

        $scope.goToStep = function (step)
        {
            resetErrors();
            var error = false;

            if (step == 1) {
                if (!$scope.formData.pickCity) {
                    error = true;
                    $scope.formErrors.pickCity = true;
                }
                if (!$scope.formData.pickCP) {
                    error = true;
                    $scope.formErrors.pickCP = true;
                }

                $scope.formData.pickCountry = $scope.pickAddress.country;
                $scope.formData.pickCountryName = $scope.pickAddress.countryName;
                $scope.formData.pickCityName = $scope.pickAddress.city ? $scope.pickAddress.city : $scope.formData.pickCity.split(",").shift();
            } else if (step == 4) {
                if (!$scope.formData.pickDayIni) {
                    error = true;
                    $scope.formErrors.pickDayIni = true;
                }

                if ($scope.formData.pickMod === 'between') {
                    if (!$scope.formData.pickDayEnd) {
                        error = true;
                        $scope.formErrors.pickDayEnd = true;
                    }
                }
            } else if (step == 5) {
                if (!$scope.formData.deliverCity) {
                    error = true;
                    $scope.formErrors.deliverCity = true;
                }
                if (!$scope.formData.deliverCP) {
                    error = true;
                    $scope.formErrors.deliverCP = true;
                }

                $scope.formData.deliverCountry = $scope.deliverAddress.country;
                $scope.formData.deliverCountryName = $scope.deliverAddress.countryName;
                $scope.formData.deliverCityName = $scope.deliverAddress.city ? $scope.deliverAddress.city : $scope.formData.deliverCity.split(",").shift();

            } else if (step == 7) {
                if (!$scope.formData.deliverDayIni) {
                    error = true;
                    $scope.formErrors.deliverDayIni = true;
                }

                if ($scope.formData.deliverMod === 'between') {
                    if (!$scope.formData.deliverDayEnd) {
                        error = true;
                        $scope.formErrors.deliverDayEnd = true;
                    }
                }

            } else if (step == 8) {
                /*if($scope.formData.numHorses === "mas_5"){
                 step = 50;

                 $http.jsonp('http://admin.veryhorse.com/php/send.php', {
                 params   : {
                 data 	: JSON.stringify({data: $scope.formData, user: $rootScope.user.userData, lang: window.localStorage['lang']}),
                 action 	: "send_demand_10_horses"
                 }
                 });

                 }else{
                 if($scope.formData.numHorses <= 0){ error = true; $scope.formErrors.numHorses = true;}
                 }*/
                if ($scope.formData.numHorses <= 0) {
                    error = true;
                    $scope.formErrors.numHorses = true;
                }
                $scope.dataCities = $scope.formData; //cargar datos para mostrar la distancia en google maps
                $scope.mensaje2 = $translate.instant('ENVIANDO_DEMANDA');
            }

            if (!error) {
                $timeout(function ()
                {
                    $scope.step = step;
                    $ionicScrollDelegate.scrollTop();
                }, 100);
            }
        };

        $scope.mensaje3 = $translate.instant('CONFIRMAR4');
        $scope.isDisabled = false;
        $scope.createDemand = function ()
        {
            if (!$scope.isDisabled) {
                $scope.isDisabled = true;
                $scope.mensaje3 = $translate.instant('CONFIRMAR5');

                $scope.formData.user = $rootScope.user.uid;

                var demandas = $firebaseArray(firebase.database().ref("/demandas/"));
                demandas.$add($scope.formData).then(function (ref)
                {
                    $scope.step = 50;
                    $ionicScrollDelegate.scrollTop();

                    $http.jsonp('http://admin.veryhorse.com/php/send.php', {
                        params: {
                            data: JSON.stringify({demand: ref.key, pickCountry: $scope.formData.pickCountry, deliverCountry: $scope.formData.deliverCountry, pickCity: $scope.formData.pickCity, deliverCity: $scope.formData.deliverCity}),
                            action: "send_new_demand"
                        }
                    });
                });
            }
        };

        //$scope.proposalSent = false;

        $scope.selectPickDateMod = function (mod)
        {
            $scope.formData.pickMod = mod;
            $scope.step++;
            $ionicScrollDelegate.scrollTop();
        };
        $scope.selectDeliverDateMod = function (mod)
        {
            $scope.formData.deliverMod = mod;
            $scope.step++;
            $ionicScrollDelegate.scrollTop();
        };

        $scope.disableTap = function ()
        {
            container = document.getElementsByClassName('pac-container');
            // disable ionic data tab
            angular.element(container).attr('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            angular.element(container).on("click", function ()
            {
                document.getElementById('pickCityInput').blur();
            });
        };
        
        $scope.openBanner = function() {
            $scope.openInBrowser($scope.banner.link);
        };

        $scope.openInBrowser = function(url) {
            window.cordova.InAppBrowser.open(url, '_system');
        };
    }]);
