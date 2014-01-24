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
				
				// layer input
				_self.layers = ko.observableArray(map.layers);
				_self.layerURL = ko.observable();
				_self.layerType = layerType;
				_self.selectLayerType = ko.observable();
				_self.isValid = ko.observable(true);
				
				// layer service info array
				_self.servLayers = ko.observableArray();

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
					var url = 'http://apps.geomatics.gov.nt.ca/arcgis/rest/services/GNWT/BiologicEcologic_LCC/MapServer';
					gisREST.getResourceInfo(url, showResourceInfo);
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
    
    			function showResourceInfo(sender, data) {
					var layers = [],
						len = sender.layers.length - 1,
						index = -1,
						item,
						layer,
						sendLayers = sender.layers;

					while (index !== len) {
						// set attribute the get sublayers
						layer = {};
						item = sendLayers[index + 1];
						layer.name = item.name;
						layer.id = item.id;
						layer.servLayers = getSublayer(item, sendLayers, []);
						
						// knockout checkbox and label binding
						layer.isChecked = ko.observable(false);
						layer.isUse = ko.observable(false);
   						
						// get index of the next group
						if (layer.servLayers.length > 0) {
							index = getIndex(layer.servLayers, 0);
						} else {
							index = layer.id;
						}

						layers.push(layer);
					}

					// update knockout array
					_self.servLayers(layers);
				};
				
				function getSublayer(parent, sendLayers, layers) {
					var sublayer = {},
						subLayerIds,
						child,
						len;
					
					// if there is sublayers add them
					subLayerIds = parent.subLayerIds;
					if (subLayerIds !== null) {
						len = subLayerIds.length;
						while (len--) {
							sublayer = {};
							sublayer.servLayers = [];
							
							// add the child info and push to array
							child = sendLayers[subLayerIds[len]];
							sublayer.name = child.name;
							sublayer.id = child.id;
							sublayer.isChecked = ko.observable(false);
							sublayer.isUse = ko.observable(false);						
							layers.push(sublayer);
							
							// call the same function to know if there is child with tha child sublayers array to add to
							getSublayer(child, sendLayers, layers[layers.length - 1].servLayers);
						}
					}
					
					return layers;
				};
             
				function getIndex(arr, id) {
					var val,
						len,
						layers;
					
					if (arr.length > 0) {
						len = arr.length;
						while (len--) {
							layers = arr[len].servLayers;
							if (layers.length > 0) {
								val = getIndex(layers, id);	
								id = (val > id) ? val : id;
							} else {
								val = arr[len].id;
								id = (val > id) ? val : id;
							}
						}
					} 
					
					return id;
				};
				
				_self.cascadeCheck = function(parents, item, event) {
					
					// Set isUse for all parents;
					item.isUse(!item.isChecked());
					checkParentlayers(parents, !item.isChecked());
		
					// check or uncheck all child layers and set the isUse
					checkSublayers(item, 0);
					return true;
				};

				function checkParentlayers(parents, checked) {
					// minus 1 because the last item in the array is the view model
					var len = parents.length - 1,
						index = 0,
						parent,
						use;
					
					while (index !== len) {
						use = false;
						parent = parents[index];
						index++;
						
						// check if a layer on the same level is use
						ko.utils.arrayForEach(parent.servLayers, function(subitem) {
							if (subitem.isUse()) {
								use = true;
							}; 
						});
						
						// if a layer on the same level is use set to true
						if (use) {
							parent.isUse(true);
						} else {
							parent.isUse(checked);
						}
					}
		   		};
		   		
		   		function checkSublayers(item, level) {
		   			var checked = level ? !item.isChecked() : item.isChecked();

					ko.utils.arrayForEach(item.servLayers, function(subitem) {
						subitem.isUse(!checked); 
						subitem.isChecked(!checked); 
						checkSublayers(subitem, 1);
					});
		   		};
				
				_self.init();
			};

			vm = new mapViewModel(elem, map);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};
		
		clean = function(ko) {
			// clean (each tab) and remove node in foreach array binding
			ko.cleanNode(document.getElementById('tabmap-gen'));
			//document.getElementById('layers').innerHTML = '';
		};
		
		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
