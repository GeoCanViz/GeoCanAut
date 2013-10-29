/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Add service view model widget
 */

(function() {
    'use strict';
    define([
        'jquery',
        'knockout',
        'gcaut-i18n'
    ], function($, ko, i18n) {
        var initialize;
        
        initialize = function(id) {
            
            // data model               
            var addServiceVM = function(id) {
                var _self = this,
                    $inServiceUrlSec = $('#inServiceUrlSec' + id);
                
        
                _self.init = function() {
                    return { controlsDescendantBindings: true };
                };
                
                _self.pickSecService = function() {
                    alert("add service #" + id);
                };
                    
                
                _self.init();
            };
            ko.applyBindings(new addServiceVM(id)); // This makes Knockout get to work
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);

