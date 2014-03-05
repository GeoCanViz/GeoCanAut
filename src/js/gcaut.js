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
				$tabs = $('#gcauttabs'),
				wms = i18n.getDict('%map-wms'),
				wmts = i18n.getDict('%map-wmts'),
				cacheRest = i18n.getDict('%map-cacherest'),
				dynamicRest = i18n.getDict('%map-dynamicrest');

			// extent or private AMD jQuery with the jQuery from outside project to get reference to some dependencies (magnificPopup, jqueryUI, slidesJS)
			// we need to do this because those libraries are not AMD and use the window.jQuery object to initialize themselves.
			$aut.extend(true, $aut, $);

			// set location path
			setLocationPath();

			// set localstorage for services name
			setStorage(wms, wmts, cacheRest, dynamicRest);

			// set proxy for esri request (https://github.com/Esri/resource-proxy)
			esriConfig.defaults.io.proxyUrl = 'http://localhost:8888/php/proxy.php';
			esriConfig.defaults.io.alwaysUseProxy = false;

			// initialize jQueryUI tabs container
			// not bind with knockout because they are not part of the viewmodel, they are containers
			$tabs.removeAttr('style');
			$tabs.tabs({ heightStyle: 'auto', collapsible: true, active: false, disabled: true });
			$('#gcautmaptabs').tabs({ heightStyle: 'auto' });
			$('#gcauttoolstabs').tabs({ heightStyle: 'auto' });

			// launch project header
			projheaderVM.initialize(elem);
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

		setStorage = function(wms, wmts, cacheRest, dynamicRest) {
			if (typeof localStorage.servnameWMS === 'undefined') {
				localStorage.setItem('servnameWMS', wms);
			}
			if (typeof localStorage.servnameWMTS === 'undefined') {
				localStorage.setItem('servnameWMTS', wmts);
			}
			if (typeof localStorage.servnameCacheREST === 'undefined') {
				localStorage.setItem('servnameCacheREST', cacheRest);
			}
			if (typeof localStorage.servnameDynamicREST === 'undefined') {
				localStorage.setItem('servnameDynamicREST', dynamicRest);
			}
		};

		return {
			initialize: initialize
		};
	});
}).call(this);
