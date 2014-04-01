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

		getResourceInfo = function(url, success, error) {
			//http://resources.esri.com/help/9.3/arcgisserver/apis/javascript/ve/help/Getting%20Started/DiscoverMapServices.html
			var requestHandle = esriRequest({
									url: url,
									content: { f: 'json' },
									handleAs: 'json',
									callbackParamName: 'callback'
								});

			requestHandle.then(success, error);

			var requestHandleWMS = esriRequest({
									url: url + '?request=GetCapabilities',
									handleAs: 'xml'
								});
			requestHandleWMS.then(function(response) {
				console.log(response);
			}, function(error) {
				console.log(error);
			});
		};

		return {
			getResourceInfo: getResourceInfo
		};
	});
}());

