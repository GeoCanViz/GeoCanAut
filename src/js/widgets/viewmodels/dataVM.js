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
			var dataViewModel = function(elem, map) {
				var _self = this;

				// label
				_self.lblEnable = i18n.getDict('%data-enable');
				_self.lblExpand = i18n.getDict('%expand');
				_self.lblFile = i18n.getDict('%data-file');
				_self.lblURL = i18n.getDict('%data-url');
				_self.lblQuery = i18n.getDict('%data-query');

				// enable and expand
				_self.isEnable = ko.observable(map.enable);
				_self.isExpand = ko.observable(map.expand);

				// toolbar position
				_self.pos = ko.observable(map.pos);

				// file layer
				_self.isFile = ko.observable(map.datafile.enable);

				// url layer
				_self.isURL = ko.observable(map.dataurl.enable);

				// query layers from url
				_self.isQuery = ko.observable(map.dataquery.enable);

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
								',"pos": ' + _self.pos() +
								',"datafile": {' +
									'"enable": ' + _self.isFile() +
								'}' +
								',"dataurl": {' +
									'"enable": ' + _self.isURL() +
								'}' +
								',"dataquery": {' +
									'"enable": ' + _self.isQuery() +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new dataViewModel(elem, map);
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
