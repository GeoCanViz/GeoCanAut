/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Globals functions
 */
(function () {
	'use strict';
	define([], function() {

		var debounce,
			getSrType,
			getSrTypeIndex,
			checkFormatURL;

		debounce = function(func, threshold, execAsap) {

			var timeout;

			return function debounced () {
				var obj = this, 
					args = arguments;

				function delayed () {
					if (!execAsap) {
						func.apply(obj, args);
					}
					timeout = null; 
				}

				if (timeout) {
					clearTimeout(timeout);
				}
				else if (execAsap) {
					func.apply(obj, args);
				}

				timeout = setTimeout(delayed, threshold || 100); 
			};
		};

		getSrType = function(val) {
			var items, item,
				typeArr = [],
				array = val.split(';'),
				len = array.length;
					
			array = array.reverse();
			while (len--) {
				item = array[len];
				items = item.split(' - ');
				typeArr.push({ id: parseInt(items[0], 10), val: item });
			}
	
			return typeArr;	
		};
	
		getSrTypeIndex = function(array, val) {
			var len = array.length,
				rev = array.reverse();
			
			while (len--) {
				if (rev[len].id === val) { 
					return len;
				}
			}
		};
		
		checkFormatURL = function(url, type) {
			var regObj,
				flag = false,
				regexp = '(^(http|https):\\/\\/)';

			// create regex from type
			if (type === 3 || type === 4) {
				// esri cache or dynamic
				regexp += '*(arcgis/rest/services)*\/(MapServer)';
			}
			
			regObj = new RegExp(regexp);
			if (regObj.test(url)) {
				flag = true;
			}
			
			return flag;
		};
		
		return {
			debounce: debounce,
			getSrType: getSrType,
			getSrTypeIndex: getSrTypeIndex,
			checkFormatURL: checkFormatURL
		};
	});
}());
