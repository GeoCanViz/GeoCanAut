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
			'gcaut-func',
			'esri/map',
			'esri/layers/FeatureLayer',
			'esri/layers/ArcGISTiledMapServiceLayer',
			'esri/layers/ArcGISDynamicMapServiceLayer',
			'esri/geometry/Extent'
			], function($aut, func) {

		var createMap,
			createLayer;

		createMap = function(id, typeLayer, urlLayer, size, holder) {
			var map,
				layer,
				width = size.width,
				height = size.height,
				options,
				initExtent = new esri.geometry.Extent({'xmin': -4630285.316767354, 'ymin': 521021.85642220173, 'xmax': 5053156.458021438, 'ymax': 4896502.9546601, 'spatialReference': {'wkid': 3978}});

			options = {
					extent: new esri.geometry.Extent({'xmin': -4630285.316767354, 'ymin': 521021.85642220173, 'xmax': 5053156.458021438, 'ymax': 4896502.9546601, 'spatialReference': {'wkid': 3978}}),
					spatialReference: {'wkid': 3978},
					logo: false,
					showAttribution: false,
					wrapAround180: true,
					smartNavigation: false
			};

			// create map
			$aut('#map_extent').prepend('<div id="' + id + '" style="border-style: solid;"></div>');
			$aut('#' + id).width(width).height(height);
			map = new esri.Map(id, options);

			map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer('http://geoappext.nrcan.gc.ca/arcgis/rest/services/GSCC/Geochronology/MapServer'));
			//map.addLayer(new esri.layers.FeatureLayer('http://geoappext.nrcan.gc.ca/arcgis/rest/services/GSCC/Geochronology/MapServer/0'));
			//map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer('http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer'));
			//map.addLayer(new esri.layers.FeatureLayer('http://maps.ottawa.ca/ArcGIS/rest/services/Greenbelt/MapServer/0', { mode: esri.layers.FeatureLayer.MODE_ONDEMAND, outFields: ["*"] }));

			// set map size here because API will not take it from the html div
			$aut('#' + id + 'root').width(width).height(height);
			map.width = width;
			map.height = height;

			//layer = createLayer('tiled', 'http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer');
			//map.addLayer(layer);

			layer = createLayer('dynamic', 'http://geoappext.nrcan.gc.ca/arcgis/rest/services/GSCC/Geochronology/MapServer/0');
			//layer = createLayer('dynamic', 'http://maps.ottawa.ca/ArcGIS/rest/services/Greenbelt/MapServer/0');
			//map.addLayer(layer);

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

			if (type === 'tiled') {
				layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
			} else if (type === 'dynamic') {
				layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
			} else if (type === 'feature') {
				layer = new esri.layers.FeatureLayer(url, {
                    mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"]
				});
			}

			return layer;
		};

		return {
			createMap: createMap
		};
	});
}());