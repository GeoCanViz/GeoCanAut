/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * GIS service functions
 */
(function () {
	'use strict';
	define(['jquery-private',
			'gcaut-i18n',
			'esri/request'
			], function($aut, i18n, esriRequest) {

		var getResourceInfo,
			getEsriRendererInfo;

		getResourceInfo = function(url, layerType, success, error) {
			//http://resources.esri.com/help/9.3/arcgisserver/apis/javascript/ve/help/Getting%20Started/DiscoverMapServices.html
			var requestHandle,
				options;
				
			if (layerType <= 2) {
				options = { url: url + '?/request=GetCapabilities',
							handleAs: 'xml'
					};
				
			} else if (layerType <= 4) {
				options = { url: url,
							content: { f: 'json' },
							handleAs: 'json',
							callbackParamName: 'callback'
					};
			}
			
			requestHandle = esriRequest(options);				
			requestHandle.then(success, error);
		};

		getEsriRendererInfo = function(url, item) {
			var urlOut = url.substring(0, url.indexOf('MapServer')) + 'MapServer/layers',
				layer = url.substring(url.lastIndexOf('/') + 1, url.length);
			
			// if it is a basemap, layer will not be a number
			if (isNaN(layer)) {
				layer = 0;
			}
			
			esriRequest({
				url: urlOut,
				content: { f: 'json' },
				handleAs: 'json',
				callbackParamName: 'callback',
				load: function(response) {
					item.displaychild.symbol(JSON.stringify(response.layers[layer].drawingInfo.renderer));
				},
				error: function(err) {
					console.log('Not able to get renderer: ' + err);
				}
			});
		};

		return {
			getResourceInfo: getResourceInfo,
			getEsriRendererInfo: getEsriRendererInfo
		};
	});
}());

