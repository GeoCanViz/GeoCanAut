/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * GIS service functions
 * http://resources.esri.com/help/9.3/arcgisserver/apis/javascript/ve/help/Getting%20Started/DiscoverMapServices.htm
 */
/* global esri: false */
(function () {
	'use strict';
	define(['jquery-private',
			'gcaut-i18n',
			'dojo/request',
			'esri/request'
			], function($aut, i18n, dojoRequest, esriRequest) {

		var getResourceInfo;

		getResourceInfo = function(url, success, error) {
			var requestHandle = esriRequest({
            						url: url,
            						content: { f: "json" },
  									handleAs: "json",
  									callbackParamName: "callback"
          						});

			requestHandle.then(success, error);
		};

		return {
			getResourceInfo: getResourceInfo,
		};
	});
}());