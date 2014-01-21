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
            // Constructor for an object with two properties
			var printTypeArr = function(value, index) {
				this.printVal = value;
				this.printIndex = index;
			};

            // data model               
            var headerViewModel = function(elem, map) {
                var _self = this,
                	title = map.title,
                	print = map.print,
                	printType = [{ id: 1, val: i18n.getDict('%header-printtype1') }, { id: 2, val: i18n.getDict('%header-printtype2') }];

                // label
                _self.lblMapTitle = i18n.getDict('%header-mapname');
                _self.lblMapAlt = i18n.getDict('%header-mapname');
                _self.lblEnbTools = i18n.getDict('%header-lblbutton');
                _self.lblTools = i18n.getDict('%header-tools');
                _self.lblPrint = i18n.getDict('%header-print');
                _self.lblPrintType = i18n.getDict('%header-printtype');
                _self.lblInset = i18n.getDict('%header-inset');
                _self.lblFulscreen = i18n.getDict('%header-fullscreen');
                _self.lblSelectItem = i18n.getDict('%selectItem');
                
                // input
				_self.mapTitleValue = ko.observable(title.value);
				_self.mapAltValue = ko.observable(title.alttext);
				_self.isTools = ko.observable(map.tools);
				_self.isPrint = ko.observable(print.enable);
				_self.isInset = ko.observable(map.inset);
				_self.isFullscreen = ko.observable(map.fullscreen);
				
				// print type
				_self.printType = printType;
				_self.selectPrint = ko.observable();
				if (typeof print.type !== 'undefined') {
					_self.selectPrint(_self.printType[print.type -1]);
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
					var value = '"header": {' +
									'"title": {' +
										'"value": "' + _self.mapTitleValue() +'",' +
										'"alttext": "' + _self.mapAltValue() + '",' +
										'"justify": "center"' +
									'},' +
									'"tools": ' + _self.isTools() + ',' +
									'"print": {' +
										'"enable": ' + _self.isPrint() + ',' +
										'"type": ' + _self.selectPrint().id +
									'},' +
									'"fullscreen": ' + _self.isFullscreen() + ',' +
									'"inset": ' + _self.isInset() +
								'}';
					
					return value;
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

