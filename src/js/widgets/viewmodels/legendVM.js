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

		initialize = function(elem, map) {

			// data model
			var legendViewModel = function(elem, map) {
				var _self = this;

				// label
				_self.lblUrlGeomServer = i18n.getDict('%footer-urlGeomServer');
				_self.lblEnbArrow = i18n.getDict('%footer-arrow');
				_self.lblArrowSR = i18n.getDict('%footer-arrowSR');
				_self.lblEnbMouse = i18n.getDict('%footer-mouse');
				_self.lblMouseSR = i18n.getDict('%footer-mouseSR');
				_self.lblSelectItem = i18n.getDict('%selectItem');

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

					return value;
				};

				_self.init();
			};

			vm = new legendViewModel(elem, map);
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
