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
					sr = [3944, 3978, 4326, 102002],
					layerType = [{ id: 1, val: 'WMS' }, { id: 2, val: 'WMTS' }, { id: 3, val: 'esriREST Cache' }, { id: 4, val: 'esriREST Dynamic' }],
					size = map.size,
					extentMax = map.extentmax,
					map = map.map,
					extentInit = map.extentinit,
					$layer = $aut('#map_addlayer'),
					urlObject, typeObject;

				// images path
				_self.imgNew = pathNew;
				_self.imgValid = pathValid;

				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');

				// class
				_self.hidden = ko.observable('.gcaut-hidden');
				_self.errormsg = ko.observable('.gcaut-message-error');

				// error message
				_self.errortext = ko.observable();

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
				_self.baseURL = ko.observable('http://apps.geomatics.gov.nt.ca/arcgis/rest/services/GNWT/BiologicEcologic_LCC/MapServer');
				if (typeof map.layers[0] !== 'undefined') {
					if (typeof map.layers[0].type !== 'undefined') {
						_self.selectBaseLayerType(layerType[map.layers[0].type -1]);
					}
					if (typeof map.layers[0].url !== 'undefined') {
						_self.baseURL(map.layers[0].url);
					}
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
				_self.layerURL = ko.observable('http://maps.ottawa.ca/ArcGIS/rest/services/CyclingMap/MapServer');
				_self.layerType = layerType;
				_self.selectLayerType = ko.observable();

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

				_self.validateLayer = function(type) {
					//var url =  'http://geoappext.nrcan.gc.ca/arcgis/rest/services/GSCC/Geochronology/MapServer';
					//var url = 'http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBCT3978/MapServer';
					//var url = 'http://apps.geomatics.gov.nt.ca/ArcGIS/services/GNWT/BiologicEcologic_LCC';
					//var url = 'http://wms.ess-ws.nrcan.gc.ca/wms/toporama_en?';
					//var url = 'http://maps.ottawa.ca/ArcGIS/rest/services/CyclingMap/MapServer';
					//var url = 'http://apps.geomatics.gov.nt.ca/arcgis/rest/services/GNWT/BiologicEcologic_LCC/MapServer';
					var isValid,
						category;

					typeObject = type;
					if (type === 'base') {
						urlObject = _self.baseURL;
						category = _self.selectBaseLayerType().id;
					} else {
						urlObject = _self.layerURL;
						category = _self.selectLayerType().id;
					}

					isValid = checkFormatURL(urlObject(), category);

					// clean error message
					_self.errortext('');

					if (isValid) {
						// get service info and validateURL as callback function
						gisREST.getResourceInfo(urlObject(), validateURL);

						// set add layer window (pass the object, not the string)
						layerPopup(urlObject, _self.layers);

					} else {
						_self.errortext(i18n.getDict('%map-layererror'));
					}
				};

				function layerPopup(url, layers) {
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
								updateLayers(_self.servLayers(), layers);
								url('');
								_self.hidden('.gcaut-hidden');
								$aut(this).dialog('destroy');
							}
						}, {
							id: 'btnLayerCancel',
							text: 'Cancel',
							click: function() {
								url('');
								_self.hidden('.gcaut-hidden');
								$aut(this).dialog('destroy');
							}
						}]
					});
				};

				_self.removeLayer = function() {
					_self.layers.remove(this);
				};

				function updateLayers(elem, list) {
					var layers = elem,
						len = layers.length,
						layer,
						servLayers;

					while (len--) {
						layer = layers[len];
						servLayers = layer.servLayers;

						if (servLayers.length === 0) {
							if (layer.isChecked()) {
								_self.layers.push({ id: layer.fullname, category: layer.category });
							}
						} else {
							updateLayers(servLayers, list);
						}
					}
				};

    			function checkFormatURL(url, type) {
    				var isValid = true;

    				// esri rest cache or rest dynamic
    				if (type === 3 || type === 4) {

    					// check for http:// or https://
    					isValid = (url.search(/http:\/\//i) !== -1 || url.search(/https:\/\//i) !== -1) ? true : false;

    					// check for rest
    					isValid = (isValid && (url.search(/\/rest\//i) !== -1)) ? true : false;

    					// check for mapserver
    					isValid = (isValid && (url.search(/\/mapserver/i) !== -1)) ? true : false;
    				}

    				return isValid;
    			};

    			function validateURL(sender, url) {
    				if (sender.hasOwnProperty('layers')) {
    					showResourceInfo(sender);

    					// show window to select layers
    					$layer.dialog('open');
						_self.hidden('');

    				} else if (sender.hasOwnProperty('error')) {
						_self.errortext(i18n.getDict('%map-layererror'));
    				}
    			};

    			function showResourceInfo(sender) {
					var layers = [],
						len = sender.layers.length - 1,
						index = -1,
						item,
						itemName, itemId,
						layer,
						sendLayers = sender.layers,
						initExt = sender.initialExtent,
						fullExt = sender.fullExtent,
						url = urlObject();

					while (index !== len) {
						// set attribute the get sublayers
						layer = {};
						item = sendLayers[index + 1];
						itemName = item.name;
						itemId = item.id;
						layer.name = itemName;
						layer.fullname = url + '/' + itemName;
						layer.url = url + '/' + itemId;
						layer.id = itemId;
						layer.category = typeObject;
						layer.servLayers = getSublayer(item, sendLayers, [], url, layer.fullname);

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

					// update base layer info
					_self.selectMapSR(sender.spatialReference.wkid);
					_self.maxExtentMinX(fullExt.xmin);
					_self.maxExtentMinY(fullExt.ymin);
					_self.maxExtentMaxX(fullExt.xmax);
					_self.maxExtentMaxY(fullExt.ymax);
					_self.initExtentMinX(initExt.xmin);
					_self.initExtentMinY(initExt.ymin);
					_self.initExtentMaxX(initExt.xmax);
					_self.initExtentMaxY(initExt.ymax);
				};

				function getSublayer(parent, sendLayers, layers, url, fullname) {
					var sublayer = {},
						subLayerIds,
						child,
						childName, childId,
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
							childName = child.name;
							childId = child.id;
							sublayer.name = childName;
							sublayer.fullname = fullname + '/' + childName;
							sublayer.url = url + '/' + childId;
							sublayer.id = childId;
							sublayer.isChecked = ko.observable(false);
							sublayer.isUse = ko.observable(false);
							sublayer.category = typeObject;
							layers.push(sublayer);

							// call the same function to know if there is child with tha child sublayers array to add to
							getSublayer(child, sendLayers, layers[layers.length - 1].servLayers, url, sublayer.fullname);
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
					var check = !item.isChecked();

					// Set isUse for all parents;
					item.isUse(check);
					checkParentlayers(parents, check);

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

				_self.init();
			};

			vm = new mapViewModel(elem, map);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};

		clean = function(ko) {
			// clean (each tab) and remove node in foreach array binding
			ko.cleanNode(document.getElementById('tabmap-gen'));
		};

		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
