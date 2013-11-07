/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Define Services widget
 */
(function() {
    'use strict';
    define(['gcaut-sectionDefineServicesVM',
            'jquery',
            'gcaut-i18n'
    ], function(sectionDefineServicesVM, $, i18n) {
        var initialize;
        
        initialize = function() {

            // var $h1 = $('#h1Title');
            // var html = '';
            // html =  i18n.getDict('%titlestring')+' <img src="distgcv/images/geocanviz.gif" alt="GeoCanViz logo" class="gcvLogo gcvmargTop10 gcvMargBottom0 gcvPlus5" />';
            // $h1.append(html);
            // sectionDefineServicesVM.initialize($('#secDefineServices'));
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
