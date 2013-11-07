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

    define(['jquery',
        'knockout',
        'gcaut-sectionDefineServicesVM'],
    function($, ko, sectionDefineServicesVM) {
		var initialize;

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


            if (navigator.userAgent.indexOf("MSIE") !== -1) {
                var pos6 = navigator.userAgent.indexOf("MSIE 6.0");
                var pos7 = navigator.userAgent.indexOf("MSIE 7.0");
                var pos8 = navigator.userAgent.indexOf("MSIE 8.0");
                var pos9 = navigator.userAgent.indexOf("MSIE 9.0");
                if ((pos6 !== -1) || (pos7 !== -1) || (pos8 !== -1) || (pos9 !== -1)) {
                    alert("You are using IE 9 or less. Use a real browser!!!");
                }
            } else {
                // initialize view models
                sectionDefineServicesVM.initialize($('#secDefineServices'));
            }

		};
		
		return {
			initialize: initialize
		};
	});
}).call(this);