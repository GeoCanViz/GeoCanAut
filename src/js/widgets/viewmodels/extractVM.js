/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Extract view model widget
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
			var extractViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					grid = map.grid;

				// label
				_self.lblEnable = i18n.getDict('%extract-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblGrid = i18n.getDict('%extract-grid');
				_self.lblGridSelect = i18n.getDict('%extract-gridselect');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// toolbar position
				_self.pos = ko.observable(map.pos);

				// grid layer
				_self.isGrid = ko.observable(grid.enable);
				_self.gridId = ko.observable(grid.id);
				_self.gridList = ko.observableArray([]);
				_self.selectGrid = ko.observable();

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				// this function is called each time layers in map vm is modified
				_self.updateGrid = function(value) {
					var item,
						loop = 0,
						index = 0,
						gridId = _self.gridId(),
						valArr = [],
						len = value.length;

					// reset list
					_self.gridList([]);

					// loop trought layers and populate list
					while (len--) {
						item = value[len];
						valArr.push({ id: item.id, val: item.label });

						if (gridId === item.id) {
							index = loop;
						}
						loop++;
					}
					_self.gridList(valArr);

					// select the right layer
					_self.selectGrid(_self.gridList()[index]);
				};

				_self.setGridId = function() {
					var item = _self.selectGrid();

					if (typeof item !== 'undefined') {
						_self.gridId(item.id);
					}
				};

				_self.write = function() {
					var value;

					value = '"toolbarextract": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"pos": ' + _self.pos() +
								',"grid": {' +
									'"enable": ' + _self.isGrid() +
									',"id": "' + _self.selectGrid().id + '"' +
								'},' +
								'"items": []' +
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

			vm = new extractViewModel(elem, map, controls);
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
