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

		var getRestServiceInformation,
			getResourceInfo,
			getEsriRendererInfo,
			getEsriServRendererInfo;

		getRestServiceInformation = function(url) {
			// Make an AJAX call to get REST service information in JSON
			var request = $aut.ajax({
				url: url+'?f=json',
				async: false,
				type: 'POST'
			});
			return request;
		};

		getResourceInfo = function(url, layerType, success, error) {
			//http://resources.esri.com/help/9.3/arcgisserver/apis/javascript/ve/help/Getting%20Started/DiscoverMapServices.html
			var options;

			if (layerType === 1 || layerType === 3) {
				options = { url: url + '?request=GetCapabilities',
							handleAs: 'xml'
					};

				// because of cross domain errors, call the callback functions
				success(url, layerType, '');

			} else if (layerType === 2 || layerType === 4 || layerType === 5) {
				options = { url: url,
							content: { f: 'json' },
							handleAs: 'json',
							callbackParamName: 'callback'
					};

				options.load = function(response) {
								success(url, layerType, response);
						};
					options.error = error;
					esriRequest(options);
				}
		};

		getEsriRendererInfo = function(url, item) {
			var urlOut = url.substring(0, url.indexOf('MapServer')) + 'MapServer/layers',
				layer = url.substring(url.lastIndexOf('/') + 1, url.length);

			// if it is a basemap, layer will not be a number
			if (layer === '') {
				layer = 0;
			}

			esriRequest({
				url: urlOut,
				content: { f: 'json' },
				handleAs: 'json',
				callbackParamName: 'callback',
				load: function(response) {
					// clean renderer if uniqueValue. If the renderer as multiple item with the same label, just pick the
					// first one. If we dont do this we have duplicate in the legend. This happen when data
					// has more subclass with the same symbology e.g.
						// Value: 1974 
						// Label: 1965 - 1984 
						// Description: 
						// Symbol:
							// Style: esriSFSSolid 
							// Color: [0, 0, 0, 0] 
							// Outline:
							// Style: esriSLSSolid 
							// Color: [245, 162, 122, 255] 
							// Width: 0
						// Value: 1973 
						// Label: 1965 - 1984 
						// Description: 
						// Symbol:
							// Style: esriSFSSolid 
							// Color: [0, 0, 0, 0] 
							// Outline:
							// Style: esriSLSSolid 
							// Color: [245, 162, 122, 255] 
							// Width: 0
					var uniqueVals, uniqueVal, len,
						label, symbol,
						labelPrev = '',
						symbolPrev = {},
						outUniqueVals = [],
						renderer = response.layers[layer].drawingInfo.renderer,
						type = renderer.type;

					if (type === 'simple') {
						item.displaychild.symbol(JSON.stringify(renderer));
					} else if (type === 'uniqueValue') {
						uniqueVals = renderer.uniqueValueInfos.reverse();
						len = uniqueVals.length;

						while (len--) {
							uniqueVal = uniqueVals[len];
							label = uniqueVal.label;
							symbol = uniqueVal.symbol;

							// check if the previous symbol and label are the same. If so, do not add to the array
							if (labelPrev !== label || JSON.stringify(symbolPrev) !== JSON.stringify(symbol)) {
								outUniqueVals.push(uniqueVal);
							}

							labelPrev = label;
							symbolPrev = symbol;
						}

						renderer.uniqueValueInfos = outUniqueVals;
						item.displaychild.symbol(JSON.stringify(renderer));
					}
				},
				error: function(err) {
					console.log('Not able to get renderer: ' + err);
				}
			});
		};

		getEsriServRendererInfo = function(items, url, id, success) {
			var urlOut = url.substring(0, url.indexOf('MapServer')) + 'MapServer/layers';

			esriRequest({
				url: urlOut,
				content: { f: 'json' },
				handleAs: 'json',
				callbackParamName: 'callback',
				load: function(response) {
					success(items, url, id, response.layers);
				},
				error: function(err) {
					console.log('Not able to get renderer: ' + err);
				}
			});
		};

		return {
			getRestServiceInformation: getRestServiceInformation,
			getResourceInfo: getResourceInfo,
			getEsriRendererInfo: getEsriRendererInfo,
			getEsriServRendererInfo: getEsriServRendererInfo
		};
	});
}());

