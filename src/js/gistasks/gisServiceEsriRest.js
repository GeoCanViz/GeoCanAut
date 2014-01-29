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
			'gcaut-i18n'
			], function($aut, i18n) {

		var getResourceInfo;

		getResourceInfo = function(url, func) {
			var agisveServices = new ESRI.ArcGIS.VE.ArcGISLayerFactory();
			agisveServices.GetResourceInfo(url, func);
		};

		return {
			getResourceInfo: getResourceInfo,
		};
	});
}());
