/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Header view model widget
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
            var headerViewModel = function(elem, map) {
                var _self = this,
                	title = map.title;
                
                // label
                _self.lblMapTitle = i18n.getDict('%map-name');
                _self.lblMapAlt = i18n.getDict('%map-name');
                
                // input
				_self.mapTitleValue = ko.observable(title.value);
				_self.mapAltValue = ko.observable(title.alttext);
				
				// clean the view model
				clean(ko, elem);
				
                _self.init = function() {
                    return { controlsDescendantBindings: true };
                };
                
                _self.bind = function() {
					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};
                              
                _self.init();
            };
            
            vm = new headerViewModel(elem, map);
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

