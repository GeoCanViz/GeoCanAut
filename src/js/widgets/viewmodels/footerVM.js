/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Footer view model widget
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
			var footerViewModel = function(elem, map, controls) {
				var _self = this,
					lenControls = controls.length,
					arrow = map.northarrow,
					mouse = map.mousecoords,
					scalebar = map.scalebar,
					scalebarType = gcautFunc.getListCB(i18n.getDict('%nav-scalebarlist')),
					srType = gcautFunc.getSrType(i18n.getDict('%map-sr'));

				// label
				_self.lblEnbArrow = i18n.getDict('%footer-arrow');
				_self.lblArrowSR = i18n.getDict('%footer-arrowSR');
				_self.lblEnbMouse = i18n.getDict('%footer-mouse');
				_self.lblMouseSR = i18n.getDict('%footer-mouseSR');
				_self.lblSelectItem = i18n.getDict('%selectItem');
				_self.lblScalebar = i18n.getDict('%nav-scalebar');
				_self.lblScalebarUnit = i18n.getDict('%nav-scalebarunit');

				// north arrow
				_self.isArrow = ko.observable(arrow.enable);
				_self.arrowSR = srType;
				_self.selectArrowSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, arrow.inwkid)]);

				// mouse coordinates
				_self.isMouse = ko.observable(mouse.enable);
				_self.mouseSR = srType;
				_self.selectMouseSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, mouse.outwkid)]);

				// scalebar
				_self.isScalebar = ko.observable(scalebar.enable);
				_self.scalebarType = scalebarType;
				_self.selectScalebar = ko.observable(_self.scalebarType[scalebar.unit - 1]);

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				_self.updateSR = function(value) {
					_self.selectArrowSR(srType[gcautFunc.getSrTypeIndex(srType, value.id)]);
				};

				_self.write = function() {
					var value;

					value = '"footer": {' +
								'"northarrow": {' +
									'"enable": ' + _self.isArrow() +
									',"inwkid": ' + _self.selectArrowSR().id +
								'},' +
								'"mousecoords": {' +
									'"enable": ' + _self.isMouse() +
									',"outwkid": ' + _self.selectMouseSR().id +
								'},' +
								'"scalebar": {' +
									'"enable": ' + _self.isScalebar() +
									',"unit": ' + _self.selectScalebar().id +
								'},' +
								'"datagrid": {' +
									'"enable": ' + false +
								'}' +
							'},' +
							'"datagrid": { "enable": false }';
					// TODO get info from the widget when it will be created
					return value;
				};

				// object from other view model to be able to subscribe to change event with a custom
				// binding
				while (lenControls--) {
					controls[lenControls].value.subscribe(_self[controls[lenControls].func], _self);
				}

				_self.init();
			};

			vm = new footerViewModel(elem, map, controls);
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
