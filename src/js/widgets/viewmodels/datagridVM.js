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
			'gcaut-func'
	], function($aut, ko, i18n, gcautFunc) {
		var initialize,
			clean,
			vm;

		initialize = function(elem, map, controls) {

			// data model
			var datagridViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					grid = map.grid;

				// label
				_self.lblEnable = i18n.getDict('%datagrid-enable');
				_self.lblLayerSelect = i18n.getDict('%datagrid-layerselect');
				_self.lblLink = i18n.getDict('%datagrid-link');
				_self.lblPopup = i18n.getDict('%datagrid-popup');

				// enable
				_self.isEnable = ko.observable(map.enable);

				// select layer
				_self.layerList = ko.observableArray([]);
				_self.selectLayer = ko.observable();

				// layers
				_self.layers = ko.observableArray(map.layers);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.addLayer = function(item) {
					var layerInfo = item.layerinfo,
						fields = item.fields,
						popups = item.popups,
						hover = item.hover;

					// title
					item.title = ko.observable(item.title);

					// layerinfo
					item.layerinfo.id = ko.observable(layerInfo.id);
					item.layerinfo.type = ko.observable(layerInfo.type);
					item.layerinfo.index = ko.observable(layerInfo.index);

					// fields
					item.fields.title = ko.observable(fields.title);
					item.fields.width = ko.observable(fields.width);
					item.fields.data = ko.observable(fields.data);
					item.fields.dataalias = ko.observable(fields.dataalias);

					// linktable
					item.linktable.enable = ko.observable(item.linktable.enable);

					// popups
					item.popups.enable = ko.observable(popups.enable);
					item.popups.layeralias = ko.observable(popups.layeralias);

					// hover
					item.hover.enable = ko.observable(hover.enable);
					item.hover.hoverfield = ko.observable(hover.hoverfield);

					return item;
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
								',"layers": []' +
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
