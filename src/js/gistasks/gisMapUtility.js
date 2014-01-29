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
		
		return {
			createMap: createMap,
			validateLayer: validateLayer
		};
	});
}());