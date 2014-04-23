/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * GIS map functions
 */
(function () {
	'use strict';
	define(['jquery-private',
			'gcaut-func',
			'esri/map',
			'esri/layers/FeatureLayer',
			'esri/layers/ArcGISTiledMapServiceLayer',
			'esri/layers/ArcGISDynamicMapServiceLayer'
			], function($aut, func, esriMap, esriFL, esriRestC, esriRestD) {

		var createMap,
			createLayer;

		createMap = function(id, typeLayer, urlLayer, size, holder) {
			var map,
				options,
				width = size.width,
				height = size.height;

			options = {
				logo: false,
				showAttribution: false,
				wrapAround180: true,
				smartNavigation: false
			};

			// create map
			$aut('#map_extent').prepend('<div id="' + id + '" style="border-style: solid;"></div>');
			$aut('#' + id).width(width).height(height);
			map = new esriMap(id, options);
			map.addLayer(createLayer(typeLayer, urlLayer));

			// set map size here because API will not take it from the html div
			$aut('#' + id + 'root').width(width).height(height);
			map.width = width;
			map.height = height;

			map.on('extent-change', func.debounce(function(evt) {
				var extent = evt.extent;

				holder[0](extent.xmin);
				holder[1](extent.ymin);
				holder[2](extent.xmax);
				holder[3](extent.ymax);

			}, 1000, false));
		};

		createLayer = function(type, url) {
			var layer;

			if (type === 2) {
				layer = new esriRestC(url);
			} else if (type === 4) {
				layer = new esriRestD(url);
			} else if (type === 5) {
				layer = new esriFL(url, {
                    mode: esriFL.MODE_ONDEMAND,
                    outFields: ['*']
				});
			}

			return layer;
		};

		return {
			createMap: createMap
		};
	});
}());
