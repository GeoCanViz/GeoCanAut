/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Define a map content view model widget
 */

(function() {
    'use strict';
    define([
        'jquery',
        'knockout',
        'accessibletabs',
        'syncheight',
        'gcaut-i18n',
//        'gcaut-sectionDefineServicesV',
        'gcaut-showMessageV'
    ], function($, ko, at, sh, i18n, ds, msg) {
        var initialize;
        
        initialize = function(id) {
            
            // data model               
            var defineMapContentVM = function(id) {
                var _self = this;
                // Get language specific strings
                _self.definemap = i18n.getDict('%definemap');
                _self.nameconfig = i18n.getDict('%nameconfig');
                _self.open = i18n.getDict('%open');
                _self.openconfig = i18n.getDict('%openconfig');
                _self.projectname = i18n.getDict('%projectname');
                _self.save = i18n.getDict('%save');
                _self.saveconfig = i18n.getDict('%saveconfig');
                _self.title = i18n.getDict('%title');

                var thetabs = $('.tabs2');
                //var myt = "#divLvl2MapDef" + id;
                //var thetabs = $(myt);
                thetabs.accessibleTabs();
                thetabs.accessibleTabs({
                    tabhead:'h2',
                    tabbody: '.tabbody2',
                    tabheadClass: 'tabhead2',
                    fx:"fadeIn",
                    currentInfoText: ""
                });
        
                _self.init = function() {
                    // Initialize the DefineServices view
//                    ds.initialize(id);
                    return { controlsDescendantBindings: true };
                };
                
                
                _self.init();
            };
            var secname = "#secMap" + id;
            ko.applyBindings(new defineMapContentVM(id), $(secname)[0]); // Apply bindings only to the desired section in the VM
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);

