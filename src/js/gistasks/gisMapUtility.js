/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * GIS map functions
 */
/* global esri: false */
(function () {
	'use strict';
	define(['jquery-private',
			'gcaut-i18n',
			'esri/map',
			'esri/layers/FeatureLayer',
			'esri/layers/ArcGISTiledMapServiceLayer',
			'esri/layers/ArcGISDynamicMapServiceLayer',
			'esri/geometry/Extent'
			], function($aut, i18n) {
	
		var createMap,
			validateLayer;
	
		createMap = function(id, typeLayer, urlLayer) {
			var options,
				map,
				layer;
			
			// set options
			options = {
				//extent: initExtent,
				//spatialReference: {'wkid': wkid},
				logo: false,
				showAttribution: false,
				wrapAround180: true,
				smartNavigation: false
			};
			
			map = new esri.Map(id, options);
			
			layer = createLayer(typeLayer, urlLayer);
			
			map.addLayer(layer);
			return map;
		};
		
		validateLayer = function(message, type, url, valid) {
			var layer;
			
			if (type === 'esriREST') {
				layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
			} else if (type === 'dynamic') {
				layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
			} else if (type === 'feature') {
				layer = new esri.layers.FeatureLayer(url, {
					mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      				outFields: ["*"]
				});
			}
			
			// test to see if it is a valid layer
			layer.on('load', function() {
				var $message = $aut('#' + message);
				
				$message.addClass('gcaut-message');
				$message.text(i18n.getDict('%map-layersuccess'));
				
				valid(false);
				$aut('#btnLayerOK').attr('disabled', false);
			});
			layer.on('error', function() {
				var $message = $aut('#' + message);

				$message.addClass('gcaut-message-error');
				$message.text(i18n.getDict('%map-layererror'));

			});
			
		};
		
		return {
			createMap: createMap,
			validateLayer: validateLayer
		};
	});
}());