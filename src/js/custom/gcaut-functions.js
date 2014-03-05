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
			getListCB,
			getSrType,
			getSrTypeIndex,
			checkFormatURL,
			getObject;

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

		getListCB = function(val) {
			var i = 1,
				typeArr = [],
				array = val.split(';'),
				len = array.length;
					
			array = array.reverse();
			while (len--) {
				typeArr.push({ id: i, val: array[len] });
				i++;
			}
	
			return typeArr;	
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
		
		getObject = function(array, field, text) {
			var item,
				value = null,
				len = array.length;
			
			while (len--) {
				item = array[len];
				if (item[field] === text) {
					value = item;
				}
			}
			
			return value
		}
		
		return {
			debounce: debounce,
			getListCB: getListCB,
			getSrType: getSrType,
			getSrTypeIndex: getSrTypeIndex,
			checkFormatURL: checkFormatURL,
			getObject: getObject
		};
	});
}());
