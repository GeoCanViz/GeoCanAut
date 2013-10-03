/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: @gcaut.version@
 *
 */
var locationPath;
(function() {
	'use strict';
	var mapsTotal,
		mapsNum;

	define(['jquery'], function($) {
		var initialize,
			readConfig,
			execConfig;

		/*
	 	 *  initialize the GCaut application
		 */
		initialize = function() {
			
			// get code location from meta tag
			var metas = document.getElementsByTagName('meta'),
				i = metas.length; 
		
			while(i--) { 
				if (metas[i].getAttribute('property') === 'location') { 
					locationPath = metas[i].getAttribute('content'); 
				} 
			} 

			// initialize view models
			xxx.initialize($mapSection);	
		};
		
		return {
			initialize: initialize
		};
	});
}).call(this);