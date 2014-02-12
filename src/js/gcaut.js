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
    		'gcaut-vm-projheader'],
    function($aut, jqui, i18n, projheaderVM) {
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

			// initialize jQueryUI tabs container
			// not bind with knockout because they are not part of the viewmodel, they are containers
			// it is the same reason why accordion on tab map-option is not in knockout. The activate function is on the tab outside knockout
			$tabs.removeAttr('style');
			$tabs.tabs({ heightStyle: 'auto', collapsible: true, active: false, disabled: true });
			$('#gcautmaptabs').tabs({ heightStyle: 'auto', activate: function(event, ui) { setTabOptions(event, ui); } });

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
			if (typeof localStorage.servicename === 'undefined') {
				localStorage.setItem('servicename', value);
			}
		};

		setTabOptions = function(event, ui) {
			var tab = ui.newPanel.attr('id'),
				$div;

			if (tab === 'tabmap-order') {
				$div = $aut('#layersorder');
				$div.sortable();
				$div.disableSelection();
			} else if (tab === 'tabmap-options') {
				$div = $aut('#layersoptions');
				$div.accordion();
				$div.accordion('refresh');
			} else if (tab === 'tabmap-gen') {
				$div = $aut('#map_layers');
				$div.accordion({ heightStyle: 'fill' });
				$div.accordion('refresh');
			}
		};

		return {
			initialize: initialize,
		};
	});
}).call(this);