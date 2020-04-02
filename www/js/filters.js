angular.module('app.filters', [])
.filter("demandTitle", function($filter){
	return function(demand){
		return demand.pickCity+" ("+$filter('date')(demand.pickDayIni,'d-MMM')+") - "+demand.deliverCity+" ("+$filter('date')(demand.deliverDayIni,'d-MMM')+")";
	};
})
.filter("demandTitleCarrier", function($filter){
	return function(demand){
		return 'Recogida: '+ $filter('date')(demand.pickDayIni,'d-MMM') +" - Entrega: "+ $filter('date')(demand.deliverDayIni,'d-MMM');
	};
})
.filter("demandDate", function($filter){
	return function(demandDate){
		return $filter('date')(demandDate,'d-MMM');
	};
})
.filter("sexName", function(){
	return function(code, items){
		var name = ""; 
		angular.forEach(items, function(s){if(s.code === code){ name = s.name; } }); 
		return name;
	};
})
.filter("sizeName", function(){
	return function(code, items){
		var name = ""; 
		angular.forEach(items, function(s){if(s.code === code){ name = s.name; } }); 
		return name;
	};
})
.filter("demandAmount", function(){
	return function(amount){
		return parseFloat(amount) + (parseFloat(amount) * 0.12);
	};
})
.filter("payAmount", function(){
	return function(amount){
		var number = (parseFloat(amount) * 0.12);
		return Math.round(parseFloat(number) * (Math.pow(10,2))) / Math.pow(10,2);
	};
})
.filter("customRound", function(){
	return function(number, decimals){
		return Math.round(parseFloat(number) * (Math.pow(10,decimals))) / Math.pow(10,decimals);
	};
})
.filter("filterCountries", function($filter){
	return function(list, text){
		var filtered = [];

		angular.forEach(list, function(item){
			if(normalize(item.iso2.toUpperCase()).indexOf(normalize(text.toUpperCase())) >= 0 || normalize(item.iso3.toUpperCase()).indexOf(normalize(text.toUpperCase())) >= 0 || normalize(item.nombre.toUpperCase()).indexOf(normalize(text.toUpperCase())) >= 0){
				filtered.push(item);
			}
		})

		return filtered;
	};
})
;

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' );
  }
 
})();