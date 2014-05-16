/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Legend view model widget
 */
/* global locationPath: false */
(function() {
    'use strict';
    define(['jquery-private',
			'knockout',
			'gcaut-i18n',
			'gcaut-func',
			'gcaut-gisservinfo'
	], function($aut, ko, i18n, gcautFunc, gisServInfo) {
		var initialize,
			clean,
			createItem,
			addArray,
			vm;

		initialize = function(elem, map, controls) {

			// data model
			var legendViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					visibilityType = gcautFunc.getListCB(i18n.getDict('%legend-visibilitytypelist')),
					layerType = gcautFunc.getListCB(i18n.getDict('%map-layertypelist')),
					pathOpen = locationPath + 'gcaut/images/legendOpen.png',
					pathAddGroup = locationPath + 'gcaut/images/legendOpen.png';

				// images path
				_self.imgOpen = pathOpen;
				_self.imgAddGroup = pathAddGroup;

				// error message
				_self.msgOpacity = i18n.getDict('%legend-msgopacity');

				// label
				_self.lblReset = i18n.getDict('%reset');
				_self.lblRemove = i18n.getDict('%remove');
				_self.lblEnable = i18n.getDict('%legend-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblItemExpand = i18n.getDict('%legend-expand');
				_self.lblLabel = i18n.getDict('%legend-label');
				_self.lblMeta = i18n.getDict('%legend-metadata');
				_self.lblMetaUrl = i18n.getDict('%legend-metaurl');
				_self.lblMetaText = i18n.getDict('%legend-metatext');
				_self.lblOpacity = i18n.getDict('%legend-opacity');
				_self.lblOpacityInit = i18n.getDict('%legend-opacityinit');
				_self.lblOpacityMin = i18n.getDict('%minimum');
				_self.lblOpacityMax = i18n.getDict('%maximum');
				_self.lblVisibility = i18n.getDict('%legend-visibility');
				_self.lblVisibilityState = i18n.getDict('%legend-visibilitystate');
				_self.lblVisibilityType = i18n.getDict('%legend-visibilitytype');
				_self.lblVisibilityRadio = i18n.getDict('%legend-visibilityradioid');
				_self.lblDisplayChild = i18n.getDict('%legend-displaychild');
				_self.lblDisplayChildSymbol = i18n.getDict('%legend-displaychildsymbol');
				_self.lblCustomImage = i18n.getDict('%legend-customimage');
				_self.lblCustomImageUrl = i18n.getDict('%legend-customimageurl');
				_self.lblCustomImageText = i18n.getDict('%legend-customimagetext');
				_self.lblSectBases = i18n.getDict('%legend-sectbases');
				_self.lblSectLayers = i18n.getDict('%legend-sectlayers');
				_self.lblEmptyGrp = i18n.getDict('%legend-emptygrp');

				// dialog window
				_self.lblResetTitle = i18n.getDict('%legend-titlereset');
				_self.lblResetText = i18n.getDict('%legend-txtreset');

				// tooltip
				_self.tpRefresh = i18n.getDict('%projheader-tpnewmap');

				// class
				_self.hiddenReset = ko.observable('gcaut-hidden');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// visibility
				_self.visibilityType = visibilityType;

				// global opacity value to update children
				_self.opacityValue = false;

				// layer type array
				_self.layerType = layerType;

				// legend layers and bases
				_self.holderLayers = map.items;
				_self.legendLayers = ko.observableArray(map.items);
				_self.holderBases = map.basemaps;
				_self.legendBases = ko.observableArray(map.basemaps);

				// array to create legend after reset
				_self.itemsBases = ko.observableArray();
				_self.itemsLayers = ko.observableArray();

				// init warning
				_self.isResetDialogOpen = ko.observable();

				// functions to create observable from the legend items
				_self.updateInitState = function(value, element) {
					if (!value) {
						element(true);
					}
				};

				_self.updateCustom = function(value, element) {
					if (value) {
						element(false);
					}
				};

				_self.updateOpacity = function(value, element) {
					_self.opacityValue = value;
					_self.updateOpacityChild(element, value);
				};

				_self.updateOpacityChild = function(item) {
					ko.utils.arrayForEach(item, function(item) {
						if (_self.opacityValue) {
							item.opacity.enable(false);
							item.opacity.canenable(false);
						} else {
							item.opacity.canenable(true);
						}
						_self.updateOpacityChild(item.items());
					});
				};

				createItem = function(item) {
					var label = item.label,
						metadata = item.metadata,
						opacity = item.opacity,
						visibility = item.visibility,
						displaychild = item.displaychild,
						customimage = item.customimage,
						opacityGlobal = opacity.enable;

					item.expand = ko.observable(item.expand);
					item.last = ko.observable(item.last);
					item.type = ko.observable(item.type);
					item.id = ko.observable(item.id);
					item.graphid = ko.observable(item.graphid);
					item.displayfields = ko.observable(item.displayfields),
					item.label.value = ko.observable(label.value);
					item.label.alttext = ko.observable(label.alttext);
					item.metadata.enable = ko.observable(metadata.enable);
					item.metadata.value = ko.observable(metadata.value);
					item.metadata.alttext = ko.observable(metadata.alttext);
					item.opacity.enable = ko.observable(opacity.enable);
					item.opacity.canenable = ko.observable(_self.opacityValue);
					item.opacity.min = ko.observable(opacity.min).extend({ numeric: { precision: 2 } });
					item.opacity.max = ko.observable(opacity.max).extend({ numeric: { precision: 2 } });
					item.opacity.initstate = ko.observable(opacity.initstate).extend({ numeric: { precision: 2, validation: { min: item.opacity.min, max: item.opacity.max, id: 'msg_opacityInit' + item.graphid(), msg: _self.msgOpacity } } });
					item.visibility.enable = ko.observable(visibility.enable);
					item.visibility.initstate = ko.observable(visibility.initstate);
					item.visibility.type = ko.observable(_self.visibilityType[visibility.type - 1]);
					item.visibility.radioid = ko.observable(visibility.radioid).extend({ numeric: { precision: 0 } });
					item.displaychild.enable = ko.observable(displaychild.enable);
					item.displaychild.symbol = ko.observable(displaychild.symbol);
					item.customimage.enable = ko.observable(customimage.enable);
					item.customimage.url = ko.observable(customimage.url);
					item.customimage.alttext = ko.observable(customimage.alttext);
					item.items = ko.observableArray(item.items);

					// subscribe to change on visibility.enable because if it is false
					// visibility.initstate should be true
					item.visibility.enable.subscribe(function() {
						_self.updateInitState(item.visibility.enable(), item.visibility.initstate);
					});

					// subscribe to change on displaychils because if it is true
					// customimage.enable should be false
					item.displaychild.enable.subscribe(function() {
						_self.updateCustom(item.displaychild.enable(), item.customimage.enable);
					});

					// subscribe to change on opacity.enable because if it is true
					// opacity.enable of every child should be false
					item.opacity.enable.subscribe(function() {
						_self.updateOpacity(item.opacity.enable(), item.items());
					});

					// disable opacity checkbox for child if parent is true
					if (opacityGlobal) {
						_self.opacityValue = false;
					}

					return item;
				};

				_self.createArray = function(item) {
					ko.utils.arrayForEach(item.items(), function(item) {
						item = createItem(item);
						_self.createArray(item);
					});
				};

				ko.utils.arrayForEach(_self.legendLayers(), function(item) {
					_self.opacityValue = true;
					item = createItem(item);
					_self.createArray(item);
				});

				ko.utils.arrayForEach(_self.legendBases(), function(item) {
					_self.opacityValue = true;
					item = createItem(item);
					_self.createArray(item);
				});

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					// refresh ui and bind the update event
					// set timeout to have the object created before we assign
					// events
					setTimeout(function() {
						var	$accBases = $aut('.legendSortBases'),
							$accLayers = $aut('.legendSortLayers');

						$accBases.accordion('refresh');
						$accBases.on('sortupdate', gcautFunc.debounce(function() {
																_self.sortArray($accBases);
															}, 250, false));
						$accLayers.accordion('refresh');
						$accLayers.on('sortupdate', gcautFunc.debounce(function() {
																_self.sortArray($aut('.legendSortLayers-lvl1'));
															}, 250, false));
					}, 500);

					// destroy dialog box we need to do this because it disapears from elem
					clean(ko, $aut('#legend_reset')[0]);

					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				// get the selected layer value from index
				_self.getLayerType = function(data) {
					return gcautFunc.getListValue(_self.layerType, data.type());
				};

				_self.resetArray = function(list, section) {
					var arr, id, lensplit, url, value, last, type, items,
						values = (typeof list === 'undefined') ? [] : list,
						split = [],
						len = values.length - 1,
						i = 0, j = 0;

					// we need to set the array in function of the section
					if (section === 'bases') {
						_self.legendBases([]);
						_self.itemsBases([]);
						items = _self.itemsBases;
					} else if (section === 'layers') {
						_self.legendLayers([]);
						_self.itemsLayers([]);
						items = _self.itemsLayers;
					}

					while (i <= len) {
						value = values[i];
						id = value.id;
						url = value.url;
						type = value.type;
						split = value.label.split('***');
						lensplit = split.length - 1;
						j = 0;

						if (type === 5 || type === 2) {
							// check if the item already exist. If not create a new one and
							// if it exsit return the reference.
							last = (lensplit === 0) ? true : false;
							arr = _self.unique(items, split[0], id, last, url, type);
							j++;

							while (j <= lensplit) {
								last = (j === lensplit) ? true : false;
								arr = _self.unique(arr.items, split[j], id, last, url, type);
								j++;
							}
						} else if (type === 4) {
							gisServInfo.getEsriServRendererInfo(items, url, id, _self.esriDymanicServ);
						}

						i++;
					}
				};

				_self.updateLayers = function(value) {
					_self.holderLayers = value;
				};

				_self.updateBases = function(value) {
					_self.holderBases = value;
				};

				_self.esriDymanicServ = function(items, url, id, layers) {
					var layer,
						firstIndex, lastIndex, name,
						i = 0,
						len = layers.length - 1;

					// create the first holder
					lastIndex = url.lastIndexOf('/');
					url = url.substring(0, lastIndex);
					firstIndex = url.lastIndexOf('/') + 1;
					name = url.substring(firstIndex, lastIndex);
					items.push(addArray(name, name, false, '', 4));
					items = items()[items().length - 1].items;

					// create children. Author cant see them because it is a service so it is not customizable
					// but we need the info for gcviz.
					while (i !== len) {
						layer = layers[i];
						i++;

						if (layer.type === 'Feature Layer' && layer.parentLayer === null) {
							items.push(addArray(layer.name, id, true, '', 4, layer.drawingInfo.renderer));
						} else if (layer.type === 'Group Layer' && layer.parentLayer === null) {
							items.push(addArray(layer.name, id, false, '', 4));
							_self.esriDynamicSublayer(items()[items().length - 1].items, layer.subLayers, id, layers);
						}
					}

					// set visibility checkbox false for every child because there is one only on the first level
					// and by default it is set to true when we create the array
					_self.esriDynamicVis(items());
				};

				_self.esriDynamicVis = function(items) {
					var item,
						len = items.length;

					while (len--) {
						item = items[len];
						item.visibility.enable(false);
						_self.esriDynamicVis(item.items());
					}
				};

				_self.esriDynamicSublayer = function(items, arrSublayers, id, layers) {
					var layer, foundLayer, name,
						sublayers = arrSublayers.reverse(),
						len = sublayers.length;

					while (len--) {
						layer = sublayers[len];

						// find the element with the same id and remove it
						// from the array of layers
						foundLayer = layers[layer.id];
						name = foundLayer.name;

						if (foundLayer.type === 'Feature Layer') {
							items.push(addArray(name, id, true, '', 4, foundLayer.drawingInfo.renderer));
						} else if (foundLayer.type === 'Group Layer') {
							items.push(addArray(name, id, false, '', 4));
							_self.esriDynamicSublayer(items()[items().length - 1].items, foundLayer.subLayers, id, layers);
						}
					}
				};

				_self.unique = function(items, value, id, last, url, type) {
					var item,
						len = items().length;

					while (len--) {
						item = items()[len];

						if (item.label.value() === value) {
							// the item exist, return the reference
							return item;
						}
					}

					// the item does not exist so create a new one
					items.push(addArray(value, id, last, url, type));
					return items()[items().length - 1];
				};

				addArray = function(value, id, last, url, type, renderer) {
					var item;

					item = { expand : ko.observable(false),
								last: ko.observable(last),
								type: ko.observable(type),
								id: ko.observable(id),
								graphid: ko.observable(gcautFunc.getUUID()),
								displayfields: ko.observable(false),
								label: {
									value: ko.observable(value),
									alttext: ko.observable(value)
								},
								metadata: {
									enable: ko.observable(false),
									value: ko.observable(),
									alttext: ko.observable()
								},
								opacity: {
									enable: ko.observable(false),
									canenable: ko.observable(true),
									min: ko.observable(0).extend({ numeric: { precision: 2 } }),
									max: ko.observable(100).extend({ numeric: { precision: 2 } })
								},
								visibility: {
									enable: ko.observable(true),
									initstate: ko.observable(true),
									type: ko.observable(_self.visibilityType[0]),
									radioid: ko.observable().extend({ numeric: { precision: 0 } })
								},
								displaychild: {
									enable: ko.observable(true),
									symbol: ko.observable()
								},
								customimage: {
									enable: ko.observable(false),
									url: ko.observable(),
									alttext: ko.observable()
								},
								items: ko.observableArray()
							};

					// add the initila opacity outside object because it reference observable inside it
					item.opacity.initstate = ko.observable(1).extend({ numeric: { precision: 2, validation: { min: item.opacity.min, max: item.opacity.max, id: 'msg_opacityInit' + item.graphid(), msg: _self.msgOpacity } } });

					// set renderer
					if (last && typeof renderer === 'undefined') {
						gisServInfo.getEsriRendererInfo(url, item);
					} else if (last && typeof renderer !== 'undefined') {
						item.displaychild.symbol(JSON.stringify(renderer));
					}

					// subscribe to change on visibility.enable because if it is false
					// visibility.initstate should be true
					item.visibility.enable.subscribe(function() {
						_self.updateInitState(item.visibility.enable(), item.visibility.initstate);
					});

					// subscribe to change on displaychils because if it is true
					// customimage.enable should be false
					item.displaychild.enable.subscribe(function() {
						_self.updateCustom(item.displaychild.enable(), item.customimage.enable);
					});

					// subscribe to change on opacity.enable because if it is true
					// opacity.enable of every child should be false
					item.opacity.enable.subscribe(function() {
						_self.updateOpacity(item.opacity.enable(), item.items());
					});

					return item;
				};

				// when the remove layer icon is click, remove the base from the array
				_self.removeBase = function(parent, item) {
					_self.removeItem(parent, _self.legendBases, item);

					// refresh ui
					$aut('.legendSortBases').accordion('refresh');
				};

				// when the remove layer icon is click, remove the layer from the array
				_self.removeLayer = function(parent, item) {
					_self.removeItem(parent, _self.legendLayers, item);

					// refresh ui
					$aut('.legendSortLayers').accordion('refresh');
				};

				_self.removeItem = function(parent, array, item) {
					var len = parent.length - 1;

					if (len === 0) {
						array.remove(item);
					} else {
						parent[0].items.remove(item);
					}
				};

				_self.sortArray = function(item) {
					var tree,
						lenOri, lenFlat,
						values, data,
						flat = [];

					// get the tree from html accordion structure
					tree = _self.getArrayHTML($aut(item));

					// flattened versions of the items
					lenOri = _self.legendLayers().length;
					while (lenOri--) {
						flat = _self.addFlatChildren(_self.legendLayers, flat);
					}

					// remove child items in flat array
					lenFlat = flat.length;
					while (lenFlat--) {
						flat[lenFlat].items([]);
					}

					// update the legendLayers or legendBases
					values = _self.updateArrayRec(tree, flat, ko.observableArray([]));
					_self.legendLayers(values());

					// dirty refresh the array to notify the changes			
					data = _self.legendLayers().slice(0);
					_self.legendLayers([]);
					_self.legendLayers(data);

					// refresh ui
					$aut('.legendSortLayers').accordion('refresh');
				};

				// to be called recursively to flatten the array
				_self.addFlatChildren = function(array, result) {
					var val;

					array = ko.utils.unwrapObservable(array);
					if (array) {
						for (var i = 0, j = array.length; i < j; i++) {
							val = array[i];
							result.push(val);
							_self.addFlatChildren(val.items, result);
						}
					}

					return result;
				};

				// get item from flatten array
				_self.getObject = function(items, graphid) {
					var item,
						len = items.length;

					while (len--) {
						item = items[len];
						if (graphid === item.graphid()) {
							return item;
						}
					}
				};

				// to be called recursively to create the tree of label id from html
				_self.getArrayHTML = function(item) {
					var child,
						grapid,
						grapids = [],
						children = $aut(item).children(),
						len = children.length;

					while (len--) {
						child = $aut(children[len]);
						grapid = { graphid: $aut(child.find('h3').find('span')[1]).attr('id') };
						grapid.graphids = _self.getArrayHTML(child.children('div').children('.inner-layer-list').children('ul'));
						grapids.push(grapid);
					}

					return grapids;
				};

				_self.updateArrayRec = function(tree, array, values) {
					var item,
						i = 0,
						len = tree.length;

					while (len--) {
						item = tree[len];

						if (item.graphids.length === 0) {
							values.push(_self.getObject(array, item.graphid));
						} else {
							values().push(_self.getObject(array, item.graphid));
							_self.updateArrayRec(item.graphids, array, values()[i].items);
						}
						i++;
					}

					return values;
				};

				_self.openCloseAll = function(data, event) {
					var id = $aut(event.target.parentElement.parentElement).attr('id'),
						$node = $aut(event.target.parentElement.parentElement.parentElement),
						$masterHead = $node.find('#' + id),
						$masterBody = $node.find('#' + id.replace('header', 'panel')),
						$head = $masterBody.find('li > h3'),
						$body = $masterBody.find('li > div');

					if ($masterHead.hasClass('ui-accordion-header-active')) {
						// close
						$masterHead.removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({ 'aria-selected': 'false', 'tabindex': '-1' });
						$masterHead.find('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
						$masterBody.removeClass('ui-accordion-content-active').attr({ 'aria-expanded': 'false', 'aria-hidden': 'true' }).hide();
						$head.removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({ 'aria-selected': 'false', 'tabindex': '-1' });
						$head.find('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
						$body.removeClass('ui-accordion-content-active').attr({ 'aria-expanded': 'false', 'aria-hidden': 'true' }).hide();
					} else {
						// open
						$masterHead.removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({ 'aria-selected': 'true', 'tabindex': '0' });
						$masterHead.find('.ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
						$masterBody.addClass('ui-accordion-content-active').attr({ 'aria-expanded': 'true', 'aria-hidden': 'false' }).show();
						$head.removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({ 'aria-selected': 'true', 'tabindex': '0' });
						$head.find('.ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
						$body.addClass('ui-accordion-content-active').attr({ 'aria-expanded': 'true', 'aria-hidden': 'false' }).show();
					}

					event.preventDefault();
				};

				_self.createEmptyGrp = function() {
					var item = addArray(_self.lblEmptyGrp, gcautFunc.getUUID(), false, '', 0);
					_self.legendLayers.push(item);

					// refresh ui
					$aut('.legendSortLayers').accordion('refresh');
				};

				_self.reset = function() {
					_self.isResetDialogOpen(true);
					_self.hiddenReset('');
				};

				// reset legend dialog buttons functions (ok and cancel)
				_self.dialogResetOk = function() {
					_self.resetArray(_self.holderBases, 'bases');
					_self.resetArray(_self.holderLayers, 'layers');

					// we need a timeout because many function updates the array at the same time
					// and we dont know when they finish
					setTimeout(function() {
						// reset bases and layers
						_self.legendBases(_self.itemsBases());
						_self.legendLayers(_self.itemsLayers());

						// refresh ui
						$aut('.legendSortBases').accordion('refresh');
						$aut('.legendSortLayers').accordion('refresh');

						_self.dialogResetCancel();
					}, 1000);
				};

				_self.dialogResetCancel = function() {
					_self.hiddenReset('gcaut-hidden');
					_self.isResetDialogOpen(false);
				};

				_self.write = function() {
					var value,
						basesItems,
						layersItems;

					// remove value from the visibility type list
					basesItems = JSON.stringify(ko.toJS(_self.legendBases)).replace(/{"id":/g, '').replace(/,"val":"radio"}/g, '').replace(/,"val":"case"}/g, '');
					layersItems = JSON.stringify(ko.toJS(_self.legendLayers)).replace(/{"id":/g, '').replace(/,"val":"radio"}/g, '').replace(/,"val":"case"}/g, '');

					// remove canenable from opacity because it is an internal value
					basesItems = basesItems.replace(/,"canenable":false/g, '').replace(/,"canenable":true/g, '');
					layersItems = layersItems.replace(/,"canenable":false/g, '').replace(/,"canenable":true/g, '');

					value = '"toolbarlegend": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"basemaps": ' + basesItems +
								',"items": ' + layersItems +
							'}';

					return value;
				};

				// object from other view model to be able to subscribe to change event with a custom
				// binding
				while (lenControls--) {
					controls[lenControls].value.subscribe(_self[controls[lenControls].func], _self);
				}

				_self.init();
			};

			vm = new legendViewModel(elem, map, controls);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};

		clean = function(ko, elem) {
			ko.cleanNode(elem);
		};

		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
