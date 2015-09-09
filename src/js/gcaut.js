/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: @gcaut.version@
 */
/* global $: false */
var locationPath;

(function() {
	'use strict';

	define(['jquery-private',
			'jqueryui',
			'gcaut-i18n',
			'gcaut-vm-projheader',
			'esri/config'],
	function($aut, jqui, i18n, projheaderVM, esriConfig) {
		var initialize,
			setLocationPath,
			setStorage;

		/*
		*  initialize the GCaut application
		 */
		initialize = function() {
			var elem = document.getElementById('projectHeader'),
				$tabs = $('#gcauttabs');

			// extent or private AMD jQuery with the jQuery from outside project to get reference to some dependencies (magnificPopup, jqueryUI, slidesJS)
			// we need to do this because those libraries are not AMD and use the window.jQuery object to initialize themselves.
			$aut.extend(true, $aut, $);

			// set location path
			setLocationPath();

			// read GCAut config file to set author configurations then launch project header
			$aut.ajax({
				url: locationPath + 'gcaut/config/gcaut-default.json',
				crossDomain: false,
				dataType: 'json',
				async: false,
				success: function(config) {
					// set proxy for esri request (https://github.com/Esri/resource-proxy)
					// proxy needs to be in the same domain
					//esriConfig.defaults.io.proxyUrl = 'http://s-bsc-geoappint.nrn.nrcan.gc.ca/DotNet/proxy.ashx';
					esriConfig.defaults.io.proxyUrl = config.urlproxy;
					esriConfig.defaults.io.alwaysUseProxy = false;

					// set localstorage for services name
					setStorage(config.services);

					// initialize jQueryUI tabs container
					// not bind with knockout because they are not part of the viewmodel, they are containers
					$tabs.removeAttr('style');
					$tabs.tabs({ heightStyle: 'auto', collapsible: true, active: false, disabled: true });
					$('#gcautmaptabs').tabs({ heightStyle: 'auto' });
					$('#gcauttoolstabs').tabs({ heightStyle: 'auto' });

					// launch project header
					projheaderVM.initialize(elem, config);
				},
				error: function() {
					console.log('Error in gcaut-default.json');
				}
			}); // end ajax
		};

		setLocationPath = function() {
			// get code location from meta tag
			var metas = document.getElementsByTagName('meta'),
			i = metas.length;

			while (i--) {
				if (metas[i].getAttribute('property') === 'location') {
					locationPath = metas[i].getAttribute('content');
				}
			}

			// if location path is not set in html set by default at GeoCanAut
			if (typeof locationPath === 'undefined') {
				var url = window.location.toString(),
					starGeo = url.search('GeoCanAut');
				if (starGeo !== -1) {
					locationPath = url.substring(0, url.search('GeoCanAut')) + 'GeoCanAut/';
				}
			}
		};

		setStorage = function(services) {
			if (typeof localStorage.servnameWMS === 'undefined') {
				localStorage.setItem('servnameWMS', services.wms);
			}
			if (typeof localStorage.servnameWMTS === 'undefined') {
				localStorage.setItem('servnameWMTS', services.wmts);
			}
			if (typeof localStorage.servnameCacheREST === 'undefined') {
				localStorage.setItem('servnameCacheREST', services.esritiled);
			}
			if (typeof localStorage.servnameDynamicREST === 'undefined') {
				localStorage.setItem('servnameDynamicREST', services.esridynamic);
			}
		};

		return {
			initialize: initialize
		};
	});
}).call(this);
