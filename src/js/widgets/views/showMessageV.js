/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Show a message widget
 */
(function() {
    'use strict';
    define(['gcaut-showMessageVM'
    ], function(sm) {
        var initialize;
        
        initialize = function(text) {

            var html = '';
                html += '<div id="divShowMessage" class="gcvMargLeft10 gcvMargTop10">';
                html += '<span id="spnMsgText">'+text+'</span>';
                html += '</div>';

            sm.initialize(html);
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
