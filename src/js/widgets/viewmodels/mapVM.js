/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 *  Project header view model widget
 */
/* global locationPath: false */
(function() {
	'use strict';
	define(['jquery-private',
			'knockout',
			'jqueryui',
			'gcaut-i18n',
			'gcaut-gismap',
			'gcaut-gisrest'
	], function($aut, ko, jqUI, i18n, gisM, gisREST) {
		var initialize,
			clean,
			vm;
		
		initialize = function(elem, map) {
			
			// data model				
			var mapViewModel = function(elem, map) {
				var _self = this,
					pathNew = locationPath + 'gcaut/images/projNew.png',
					pathValid = locationPath + 'gcaut/images/mapValidate.png',
					sr = [3944, 3978, 4326],
					layerType = [{ id: 1, val: 'WMS' }, { id: 2, val: 'WMTS' }, { id: 3, val: 'esriREST Cache' }, { id: 4, val: 'esriREST Dynamic' }],
					size = map.size,
					extentMax = map.extentmax,
					map = map.map,
					extentInit = map.extentinit,
					$layer = $aut('#map_addlayer'),
					isCall = false;

				// images path
				_self.imgNew = pathNew;
				_self.imgValid = pathValid;
				
				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');
				
				// class
				_self.hidden = ko.observable('.gcaut-hidden');
				
				// label
				_self.lblMapSize = i18n.getDict('%size');
				_self.lblMapHeight = i18n.getDict('%height') + ': ';
				_self.lblMapWidth = i18n.getDict('%width') + ': ';
				_self.lblLink = i18n.getDict('%map-link');
				_self.lblBasemap = i18n.getDict('%map-basemap');
				_self.lblMapSR = i18n.getDict('%map-spatialref');
				_self.lblExtentMax = i18n.getDict('%map-extentmax');
				_self.lblExtentInit = i18n.getDict('%map-extentinit');
				_self.lblExtentMinX = i18n.getDict('%map-extentminx');
				_self.lblExtentMinY = i18n.getDict('%map-extentminy');
				_self.lblExtentMaxX = i18n.getDict('%map-extentmaxx');
				_self.lblExtentMaxY = i18n.getDict('%map-extentmaxy');
				_self.lblSelectItem = i18n.getDict('%selectItem');
				_self.lblAddLayer = i18n.getDict('%map-addlayer');
				_self.lblLayerType = i18n.getDict('%map-layertype');
				_self.lblLayerURL = i18n.getDict('%map-layerurl');
				
				// map input
				_self.mapHeightValue = ko.observable(size.height);
				_self.mapWidthValue = ko.observable(size.width);
				_self.isLink = ko.observable(map.link);
				
				// base layer input
				_self.selectBaseLayerType = ko.observable();
				_self.baseURL = ko.observable();
				if (typeof map.layers[0] !== 'undefined') {
					if (typeof map.layers[0].type !== 'undefined') {
						_self.selectBaseLayerType(layerType[map.layers[0].type -1]);
					}
					if (typeof map.layers[0].url !== 'undefined') {
						_self.baseURL(map.layers[0].url);
					}
					_self.isBaseValid = ko.observable(true);
				} else {
					_self.isBaseValid = ko.observable(false);
				}
				
				_self.mapSR = ko.observableArray(sr);
				_self.selectMapSR = ko.observable(map.sr.wkid);
				_self.maxExtentMinX = ko.observable(extentMax.xmin);
				_self.maxExtentMinY = ko.observable(extentMax.ymin);
				_self.maxExtentMaxX = ko.observable(extentMax.xmax);
				_self.maxExtentMaxY = ko.observable(extentMax.ymax);
				_self.initExtentMinX = ko.observable(extentMax.xmin);
				_self.initExtentMinY = ko.observable(extentMax.ymin);
				_self.initExtentMaxX = ko.observable(extentMax.xmax);
				_self.initExtentMaxY = ko.observable(extentMax.ymax);
				_self.baseCallback = ko.observable(false);
				
				// layer input
				_self.layers = ko.observableArray(map.layers);
				_self.layerURL = ko.observable();
				_self.layerType = layerType;
				_self.selectLayerType = ko.observable();
				_self.isValid = ko.observable(true);
				
				// clean the view model
				clean(ko);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};
				
				_self.bind = function() {
					clean(ko);
					$aut('#layers').empty(); // remove layers from DOM
					ko.applyBindings(_self, elem);
				};
				
				_self.selectLayer = function() {
					// set add layer window
					$layer.dialog({
						autoOpen: false,
						modal: true,
						resizable: false,
						draggable: false,
						show: 'fade',
						hide: 'fade',
						closeOnEscape: true,
						title: _self.lblAddLayer,
						width: 600,
						close: function() { },
							buttons: [{
								id: 'btnLayerOK',
								text: 'Ok',
								click: function() {
									var $message = $aut('#layerMessage');
									
									_self.layers.push({ id: _self.selectLayerType() + ' ' + _self.layerURL() });
									_self.layerURL('');
									$message.text('');
									$message.removeClass('gcaut-message-error');
									$message.removeClass('gcaut-message');
									_self.isValid(true);
									_self.hidden('.gcaut-hidden');
									$aut(this).dialog('destroy');
								}
							}, {
								id: 'btnLayerCancel',
								text: 'Cancel',
								click: function() {
									var $message = $aut('#layerMessage');
									
									_self.layerURL('');
									$message.text('');
									$message.removeClass('gcaut-message-error');
									$message.removeClass('gcaut-message');
									_self.isValid(true);
									_self.hidden('.gcaut-hidden');
									$aut(this).dialog('destroy');
								}
							}] 
						});
				
					$layer.dialog('open');
					_self.hidden('');
					$aut('#btnLayerOK').attr('disabled', true);
				};
				
				_self.validateLayer = function() {
					// this function is fired twice (because of input text). Check if it is the first time
					//http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer
					
					if (!isCall) {
						var a = gisM.validateLayer('layerMessage', _self.selectLayerType().id, _self.layerURL(), _self.isValid);
						isCall = true;
					} else {
						isCall = false;
					}
				};

				_self.validateBaseLayer = function() {
					//var url = 'http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer';
					//var url =  'http://geoappext.nrcan.gc.ca/arcgis/rest/services/GSCC/Geochronology/MapServer';
					//var url = 'http://apps.geomatics.gov.nt.ca/ArcGIS/services/GNWT/BiologicEcologic_LCC';
					//var url = 'http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en?';
					var url = 'http://maps.ottawa.ca/ArcGIS/rest/services/CyclingMap/MapServer';
					gisREST.getResourceInfo(url);
					_self.isBaseValid(true);
				};
        
				_self.write = function() {
					var value = '"mapframe": {' +
									'"size": {' +
										'"height": ' + 400 + ',' +
										'"width": ' + 800 +
									'},' +
									'"extent": {' +
										'"xmin": ' + 0.0 + ',' +
										'"ymin": ' + 0.0 + ',' +
										'"xmax": ' + 0.0 + ',' +
										'"ymax": ' + 0.0 +
									'},' +
									'"map": {' +
										'"sr": {' +
											'"wkid": ' + 3978 +
										'},' +
										'"extent": {' +
											'"xmin": ' + 0.0 + ',' +
											'"ymin": ' + 0.0 + ',' +
											'"xmax": ' + 0.0 + ',' +
											'"ymax": ' + 0.0 +
										'},' +
										'"lods": [],' +
										'"resolution": {' +
											'"min": ' + 0 + ',' +
											'"max": ' + 0 +
										'},' +
										'"link": ' + false + ',' +
										'"layers": [{' +
											'"id": "first",' +
											'"type": "tiled",' +
											'"url": "http.first"' +
										'}]'+
									'}' +
								'}';
					
					return value;
				};
 
				_self.removeLayer = function() {
					_self.layers.remove(this);
				};
    
				_self.init();
			};

			vm = new mapViewModel(elem, map);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};
		
		clean = function(ko) {
			// clean (each tab) and remove node in foreach array binding
			ko.cleanNode(document.getElementById('generalMap'));
			//document.getElementById('layers').innerHTML = '';
		};
		
		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
