angular.module('app.dataService', [])


.service('DataService', ['$firebaseArray', '$http', '$translate', '$rootScope', function($firebaseArray, $http, $translate, $rootScope){
    var ref = firebase.database().ref();
    var data = {
        countries   : [],
        horses_sex  : [],
        horses_size : [],
        languages   : [],
        banners     : []
    };

    var continentsISO = {
        "europe"        : "CT-EU",
        "america"       : "CT-AM",
        "africa"        : "CT-AF",
        "asia"          : "CT-AS",
        "oceania"       : "CT-OC",
        "centroamerica" : "CT-CA", 
        "sudamerica"    : "CT-SA"
    };

    loadData();

    return {
        getCountries        : getCountries,
        getCountryByISO     : getCountryByISO,
        getContinentFromISO : getContinentFromISO,
        getHorsesSex        : getHorsesSex,
        getHorsesSize       : getHorsesSize,
        getLanguages        : getLanguages,
        getBanners          : getBanners,
        getRandomBanner     : getRandomBanner
    };

    function getCountries(){
        return data.countries;
    }

    function getCountryByISO(iso){
        var country = null;

        angular.forEach(data.countries, function(c){
            if(c.iso2 === iso){
                country = c;
            }
        });

        return country;
    }

    function getContinentFromISO(iso){
        var country = getCountryByISO(iso);

        if(country !== null){
            return continentsISO[country.continent];
        }else{
            return null;
        }
    }

    function getHorsesSex(){
        return data.horses_sex;
    }

    function getHorsesSize(){
        return data.horses_size;
    }

    function getLanguages(){
        return data.languages;
    }
    
    function getBanners(){
        return data.banners;
    }
    
    function getRandomBanner() {
        var appropriateBanners = [];
        if(!$rootScope.user) { //not logged in user
            appropriateBanners = data.banners;
        } else {
            var searchFor = $rootScope.user.userData.type === 'user' ? 'user' : 'carrier';
            var patt = new RegExp(searchFor);
            for(var i=0; i<data.banners.length; i++) {
                if(patt.test(data.banners[i].sections)) {
                    appropriateBanners.push(data.banners[i]);
                }
            }
        }
        return appropriateBanners.length > 0 ? appropriateBanners[Math.floor(Math.random() * appropriateBanners.length)] : null;
    }

    function loadData(){
        var countriesRef = ref.child("countries");
        // var query = countriesRef.orderByChild("continent").startAt("europe").endAt("europe");
        data.countries = $firebaseArray(countriesRef);

        var horsesSex = ref.child("horses_sex");
        data.horses_sex = $firebaseArray(horsesSex);

        var horsesSize = ref.child("horses_size");
        data.horses_size = $firebaseArray(horsesSize);

        var languages = ref.child("languages");
        data.languages = $firebaseArray(languages);
        
        $http.get('https://newadmin.veryhorse.com/get-banners?lang=' + $translate.use()).then(function(response) {
            angular.forEach(response.data.data, function(value, key) {
                value['image'] = 'https://newadmin.veryhorse.com/images/banners/' + value['image'];
                this.push(value);
            }, data.banners);
        });
    }
}]);