/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Add service widget
 */
(function() {
    'use strict';
    define(['gcaut-addServiceVM',
            'jquery',
            'gcaut-i18n'
    ], function(addServiceVM, $, i18n) {
        var initialize;
        
        initialize = function(id) {

            var $section = $('#secAddSecServices');
            var html = '';
            
            html =  '<div class="gcvTitle2"><label id="lblSecondary'+id+'" class="gcvMargLeft5">'+i18n.getDict('%secservice')+' #'+id+'</label></div>';
            html += '<div class="gcvMargLeft10 gcvMargTop10">';
            html += '<a href="#" data-bind="click: pickSecService" class="gcvbutton" title="'+i18n.getDict('%pickseclist')+'">';
            html += '<img src="dist/images/application_view_list.png" class="gcvImg20" />';
            html += '<span class="gcvimgText"> '+i18n.getDict('%picklist')+'</span>';
            html += '</a>';
            html += '</div>';
            html += '<div class="gcvcontainer2">';
            html += '<div class="gcvcols gcvcols12 gcvMargTop10">';
            html += '<section class="gcvfirst gcvcol">'+i18n.getDict('%orspecify')+'</section>';
            html += '<section class="gcvcol2"><label id="lblServiceUrlSec'+id+'">'+i18n.getDict('%serviceurl')+'</label></section>';
            html += '<section class="gcvcol2"><input id="inServiceUrlSec'+id+'" class="gcvWidth200"></select></section>';
            html += '<section class="gcvcol">&nbsp;</section>';
            html += '<section class="gcvcol2">';
            html += '<img id="imgVerifySec'+id+'" src="dist/images/pixel.gif" class="gcvImg20" title="'+i18n.getDict('%servicenotverified')+'" alt="'+i18n.getDict('%servicenotverified')+'" />';
            html += '<a href="#" class="gcvbutton" title="'+i18n.getDict('%verify')+'">';
            html += '<img src="dist/images/cog.gif" class="gcvImg20" />';
            html += '<span class="gcvimgText"> '+i18n.getDict('%verify')+'</span>';
            html += '</a>';
            html += '</section>';
            html += '</div>';
            html += '</div>';
            html += '<div class="gcvcontainer2">';
            html += '<div class="gcvcols gcvcols12 gcvMargTop10">';
            html += '<section class="gcvfirst gcvcol">&nbsp;</section>';
            html += '<section class="gcvcol2"><label><span>'+i18n.getDict('%layer')+'</span></label></section>';
            html += '<section class="gcvcol2"><select id="selLayerSec'+id+'" class="gcvWidth200"></select></section>';
            html += '</div>';
            html += '</div>';

            $section.append(html);

            addServiceVM.initialize(id);
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
