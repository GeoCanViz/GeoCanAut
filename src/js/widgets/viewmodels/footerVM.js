/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Footer view model widget
 */
/* global locationPath: false */
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
            var footerViewModel = function(elem, map) {
                var _self = this,
                	arrow = map.northarrow,
                	mouse = map.mousecoords,
                	sr = [3944, 3978, 4326];

                // label
                _self.lblUrlGeomServer = i18n.getDict('%footer-urlGeomServer');
                _self.lblEnbArrow = i18n.getDict('%footer-arrow');
                _self.lblArrowSR = i18n.getDict('%footer-arrowSR');
                _self.lblEnbMouse = i18n.getDict('%footer-mouse');
                _self.lblMouseSR = i18n.getDict('%footer-mouseSR');
                _self.lblSelectItem = i18n.getDict('%selectItem');

                // input
				_self.urlGeomServer = ko.observable(map.urlgeomserv);
				_self.isArrow = ko.observable(arrow.enable);
				_self.isMouse = ko.observable(mouse.enable);

				// arrow and mouse SR
				_self.arrowSR = sr;
				_self.mouseSR = sr;
				_self.selectArrowSR = ko.observable();
				_self.selectMouseSR = ko.observable();
				if (typeof arrow.inwkid !== 'undefined') {
					_self.selectArrowSR(arrow.inwkid);
				}
				if (typeof mouse.outwkid !== 'undefined') {
					_self.selectMouseSR(mouse.outwkid);
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

				_self.write = function() {
					var isArrow = _self.isArrow(),
						isMouse = _self.isMouse(),
						url = _self.urlGeomServer(),
						value = '"footer": {' +
									'"urlgeomserv": "setUrl",' +
									'"northarrow": {' +
										'"enable": ' + isArrow +
										'setArrowSR' +
									'},' +
									'"mousecoords": {' +
										'"enable": ' + isMouse +
										'setMouseSR' +
									'},' +
									'"datatable": {' +
										'"direction": "in"' +
									'}' +
								'}';

					// if there is arrow and/or mouse add the needed content to config file. If not remove the tag.
					if (typeof url !== 'undefined') {
						value = value.replace('setUrl', url);
					} else {
						value = value.replace('setUrl', '');
					}

					if (isArrow) {
						value = value.replace('setArrowSR', ',"inwkid": ' + _self.selectArrowSR());
					} else {
						value = value.replace('setArrowSR', '');
					}

					if (isMouse) {
						value = value.replace('setMouseSR', ',"outwkid": ' + _self.selectMouseSR());
					} else {
						value = value.replace('setMouseSR', '');
					}

					return value;
				};

                _self.init();
            };

            vm = new footerViewModel(elem, map);
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

