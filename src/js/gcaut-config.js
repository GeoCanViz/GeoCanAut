/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: @gcaut.version@
 *
 */
(function() {
	'use strict';
	// get the language
	var url = window.location.toString(),
		pathRegex = new RegExp(/\/[^\/]+$/),
		locationPath,
		language = 'en-min',
		metas,
		i;
	
	if ((url.search(/_f\.htm/) > -1) || (url.search(/-fra\./) > -1) || (url.search(/-fr\./) > -1) || (url.search(/lang=fra/) > -1) || (url.search(/lang=fr/) > -1)) {
		language = 'fr-min';
	} else if ((url.search(/_e\.htm/) > -1) || (url.search(/-eng\./) > -1) || (url.search(/-en\./) > -1) || (url.search(/lang=eng/) > -1) || (url.search(/lang=en/) > -1)) {
		language = 'en-min';
	} else {
		console.log('language not set, English by default');
	}

	// get code location from meta tag
	metas = document.getElementsByTagName('meta'),
	i = metas.length; 

	while(i--) { 
		if (metas[i].getAttribute('property') === 'location') { 
			locationPath = metas[i].getAttribute('content'); 
		} 
	} 
	
	// load the require libraries		
	require({
		async: true,
		parseOnLoad: false,
		aliases: [['text', 'dojo/text']],
		packages: [
			{
				name: 'jquery',
				location: locationPath + 'dist/dependencies',
				main: 'jquery.min'
			}, {
				name: 'knockout',
				location: locationPath + 'dist/dependencies',
				main: 'knockout.min'
			}, {
				name: 'jqueryui',
				location: locationPath + '/dist/dependencies',
				main: 'jqueryui.min'
			}, {
				name: 'gcaut',
				location: locationPath + 'dist',
				main: 'gcaut-min'
			}, {
				name: 'gcaut-i18n',
				location: locationPath + 'dist/js',
				main: language
			}
		]
	});

	define.amd.jQuery = true;
	
	require(['jquery', 'gcaut'], function($, gcaut) {
		return $(document).ready(function() {
			return gcaut.initialize();
		});
	});

}).call(this);