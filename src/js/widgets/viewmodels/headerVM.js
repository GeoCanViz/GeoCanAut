/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Header view model widget
 */

(function() {
    'use strict';
    define([
        'jquery',
        'knockout'
    ], function($, ko) {
        var addMapEvent,
            deleteMapEvent,
            initialize,
            restoreMapEvent;
        
        initialize = function(id) {
            
            // data model               
            var headerVM = function() {
                var _self = this;
                _self.init = function() {
                    return { controlsDescendantBindings: true };
                };
                
                /*
                 * Add a map event
                 */
                self.addMapEvent = function() {
                    var $divMapConfigs = $('#divMapConfigs');
                    var $selMap = $('#selMap');
                    var html = '';
        //            mapNum = mapNum + 1;
        //            html = '   <div id="'+mapNum+'" class="gcviz" data-gcviz="templates/default.json"></div>';
        //            $divMapConfigs.append(html);
        //            html = '        <option value="'+mapNum+'" selected>'+mapNum+'</option>';
        //            $selMap.append(html);
        //            var mapElem = $('#'+mapNum);
        //            readConfig(mapElem);
                };
                
                /*
                 * Delete a map event
                 */
                self.deleteMapEvent = function(id) {
                    
                };
                
                /*
                 * Restore a map event
                 */
                self.restoreMapEvent = function(id) {
                    
                };
                
                _self.init();
            };
            ko.applyBindings(new headerVM(), $('#gcvMain')[0]); // Apply bindings only to the desired DIV in the VM
        };
        
        return {
            addMapEvent: addMapEvent,
            deleteMapEvent: deleteMapEvent,
            restoreMapEvent: restoreMapEvent,
            initialize: initialize
        };
    });
}).call(this);

