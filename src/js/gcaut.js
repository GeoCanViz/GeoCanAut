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
    		'gcaut-vm-projheader'],
    function($aut, jqui, projheaderVM) {
		var initialize,
			setLocationPath,
			setTabOptions;

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

			// initialize jQueryUI tabs container
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

		setTabOptions = function(event, ui) {
			var tab = ui.newPanel.attr('id'),
				$div;

			if (tab === 'tabmap-order') {
				$div = $('#layersorder');
				$div.sortable();
				$div.disableSelection();
			} else if (tab === 'tabmap-options') {
				$('#layersoptions').accordion();
			}
		};

		return {
			initialize: initialize,
		};
	});
}).call(this);