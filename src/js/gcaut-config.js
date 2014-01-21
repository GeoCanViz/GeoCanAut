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
	
	// if location path is not set in html set by default at GeoCanAut
	if (typeof locationPath === 'undefined') {
		var starGeo = url.search('GeoCanAut');
		if (starGeo !== -1) {
			locationPath = url.substring(0, url.search('GeoCanAut')) + 'GeoCanAut/';
		} else {
			if  (language === 'fr-min') {
				console.log('Définir le meta paramètre "location" ou mettre le site web dans un répertoire nommé "GeoCanAut"');
			} else {
				console.log('Define "location" meta paramter or put web site in a folder called "GeoCanAut"');
			}
		}
	}
	
 	// detect browser (code from http://www.quirksmode.org/)
	var browserDetect = {
		init: function() {
			window.browser = this.searchString(this.dataBrowser) || 'unknown';
			window.browserversion = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'unknown';
	},
	searchString: function(data) {
		var length = data.length,
			i = 0,
			dataString,
			dataProp;
		
		while (length--) {
			dataString = data[i].string;
			dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1) {
					return data[i].identity;
				}
			}
			else if (dataProp) {
				return data[i].identity;
			}
			i++;
		}
	},
	searchVersion: function(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1) {
			return;
		} else {
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		}
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: 'Chrome',
			identity: 'Chrome'
		},
		{
			string: navigator.vendor,
			subString: 'Apple',
			identity: 'Safari',
			versionSearch: 'Version'
		},
		{
			prop: window.opera,
			identity: 'Opera',
			versionSearch: 'Version'
		},
		{
			string: navigator.userAgent,
			subString: 'Firefox',
			identity: 'Firefox'
		},
		{
			string: navigator.vendor,
			subString: 'Camino',
			identity: 'Camino'
		},
		{	// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: 'Netscape',
			identity: 'Netscape'
		},
		{
			string: navigator.userAgent,
			subString: 'MSIE',
			identity: 'Explorer',
			versionSearch: 'MSIE'
		},
		{
			string: navigator.userAgent,
			subString: 'Gecko',
			identity: 'Mozilla',
			versionSearch: 'rv'
		},
		{	// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: 'Mozilla',
			identity: 'Netscape',
			versionSearch: 'Mozilla'
		}]
	};
	browserDetect.init();
	
	// if browser not supported, redirect
	if (window.browser !== 'Explorer' && window.browser !== 'Firefox' && window.browser !== 'Chrome' && window.browser !== 'Safari') {
		if (language === 'en-min') {
			 alert('Browser not suported: needs to be Chrome, Firefox, Safari or Explorer. You will be redirected to Google home page');
		} else {
			alert('Navigateur non supporté: le navigateur doit être Chrome, Firefox, Safari ou Explorer. Vous serez redirigé vers la page d\'acceuil de Google');
		}
		window.location = 'http://www.google.com/';
	} else if (window.browser === 'Explorer' && window.browserversion <= 8) {
		if (language === 'en-min') {
			 alert('Browser not suported: Explorer needs to be version 9 and higher. Vous serez redirigé vers la page d\'acceuil de Google');
		} else {
			alert('Navigateur non supporté: Explorer doit être version 9 ou plus. Vous serez redirigé vers la page d\'acceuil de Google');
		}
		window.location = 'http://www.google.com/';
	}


	// load the require libraries
	define.amd.jQuery = true;	
	require({
		async: true,
		parseOnLoad: false,
		packages: [
			{
				name: 'jquery',
				location: locationPath + 'gcaut/dependencies',
				main: 'jquery.min'
			}, {
				name: 'knockout',
				location: locationPath + 'gcaut/dependencies',
				main: 'knockout.min'
			}, {
				name: 'jqueryui',
				location: locationPath + 'gcaut/dependencies',
				main: 'jqueryui.min'
			}, {
				name: 'accessibletabs',
				location: locationPath + 'gcaut/dependencies',
				main: 'jquery.tabs.min'
			}, {
				name: 'syncheight',
				location: locationPath + 'gcaut/dependencies',
				main: 'jquery.syncheight.min'
			}, {
				name: 'gcaut',
				location: locationPath + 'gcaut',
				main: 'gcaut-min'
			}, {
				name: 'gcaut-i18n',
				location: locationPath + 'gcaut/js',
				main: language
			}, {
				name: 'gcaut-ko',
				location: locationPath + 'gcaut/js/custom',
				main: 'gcaut-ko-binding-min'
			}, {
				name: 'gcaut-gismap',
				location: locationPath + 'gcaut/js/gistasks',
				main: 'gisMapUtility-min'
			}, {
				name: 'gcaut-gisrest',
				location: locationPath + 'gcaut/js/gistasks',
				main: 'gisServiceEsriRest-min'
			}, {
				name: 'gcaut-vm-projheader',
				location: locationPath + 'gcaut/js/viewmodels',
				main: 'projheaderVM-min'
			}, {
				name: 'gcaut-vm-map',
				location: locationPath + 'gcaut/js/viewmodels',
				main: 'mapVM-min'
			}, {
				name: 'gcaut-vm-header',
				location: locationPath + 'gcaut/js/viewmodels',
				main: 'headerVM-min'
			}, {
				name: 'gcaut-vm-footer',
				location: locationPath + 'gcaut/js/viewmodels',
				main: 'footerVM-min'
			}
		]
	});

	// start the process with a private jquery. If we dont, it creates a conflict because we laod jQuery and it is different then the one loaded by WET
	define('jquery-private', ['jquery'], function ($aut) {
	    var noConflict = $aut.noConflict(true);
	    
	    // if there is no jQuery loaded, set the window jquery to be the one from this project. Otherwise keep the outside one because it is use
	    // by script outside this project.
	    window.jQuery = !(window.jQuery) ? window.$ = $aut : window.jQuery;
	    
	    return noConflict;
	});  
	require(['jquery-private', 'gcaut'], function($aut, gcaut) {
		return $aut(document).ready(function() {
			return gcaut.initialize();
		});
	});
}).call(this);