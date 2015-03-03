/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Datagrid view model widget
 */
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
			vm;

		initialize = function(elem, map, controls) {

			// data model
			var datagridViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					grid = map.grid,
					seachType = gcautFunc.getListCB(i18n.getDict('%boollist'));

				// tooltip
				_self.tpAddLayer = i18n.getDict('%datagrid-tpaddlayer');

				// label
				_self.lblRemove = i18n.getDict('%remove');
				_self.lblEnable = i18n.getDict('%datagrid-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblLayerSelect = i18n.getDict('%datagrid-layerselect');
				_self.lblTitle = i18n.getDict('%datagrid-title');
				_self.lblIndex = i18n.getDict('%datagrid-index');
				_self.lblSearchAll = i18n.getDict('%datagrid-searchall');
				_self.lblFieldEnable = i18n.getDict('%datagrid-fieldenable');
				_self.lblFieldWidth = i18n.getDict('%datagrid-fieldwidth');
				_self.lblFieldData = i18n.getDict('%datagrid-fielddata');
				_self.lblFieldAlias = i18n.getDict('%datagrid-fieldalias');
				_self.lblFieldSearch = i18n.getDict('%datagrid-fieldsearch');
				_self.lblLink = i18n.getDict('%datagrid-link');
				_self.lblLinkRel = i18n.getDict('%datagrid-linkrel');
				_self.lblLinkTitle = i18n.getDict('%datagrid-linktitle');
				_self.lblLinkSubTitle = i18n.getDict('%datagrid-linksubtitle');
				_self.lblPopup = i18n.getDict('%datagrid-popup');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// select layer
				_self.layerList = ko.observableArray([]);
				_self.selectLayer = ko.observable();

				// layers
				_self.layers = ko.observableArray(map.layers);

				// functions to create observable on layers
				ko.utils.arrayForEach(_self.layers(), function(item) {
					var field, link,
						layerInfo = item.layerinfo,
						fields = item.fields,
						links = item.linktable,
						linksFields = links.fields,
						popups = item.popups,
						hover = item.hover,
						lenFields = fields.length,
						lenLinks = links.fields.length;

					// layerinfo
					item.layerinfo.id = ko.observable(layerInfo.id);
					item.layerinfo.type = ko.observable(layerInfo.type);
					item.layerinfo.index = ko.observable(layerInfo.index).extend({ numeric: { precision: 0 } });

					// title
					item.title = ko.observable(item.title);

					// search all table
					item.globalsearch = ko.observable(item.globalsearch);

					// fields
					item.fields = ko.observableArray([]);
					while (lenFields--) {
						field = fields[lenFields];
						field.enable = ko.observable(field.enable);
						field.title = ko.observable(field.title);
						field.width = ko.observable(field.width);
						field.data = ko.observable(field.data);
						field.dataalias = ko.observable(field.dataalias);
						field.searchable = ko.observable(field.searchable);
						item.fields.push(field);
					}

					// linktable
					item.linktable.enable = ko.observable(links.enable);
					item.linktable.relationshipid = ko.observable(links.relationshipid).extend({ numeric: { precision: 0 } });
					item.linktable.title = ko.observable(links.title);
					item.linktable.subtitle = ko.observable(links.subtitle);

					// link fields
					item.linktable.fields = ko.observableArray([]);
					while (lenLinks--) {
						link = linksFields[lenLinks];
						link.enable = ko.observable(link.enable);
						link.title = ko.observable(link.title);
						link.data = ko.observable(link.data);
						item.linktable.fields.push(link);
					}

					// popups
					item.popups.enable = ko.observable(popups.enable);
					item.popups.layeralias = ko.observable(popups.layeralias);

					// hover
					item.hover.enable = ko.observable(hover.enable);
					item.hover.hoverfield = ko.observable(hover.hoverfield);
				});

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.addLayer = function() {
					var $accLayers, $accLayersF, $accLayersL,
						url, type, layer,
						jsonLayer,
						layerInfo, linkTable, popUps, hoverInfo,
						fieldInfo, field, fields, lenFields,
						item = { },
						id = _self.selectLayer().id,
						layers = gcautFunc.getElemValueVM('map', 'layers'),
						len = layers.length;

					// get url and type from array of layer
					while (len--) {
						layer = layers[len];

						if (id === layer.id) {
							url = layer.url;
							type = layer.type;
						}
					}

					// get info from the service
					jsonLayer = $aut.parseJSON(gisServInfo.getRestServiceInformation(url).responseText);

					// layerinfo
					layerInfo = { };
					layerInfo.id = ko.observable(id);
					layerInfo.type = ko.observable(type);
					layerInfo.index = ko.observable(0).extend({ numeric: { precision: 0 } });
					item.layerinfo = layerInfo;

					// title
					item.title = ko.observable(jsonLayer.name);

					// search all table
					item.globalsearch = ko.observable(false);

					// fields
					item.fields = ko.observableArray([]);
					fields = jsonLayer.fields;
					lenFields = fields.length;
					while (lenFields--) {
						fieldInfo = fields[lenFields];
						field = { };
						field.enable = ko.observable(false);
						field.title = ko.observable(fieldInfo.alias);
						field.width = ko.observable('');
						field.data = ko.observable(fieldInfo.name);
						field.dataalias = ko.observable(fieldInfo.alias);
						field.searchable = ko.observable(false);
						item.fields.push(field);
					}

					// linktable
					linkTable = { };
					linkTable.enable = ko.observable(false);
					linkTable.relationshipid = ko.observable(0).extend({ numeric: { precision: 0 } });
					linkTable.title = ko.observable('');
					linkTable.subtitle = ko.observable('');

					// link fields
					linkTable.fields = ko.observableArray([]);
					item.linktable = linkTable;

					// popups
					popUps = { };
					popUps.enable = ko.observable(false);
					popUps.layeralias = ko.observable(jsonLayer.name);
					item.popups = popUps;

					// hover
					hoverInfo = { };
					hoverInfo.enable = ko.observable(false);
					hoverInfo.hoverfield = ko.observable('');
					item.hover = hoverInfo;

					// push new layers to array
					_self.layers.push(item);

					// refresh ui
					$accLayers = $aut('.dgLayers');
					$accLayersF = $aut('.dgLayersFields');
					$accLayersL = $aut('.dgLayersLinks');
					$accLayers.accordion('refresh');
					$accLayersF.accordion('refresh');
					$accLayersL.accordion('refresh');
				};

				// when the remove layer icon is click, remove the layer from the array
				_self.removeLayer = function(parent, item) {
					_self.removeItem(parent, _self.layers, item);
				};

				_self.removeItem = function(parent, array, item) {
					var len = parent.length - 1;

					if (len === 0) {
						array.remove(item);
					} else {
						parent[0].items.remove(item);
					}
				};

				// this function is called each time layers in map vm is modified
				_self.updateLayers = function(value) {
					var item,
						valArr = [],
						len = value.length;

					// reset list
					_self.layerList([]);

					// loop trought layers and populate list
					while (len--) {
						item = value[len];
						valArr.push({ id: item.id, val: item.label });
					}
					_self.layerList(valArr);

					// select the first layer
					_self.selectLayer(_self.layerList()[0]);
				};

				_self.write = function() {
					var value;

					value = '"datagrid": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"layers": ' + JSON.stringify(ko.toJS(_self.layers)) +
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

			vm = new datagridViewModel(elem, map, controls);
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
