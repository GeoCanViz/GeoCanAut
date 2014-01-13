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
				_self.selectArrowSR = ko.observable(arrow.inwkid);
				_self.selectMouseSR = ko.observable(mouse.outwkid);
				
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
						value = '"footer": {' +
									'"urlgeomserv": "' + _self.urlGeomServer() + '",' +
									'"northarrow": {' +
										'"enable": ' + isArrow +
										'arrowSR' +
									'},' +
									'"mousecoords": {' +
										'"enable": ' + _self.isMouse() +
										'mouseSR' +
									'},' +
									'"datatable": {' +
										'"direction": "in"' +
									'}' +
								'}';
					
					// if there is arrow and/or mouse add the needed content to config file. If not remove the tag.
					if (isArrow) {
						value = value.replace('arrowSR', ',"inwkid": ' + _self.selectArrowSR());
					} else {
						value = value.replace('arrowSR', '');
					}
					
					if (isMouse) {
						value = value.replace('mouseSR', ',"outwkid": ' + _self.selectMouseSR());
					} else {
						value = value.replace('mouseSR', '');
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

