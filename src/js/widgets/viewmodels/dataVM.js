/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Data view model widget
 */
(function() {
    'use strict';
    define(['jquery-private',
			'knockout',
			'gcaut-i18n'
	], function($aut, ko, i18n) {
		var initialize,
			clean,
			vm;

		initialize = function(elem, map) {

			// data model
			var drawViewModel = function(elem, map) {
				var _self = this,
					data = map.data;

				// label
				_self.lblEnable = i18n.getDict('%data-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblCSV = i18n.getDict('%data-csv');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// csv
				_self.isCSV = ko.observable(data.enable);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.write = function() {
					var value;

					value = '"toolbardata": {' +
								'"enable": ' + _self.isEnable() +
								',"expand": ' + _self.isExpand() +
								',"data": {' +
									'"enable": ' + _self.isCSV() +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new drawViewModel(elem, map);
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
