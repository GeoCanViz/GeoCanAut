/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Header widget
 */
(function() {
    'use strict';
    define(['gcaut-headerVM',
            'jquery',
            'gcaut-i18n'
    ], function(headerVM, $, i18n) {
        var initialize;
        initialize = function(id) {

                // Display the header
                var $gcvMain = $('#gcvMain');
                var html = '';
                html  = '<div id="divHeader" class="gcvHeader">';
                html += '  <div class="gcvMargLeft10"><h1 id="h1Title"><img src="distgcv/images/geocanaut.png" alt="GeoCanAut logo" class="gcvLogo gcvMargBottom0 gcvPlus10" />'+i18n.getDict('%titlestring')+'<img src="distgcv/images/geocanviz.gif" alt="GeoCanViz logo" class="gcvLogo gcvMargBottom0 gcvPlus10" /></h1></div>';
                html += '</div>';
                html += '<div id="divMapConfigs">';
// How do I handle IDs?
                html += '   <div id="0" class="gcviz" data-gcviz="templates/default.json"></div>';
                html += '</div>';
                html += '<div id="divMapSelection">';
                html += '</div>';
                // Define the buttons
                html += '  <div class="gcvMargTop10">';
                html += '    <span>';
                html += '      <label id="lblMapNum">'+i18n.getDict('%definemap')+'</label>';
                html += '      <select id="selMap">';
// How do I handle IDs?
                html += '        <option value="0">0</option>';
                html += '      </select>';
                html += '      <span id="spnAddMap" class="gcvMargLeft10 gcvMargTop10">';
                html += '        <a href="#" id="aAddMap" data-bind="click: addMapEvent" title="'+i18n.getDict('%addmap')+'" class="gcvbutton">';
                html += '          <img src="distgcv/images/add.png" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                html += '          <span class="gcvimgText">'+i18n.getDict('%addmap')+'</span>';
                html += '        </a>';
                html += '      </span>';
                html += '      <span id="spnDelMap" class="gcvMargLeft10 gcvMargTop10">';
                html += '        <a href="#" id="aDelMap" data-bind="click: deleteMapEvent" title="'+i18n.getDict('%removemap')+'" class="gcvbutton">';
                html += '          <img src="distgcv/images/delete.gif" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                html += '          <span class="gcvimgText">'+i18n.getDict('%removemap')+'</span>';
                html += '        </a>';
                html += '      </span>';
                html += '      <span id="spnResMap" class="gcvMargLeft10 gcvMargTop10 gcvHidden">';
                html += '        <a href="#" id="aResMap" data-bind="click: restoreMapEvent" title="'+i18n.getDict('%restoremap')+'" class="gcvbutton">';
                html += '          <img src="distgcv/images/undo.gif" class="gcvImg20 gcvMargBottom0 gcvimgPos" />';
                html += '          <span class="gcvimgText">'+i18n.getDict('%restoremap')+'</span>';
                html += '        </a>';
                html += '      </span>';
                html += '    </span>';
                html += '  </div>';
                $gcvMain.html(html);

            headerVM.initialize();
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
