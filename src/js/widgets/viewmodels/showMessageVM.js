/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Show message view model widget
 */

(function() {
    'use strict';
    define([
        'jquery',
        'knockout',
        'gcaut-i18n'
    ], function($, ko, i18n) {
        var initialize;
        var open;


        initialize = function(text) {
            
            // data model               
            var showMessageVM = function() {
                var _self = this;
//                $( "#divShowMessage" ).dialog( "open" );

                _self.init = function() {
                    return { controlsDescendantBindings: true };
                };
                
                _self.init();
            };
            ko.applyBindings(new showMessageVM(text)); // This makes Knockout get to work
        };
        
        open = function() {
            $( "#divShowMessage" ).dialog( "open" );
        };
        
        return {
            initialize: initialize,
            open: open
        };
    });
}).call(this);

