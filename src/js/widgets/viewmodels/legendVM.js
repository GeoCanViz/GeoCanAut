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
			createItem,
			addArray,
			vm;

		initialize = function(elem, map, controls) {

			// data model
			var legendViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length;

				// label
				_self.lblEnable = i18n.getDict('%legend-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblItemExpand = i18n.getDict('%legend-expand');
				_self.lblLabel = i18n.getDict('%legend-label');
				_self.lblMeta = i18n.getDict('%legend-metaenable');
				_self.lblMetaUrl = i18n.getDict('%legend-metaurl');
				_self.lblMetaText = i18n.getDict('%legend-metatext');
				
				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);
				
				// legend layers
				_self.legendLayers = ko.observableArray(map.items);
				
				// functions to create observable from the legend items
				createItem = function(item) {
					
					item.expand = ko.observable(item.expand);
					item.id = ko.observable(item.id);
					item.label.value = ko.observable(item.label.value);
					item.label.alttext = ko.observable(item.label.value);
					item.metadata.enable = ko.observable(item.metadata.enable);
					item.metadata.value = ko.observable(item.metadata.value);
					item.metadata.alttext = ko.observable(item.metadata.alttext);
					item.items = ko.observableArray(item.items);
					
					return item;
				};
				
				_self.createArray = function(item) {
					ko.utils.arrayForEach(item.items(), function(item) {
						item = createItem(item);
						_self.createArray(item);
					});
				};

				ko.utils.arrayForEach(_self.legendLayers(), function(item) {
					item = createItem(item);
					_self.createArray(item);
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

				_self.updateLayers = function(value) {

					var arr, tmp, lensplit,
						split = [],
						
						items = ko.observableArray(),
						len = value.length -1,
						i = 0, j = 0;
					
					while (i <= len) {
						tmp = value[i].id.replace(' / ', ' - ');
						split = tmp.split('/');
						lensplit = split.length - 1;
						j = 0;
							
						// check if the item already exist. If not create a new one and
						// if it exsit return the reference.
						arr = _self.unique(items, split[0]);
						j++;
						
						while (j <= lensplit) {
							arr = _self.unique(arr.items, split[j]);
							j++;
						}
				
						i++;
					}

					$("div.a").accordion({
						autoHeight: false,
						collapsible: true,
						active: false,
					});
					_self.legendLayers(items());
				};

				_self.unique = function(items, value) {
					var len = items().length;
					
					while (len--) {
						if (items()[len].id() === value) {
							// the item exist, return the reference
							return items()[len];
						}
					}
					
					// the item doesn not exist so create a new one
					items.push(addArray(value));
					return items()[items().length - 1];
				};
				
				addArray = function(value) {
					var item;
					
					item = { expand : ko.observable(false),
								id: ko.observable(value),
								label: {
									value: ko.observable(value),
									alttext: ko.observable(value)
								},
								metadata: {
									enable: ko.observable(false),
									value: ko.observable(),
									alttext: ko.observable()
								},
								items: ko.observableArray()
							};
					
					return item;
				};
				
				_self.write = function() {
					var value;

					value = '"toolbarlegend": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"items": ' + JSON.stringify(ko.toJS(_self.legendLayers)) +
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
