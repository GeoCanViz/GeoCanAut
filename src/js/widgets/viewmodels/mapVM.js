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
			'gcaut-func',
			'gcaut-esri',
			'gcaut-gismap',
			'gcaut-gisservinfo'
	], function($aut, ko, jqUI, i18n, gcautFunc, esriData, gisM, gisServInfo) {
		var initialize,
			clean,
			setServName,
			updateLayers,
			readServInfo,
			checkParentlayers,
			checkSublayers,
			vm;

		initialize = function(elem, map) {

			// data model
			var mapViewModel = function(elem, mapin) {
				var _self = this,
					pathNew = locationPath + 'gcaut/images/projNew.png',
					pathValid = locationPath + 'gcaut/images/mapValidate.png',
					pathExtent = locationPath + 'gcaut/images/mapExtent.png',
					pathDelete = locationPath + 'gcaut/images/projDelete.gif',
					pathCheckAll = locationPath + 'gcaut/images/mapCheckAll.png',
					pathUncheckAll = locationPath + 'gcaut/images/mapUncheckAll.png',
					srType = gcautFunc.getSrType(i18n.getDict('%map-sr')),
					layerType = [{ id: 1, val: 'WMS' }, { id: 2, val: 'WMTS' }, { id: 3, val: 'esriREST Cache' }, { id: 4, val: 'esriREST Dynamic' }],
					size = mapin.size,
					map = mapin.map,
					base = map.bases[0],
					layers = map.layers,
					extentMax = map.extentmax,
					extentInit = map.extentinit,
					lods = map.lods,
					urlObject, typeObject;

				// images path
				_self.imgNew = pathNew;
				_self.imgValid = pathValid;
				_self.imgExtent = pathExtent;
				_self.imgDelete = pathDelete;
				_self.imgCheckAll = pathCheckAll;
				_self.imgUncheckAll = pathUncheckAll;

				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');

				// class
				_self.hiddenLayer = ko.observable('gcaut-hidden');
				_self.hiddenMap = ko.observable('gcaut-hidden');
				_self.errormsg = ko.observable('gcaut-message-error');
				
				// error message
				_self.errortext = ko.observable();

				// label
				_self.lblMapSize = i18n.getDict('%size');
				_self.lblMapHeight = i18n.getDict('%height') + ': ';
				_self.lblMapWidth = i18n.getDict('%width') + ': ';
				_self.lblLink = i18n.getDict('%map-link');
				_self.lblResol = i18n.getDict('%map-resolution');
				_self.lblLods = i18n.getDict('%map-lods');
				_self.lblLevel = i18n.getDict('%map-level');
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
				_self.lblSetExtent = i18n.getDict('%map-setextent');
				_self.lblScale = i18n.getDict('%map-scale');
				_self.lblScaleMin = i18n.getDict('%minimum');
				_self.lblScaleMax = i18n.getDict('%maximum');

				// text
				_self.txtLayerErr = i18n.getDict('%map-layererror');

				// focus txt_mapHeight on init
				_self.focusMapHeight = ko.observable(true);
				
				// dialog
				_self.isLayerDialogOpen = ko.observable();
				_self.isExtentDialogOpen = ko.observable();
				_self.extentType = ko.observable();

				// services
				_self.baseURL = ko.observable();
				_self.layerURL = ko.observable();
				_self.availServ = ko.observableArray([]);

				// map input
				_self.mapHeightValue = ko.observable(size.height).extend({ numeric: 0 });
				_self.mapWidthValue = ko.observable(size.width).extend({ numeric: 0 });
				_self.isLink = ko.observable(map.link);

				// set extent variable (for the dialog box)
				_self.setExtentMinX = ko.observable();
				_self.setExtentMinY = ko.observable();
				_self.setExtentMaxX = ko.observable();
				_self.setExtentMaxY = ko.observable();

				// base layer input
				_self.bases = ko.observableArray();
				_self.selectBaseLayerType = ko.observable();
				if (typeof base !== 'undefined') {
					_self.bases.push({ id: base.id,
										type: base.type, 
										category: 'base',
										url: base.url });
				}

				_self.srType = srType;
				_self.isLods = ko.observable(lods.enable);
				_self.lods = ko.observableArray(lods.values);
				_self.selectMapSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, map.sr.wkid)]);
				_self.maxExtentMinX = ko.observable(extentMax.xmin).extend({ numeric: 10 });
				_self.maxExtentMinY = ko.observable(extentMax.ymin).extend({ numeric: 10 });
				_self.maxExtentMaxX = ko.observable(extentMax.xmax).extend({ numeric: 10 });
				_self.maxExtentMaxY = ko.observable(extentMax.ymax).extend({ numeric: 10 });
				_self.initExtentMinX = ko.observable(extentInit.xmin).extend({ numeric: 10 });
				_self.initExtentMinY = ko.observable(extentInit.ymin).extend({ numeric: 10 });
				_self.initExtentMaxX = ko.observable(extentInit.xmax).extend({ numeric: 10 });
				_self.initExtentMaxY = ko.observable(extentInit.ymax).extend({ numeric: 10 });

				// layer input
				_self.isLayer = ko.observable(false);
				_self.layers = ko.observableArray(map.layers);
				_self.layerType = layerType;
				_self.selectLayerType = ko.observable();

				// layer service info array
				_self.servLayers = ko.observableArray();

				// subscribe functions
				_self.selectBaseLayerType.subscribe(function(val) {
					return _self.availServ(setServName(val.id)); 
				});
				
				_self.selectLayerType.subscribe(function(val) {
					return _self.availServ(setServName(val.id)); 
				});
				
				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					$aut('#layers').empty(); // remove layers from DOM
					ko.applyBindings(_self, elem);
				};
				
				// select layers dialog buttons functions (ok and cancel)
				_self.dialogLayerOk = function() {
					updateLayers(_self.servLayers(), layers);
					_self.dialogLayerCancel();
				};

				_self.dialogLayerCancel = function() {
					_self.baseURL('');
					_self.layerURL('');
					_self.hiddenLayer('gcaut-hidden');
					_self.isLayerDialogOpen(false);
				};
				
				// update layers array when they are selected from the dialog box
				updateLayers = function(elem, list) {
					var layer,
						servLayers,
						layers = elem,
						len = layers.length;

					if (_self.isLayer()) {
						while (len--) {
							layer = layers[len];
							servLayers = layer.servLayers;

							if (servLayers.length === 0) {
								if (layer.isChecked()) {
									_self.layers.push({ id: layer.fullname,
														type: layer.type,
														category: layer.category,
														url: layer.url,
														minScale: layer.minScale,
														maxScale: layer.maxScale });
								}
							} else {
								updateLayers(servLayers, list);
							}
						}
					} else {
						_self.bases.push({ id: _self.baseURL(), 
											type: _self.selectBaseLayerType().id,
											category: 'base',
											url: _self.baseURL() });
					}
				};

				// four next function are use to check/uncheck element in layer dialog box
				_self.checkAll = function(layers, value) {
					var layer,
						len = layers.length;

					while (len--) {
						layer = layers[len];

						// set parent level
						layer.isUse(value);
						layer.isChecked(value);

						// check or uncheck all child layers and set the isUse
						checkSublayers(layer, 1);
					}

					return true;
				};

				_self.cascadeCheck = function(parents, item) {
					var check = !item.isChecked();

					// Set isUse for all parents;
					item.isUse(check);
					checkParentlayers(parents, check);

					// check or uncheck all child layers and set the isUse
					checkSublayers(item, 0);

					return true;
				};

				checkParentlayers = function(parents, checked) {
					// minus 1 because the last item in the array is the view model
					var parent,
						use,
						len = parents.length - 1,
						index = 0;

					while (index !== len) {
						use = false;
						parent = parents[index];
						index++;

						// check if a layer on the same level is use
						ko.utils.arrayForEach(parent.servLayers, function(subitem) {
							if (subitem.isUse()) {
								use = true;
							}
						});

						// if a layer on the same level is use set to true
						if (use) {
							parent.isUse(true);
						} else {
							parent.isUse(checked);
						}
					}
				};

				checkSublayers = function(item, level) {
					var checked = level ? !item.isChecked() : item.isChecked();

					ko.utils.arrayForEach(item.servLayers, function(subitem) {
						subitem.isUse(!checked);
						subitem.isChecked(!checked);
						checkSublayers(subitem, 1);
					});
				};
				
				// set extent dialog buttons functions (ok and cancel)
				_self.dialogExtentOk = function() {
					var type = _self.extentType();
					
					if (type === 'max') {
						_self.maxExtentMinX(_self.setExtentMinX());
						_self.maxExtentMinY(_self.setExtentMinY());
						_self.maxExtentMaxX(_self.setExtentMaxX());
						_self.maxExtentMaxY(_self.setExtentMaxY());
					} else {
						_self.initExtentMinX(_self.setExtentMinX());
						_self.initExtentMinY(_self.setExtentMinY());
						_self.initExtentMaxX(_self.setExtentMaxX());
						_self.initExtentMaxY(_self.setExtentMaxY());
					}

					_self.dialogExtentCancel();
				};

				_self.dialogExtentCancel = function() {
					$aut('#map_setExtent').remove();
					_self.hiddenMap('gcaut-hidden');
					_self.isExtentDialogOpen(false);
				};
				
				// create the inside of the extent dialog window
				_self.setExtent = function(type) {
					var size = { width:_self.mapWidthValue(),
									height: _self.mapHeightValue()
							},
						holder = [_self.setExtentMinX,
									_self.setExtentMinY,
									_self.setExtentMaxX,
									_self.setExtentMaxY];

					// show window to select extent
					_self.extentType(type);
					_self.isExtentDialogOpen(true);
					_self.hiddenMap('');

					// create the map
					gisM.createMap('map_setExtent',
									_self.selectBaseLayerType().id,
									_self.bases()[0].url,
									size,
									holder);
				};
				
				// set the service name from the localstorage when layer's type change
				setServName = function(id) {
					var array;
					
					if (id === 1) {
						array = localStorage.servnameWMS.split(';');
					} else if (id === 2)  {
						array = localStorage.servnameWMTS.split(';');
					} else if (id === 3)  {
						array = localStorage.servnameCacheREST.split(';');
					} else if (id === 4)  {
						array = localStorage.servnameDynamicREST.split(';');
					}
					
					_self.layerURL('');
					_self.baseURL('');
					return array;
				};

				// when the remove layer icon is click, remove the layer from the array
				_self.removeLayer = function(type) {
					if (type === 'base') {
						_self.bases.remove(this);
					} else {
						_self.layers.remove(this);
					}
				};

				// when one item in the autocomple is selected, update the input text
				_self.setURL = function(event, ui) {

					if (_self.bases().length === 0) {
						_self.baseURL(ui.item.value);
					} else {
						_self.layerURL(ui.item.value);
					}

					return false;
				};

				// launch when url validation button is push
				_self.validateURL = function(type) {
					var isValid,
						category,
						layerURL, baseURL,
						layerType;

					typeObject = type;
					if (type === 'base') {
						_self.isLayer(false);
						urlObject = _self.baseURL;
						category = _self.selectBaseLayerType().id;
						baseURL = _self.baseURL();
						layerType = _self.selectBaseLayerType().id;
					} else {
						_self.isLayer(true);
						urlObject = _self.layerURL;
						category = _self.selectLayerType().id;
						layerURL = _self.layerURL();
						layerType = _self.selectLayerType().id;
					}

					// remove duplicate in service array and copy to localstorage
					_self.availServ(ko.utils.arrayGetDistinctValues(_self.availServ()));
					if (layerType === 1) {
						localStorage.setItem('servnameWMS', _self.availServ().join(';'));
					} else if (layerType === 2)  {
						localStorage.setItem('servnameWMTS', _self.availServ().join(';'));
					} else if (layerType === 3)  {
						localStorage.setItem('servnameCacheREST', _self.availServ().join(';'));
					} else if (layerType === 4)  {
						localStorage.setItem('servnameDynamicREST', _self.availServ().join(';'));
					}

					// check the url
					isValid = gcautFunc.checkFormatURL(urlObject(), category);

					// clean error message
					_self.errortext('');

					if (isValid) {
						// get service info and validateURL as callback function
						gisServInfo.getResourceInfo(urlObject(), readServInfo, function() { _self.errortext(_self.txtLayerErr); });

					} else {
						_self.errortext(_self.txtLayerErr);
					}
				};
				
				// callback function for gisServInfo.getResourceInfo
				readServInfo = function(sender) {
					if (sender.hasOwnProperty('layers')) {
						esriData.readInfo(sender, _self, urlObject(), typeObject);

						// show window to select layers
						_self.isLayerDialogOpen(true);
						_self.hiddenLayer('');
					} else if (sender.hasOwnProperty('error')) {
						_self.errortext(_self.txtLayerErr);
					}
				};

				_self.updateOrder = function() {
					// reorder layers array after sort
					var text,
						$elems = $aut('#layersorder').find('.layerTitle'),
						len = $elems.length,
						tmpLayers = [];
					
					while (len--) {
						text = $($elems[len]).text();
						tmpLayers.push(gcautFunc.getObject(_self.layers(), 'id', text));
					}
					
					_self.layers(tmpLayers);
				};
				
				_self.write = function() {
					var value,
						lod,
						layer,
						strbase = '',
						strlods = '',
						strlayers = '',
						sr = -1,
						lenlods = _self.lods().length,
						lenlayers = _self.layers().length,
						lods = _self.lods.reverse(),
						layers = _self.layers.reverse(),
						base = _self.bases()[0];


					if (typeof base !== 'undefined') {
						strbase = '{' +
										'"id": "' + base.id + '",' +
										'"type": ' + base.type + ',' +
										'"url": "' + base.url + '"' +
									'}';
					}

					while (lenlods--) {
						lod = lods[lenlods];
						strlods += '{' +
										'"level": ' + lod.level + ',' +
										'"resolution": ' + lod.resolution + ',' +
										'"check": ' + lod.check +
									'},';
					}

					if (strlods.length > 0) {
						strlods = strlods.slice(0, -1);
					}

					if (lenlayers > 0) {
						while (lenlayers--) {
							layer = layers[lenlayers];
							strlayers += '{' +
											'"id": "' + layer.id + '",' +
											'"type": ' + layer.type + ',' +
											'"url": "' + layer.url + '",' +
											'"scale": {' +
												'"min": ' + layer.scale.min + ',' +
												'"max": ' + layer.scale.max +
											'}' +
										'},';
						}
						strlayers = strlayers.slice(0, -1);
					}

					// check if value are undefined
					if (_self.selectMapSR() !== undefined) {
						sr = _self.selectMapSR().id;
					}
					
					value = '"mapframe": {' +
								'"size": {' +
									'"height": ' + _self.mapHeightValue() + ',' +
									'"width": ' + _self.mapWidthValue() +
								'},' +
								'"map": {' +
									'"sr": {' +
										'"wkid": ' + sr +
									'},' +
									'"extentmax": {' +
										'"xmin": ' + _self.maxExtentMinX() + ',' +
										'"ymin": ' + _self.maxExtentMinY() + ',' +
										'"xmax": ' + _self.maxExtentMaxX() + ',' +
										'"ymax": ' + _self.maxExtentMaxY() +
									'},' +
									'"extentinit": {' +
										'"xmin": ' + _self.initExtentMinX() + ',' +
										'"ymin": ' + _self.initExtentMinY() + ',' +
										'"xmax": ' + _self.initExtentMaxX() + ',' +
										'"ymax": ' + _self.initExtentMaxY() +
									'},' +
									'"lods": {' +
										'"enable": ' + _self.isLods() + ',' +
										'"values": [' + strlods + ']' +
									'},' +
									'"link": ' + _self.isLink() + ',' +
									'"bases": [' + strbase + '],' +
									'"layers": ['+ strlayers + ']' +
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

		clean = function(ko, elem) {
			// clean (each tab) and remove node in foreach array binding
			ko.cleanNode(elem);
		};

		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
