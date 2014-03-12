/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Legend view model widget
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
			var legendViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length;

				// label
				_self.lblEnable = i18n.getDict('%legend-enable');
				_self.lblExpand = i18n.getDict('%expand');
				
				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);
				
				// legend layers
				_self.legendLayers = ko.observableArray(map.items);
				
				// functions to create observable from the legend items
				_self.createArray = function(item) {
					ko.utils.arrayForEach(item.items(), function(item) {
						item.id = ko.observable(item.id);
						item.items = ko.observableArray(item.items);
					
						_self.createArray(item);
					});
				};

				ko.utils.arrayForEach(_self.legendLayers(), function(item) {
					item.id = ko.observable(item.id);
					item.items = ko.observableArray(item.items);
					
					_self.createArray(item);
				});
				
				// mapSR object from map view model to be able to subscribe to change event with a custom
				// binding
				while (lenControls--) {
					_self[controls[lenControls].id] = controls[lenControls].value;
				}
				
				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.updateLayers = function(value) {
					
					var obj,
						len = value.length;
					while (len--) {
						value[len].split = obj.id.split('/');
					}
					
					value = [{ id: 'a', legendLayers: [{ id: 'b', items: [] }] }];
					_self.legendLayers(value);
					
					
					
					// create observable from map.layers
					ko.utils.arrayForEach(_self.legendLayers(), function(item) {
						item.id = ko.observable(item.id);
						item.items = ko.observableArray(item.items);
					
						_self.createArray(item);
					});
				};
				
				_self.write = function() {
					var value;

					value = '"toolbarlegend": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"item": [' + ']' +
							'}';

					return value;
				};

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
