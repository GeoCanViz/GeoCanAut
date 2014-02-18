/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: @gcaut.version@
 */
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
			setStorage,
			setTabOptions;

		/*
         *  initialize the GCaut application
		 */
		initialize = function() {
			var elem = document.getElementById('projectHeader'),
				$tabs = $('#gcauttabs'),
				servicename = i18n.getDict('%map-servicename');

			// extent or private AMD jQuery with the jQuery from outside project to get reference to some dependencies (magnificPopup, jqueryUI, slidesJS)
			// we need to do this because those libraries are not AMD and use the window.jQuery object to initialize themselves.
			$aut.extend(true, $aut, $);

			// set location path
			setLocationPath();

			// set localstorage for services name
			setStorage(servicename);

			// set proxy for esri request
			esriConfig.defaults.io.proxyUrl = '../proxy.ashx';
			esriConfig.defaults.io.alwaysUseProxy = false;
		
			// initialize jQueryUI tabs container
			// not bind with knockout because they are not part of the viewmodel, they are containers
			$tabs.removeAttr('style');
			$tabs.tabs({ heightStyle: 'auto', collapsible: true, active: false, disabled: true });
			$('#gcautmaptabs').tabs({ heightStyle: 'auto' });

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

		setStorage = function(value) {
			if (typeof localStorage.servicename === 'undefined' || localStorage.servicename === 'undefined') {
				localStorage.setItem('servicename', value);
			}
		};

		return {
			initialize: initialize,
		};
	});
}).call(this);