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
			'dojo/request',
			'esri/request'
			], function($aut, i18n, dojoRequest, esriRequest) {

		var getResourceInfo;

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

		return {
			getResourceInfo: getResourceInfo
		};
	});
}());

