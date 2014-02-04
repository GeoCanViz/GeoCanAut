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

		var debounce;

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

		return {
			debounce: debounce
		};
	});
}());