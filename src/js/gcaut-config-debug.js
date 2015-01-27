/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: @gcaut.version@
 *
 */
/* global alert: false */
(function() {
	'use strict';
	// get the language
	var url = window.location.toString(),
		locationPath, redirectPath,
		language = 'en-min',
		metas,
		i;

	if ((url.search(/_f\.htm/) > -1) || (url.search(/-fra\./) > -1) || (url.search(/-fr\./) > -1) || (url.search(/lang=fra/) > -1) || (url.search(/lang=fr/) > -1)) {
		language = 'fr-min';
		window.langext = 'fra';
	} else if ((url.search(/_e\.htm/) > -1) || (url.search(/-eng\./) > -1) || (url.search(/-en\./) > -1) || (url.search(/lang=eng/) > -1) || (url.search(/lang=en/) > -1)) {
		language = 'en-min';
		window.langext = 'eng';
	} else {
		window.langext = 'eng';
		console.log('language not set, English by default');
	}

	// get code location and redirect page from meta tag
	metas = document.getElementsByTagName('meta'),
	i = metas.length;

	while(i--) {
		if (metas[i].getAttribute('name') === 'gcaut-location') {
			locationPath = metas[i].getAttribute('content');
		}
		if (metas[i].getAttribute('name') === 'gcaut-redirect') {
			redirectPath = metas[i].getAttribute('content');
		}
	}

	// if location path is not set in html set by default at GeoCanViz
	if (typeof locationPath === 'undefined') {
		var starGeo = url.search('GeoCanAut');
		if (starGeo !== -1) {
			locationPath = url.substring(0, url.search('GeoCanAut')) + 'GeoCanAut/';
		} else {
			if (language === 'fr-min') {
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
		var dataString, dataProp,
			length = data.length,
			i = 0;

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
			return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
		}
	},
	dataBrowser: [
		{ // for mobile device (phone and tablet)
			string: navigator.userAgent,
			subString: 'Mobile',
			identity: 'Mobile',
			versionSearch: ''
		}, { // for IE mobile device
			string: navigator.userAgent,
			subString: 'IEMobile',
			identity: 'Mobile',
			versionSearch: ''
		}, { // for Kindle mobile device
			string: navigator.userAgent,
			subString: 'Silk',
			identity: 'Mobile',
			versionSearch: ''
		}, { // for Blackberry Playbook
			string: navigator.userAgent,
			subString: 'Tablet',
			identity: 'Mobile',
			versionSearch: ''
		}, {
			string: navigator.userAgent,
			subString: 'Chrome',
			identity: 'Chrome'
		}, {
			string: navigator.vendor,
			subString: 'Apple',
			identity: 'Safari',
			versionSearch: 'Version'
		}, {
			prop: window.opera,
			identity: 'Opera',
			versionSearch: 'Version'
		}, {
			string: navigator.userAgent,
			subString: 'Firefox',
			identity: 'Firefox'
		}, {
			string: navigator.vendor,
			subString: 'Camino',
			identity: 'Camino'
		}, { // for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: 'Netscape',
			identity: 'Netscape'
		}, {
			string: navigator.userAgent,
			subString: 'MSIE',
			identity: 'Explorer',
			versionSearch: 'MSIE'
		}, { // for IE 11
			string: navigator.userAgent,
			subString: 'Windows NT',
			identity: 'Explorer',
			versionSearch: 'rv'
		},{
			string: navigator.userAgent,
			subString: 'Gecko',
			identity: 'Mozilla',
			versionSearch: 'rv'
		}, { // for older Netscapes (4-)
			string: navigator.userAgent,
			subString: 'Mozilla',
			identity: 'Netscape',
			versionSearch: 'Mozilla'
		}]
	};
	browserDetect.init();

	// if browser not supported, redirect
	if (window.browser !== 'Explorer' && window.browser !== 'Firefox' && window.browser !== 'Chrome' && window.browser !== 'Safari' && window.browser !== 'Mobile') {
		if (language === 'en-min') {
			alert('Browser not supported: needs to be Chrome, Firefox, Safari or Explorer. You will be redirected to project page.');
		} else {
			alert('Navigateur non pris en charge: doit être Chrome, Firefox, Safari ou Explorer. Vous serez redirigé vers la page de projet');
		}

		window.location = redirectPath;
	} else if (window.browser === 'Explorer' && window.browserversion <= 8) {
		if (language === 'en-min') {
			alert('Browser not supported: Explorer needs to be version 9 or higher. You will be redirected to project page.');
		} else {
			alert('Navigateur non pris en charge: Explorer doit être version 9 ou supérieur. Vous serez redirigé vers la page de projet.');
		}

		window.location = redirectPath;
	}

	// load the require libraries	
	define.amd.jQuery = true;
    require({
		async: true,
		parseOnLoad: false,
		packages: [
			{
				name: 'jquery',
				location: locationPath + 'src/js/dependencies',
				main: 'jquery.min'
			}, {
				name: 'knockout',
				location: locationPath + 'src/js/dependencies',
				main: 'knockout.min'
			}, {
				name: 'jqueryui',
				location: locationPath + 'src/js/dependencies',
				main: 'jqueryui.min'
			}, {
				name: 'genfile',
				location: locationPath + 'src/js/dependencies',
				main: 'generatefile.min'
			}, {
				name: 'gcaut',
				location: locationPath + 'src/js',
				main: 'gcaut'
			}, {
				name: 'gcaut-i18n',
				location: locationPath + 'gcaut/js',
				main: language
			}, {
				name: 'gcaut-ko',
				location: locationPath + 'src/js/custom',
				main: 'gcaut-ko-binding'
			}, {
				name: 'gcaut-func',
				location: locationPath + 'src/js/custom',
				main: 'gcaut-functions'
			}, {
				name: 'gcaut-esri',
				location: locationPath + 'src/js/formats',
				main: 'gcaut-esri'
			}, {
				name: 'gcaut-wms',
				location: locationPath + 'src/js/formats',
				main: 'gcaut-wms'
			}, {
				name: 'gcaut-gismap',
				location: locationPath + 'src/js/gistasks',
				main: 'gisMapUtility'
			}, {
				name: 'gcaut-gisservinfo',
				location: locationPath + 'src/js/gistasks',
				main: 'gisServiceInfo'
			}, {
				name: 'gcaut-vm-projheader',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'projheaderVM'
			}, {
				name: 'gcaut-vm-map',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'mapVM'
			}, {
				name: 'gcaut-vm-header',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'headerVM'
			}, {
				name: 'gcaut-vm-footer',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'footerVM'
			}, {
				name: 'gcaut-vm-datagrid',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'datagridVM'
			}, {
				name: 'gcaut-vm-legend',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'legendVM'
			}, {
				name: 'gcaut-vm-nav',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'navigationVM'
			}, {
				name: 'gcaut-vm-draw',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'drawVM'
			}, {
				name: 'gcaut-vm-data',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'dataVM'
			}, {
				name: 'gcaut-vm-extract',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'extractVM'
			}, {
				name: 'gcaut-vm-order',
				location: locationPath + 'src/js/widgets/viewmodels',
				main: 'toolsOrderVM'
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
