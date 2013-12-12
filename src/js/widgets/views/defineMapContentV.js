/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Define a map content widget
 */
(function() {
    'use strict';
    define(['gcaut-defineMapContentVM',
            'jquery',
            'gcaut-i18n'
    ], function(defineMapContentVM, $, i18n) {
        var initialize;
        
        initialize = function(id) {
            var secname = "#secMapTab" + id;
            var $section = $(secname);
            var html = '';
            html += '    <div id="divLvl2MapDef' + id + '" class="tabs2">';
            html += '     <div id="divLvl2TabMapDefContent' + id + '_1" class="tabbody2">';
            html += '       <h2>Services&nbsp;</h2>';
            html += '       <section id="secDefineServices"></section>';
            html += '     </div>';
            html += '     <div id="divLvl2TabMapDefContent' + id + '_2" class="tabbody2">';
            html += '       <h2>Layer&nbsp;Order</h2>';
            html += '       <section id="secLayerOrder"></section>';
            html += '     </div>';
            html += '     <div id="divLvl2TabMapDefContent' + id + '_3" class="tabbody2">';
            html += '       <h2>Layer&nbsp;Options</h2>';
            html += '       <section id="secLayerOptions"></section>';
            html += '     </div>';
            html += '    </div>';
            $section.append(html);
            defineMapContentVM.initialize(id);
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
