/*
 *
 * GeoCanAut / GéoCanAut
 * gcvaut.github.io/gcvaut/License-eng.txt / gcvaut.github.io/gcvaut/Licence-fra.txt
 *
 * Show a message widget
 */
(function() {
    'use strict';
    define(['gcaut-showMessageVM',
            'jquery',
            'gcaut-i18n'
    ], function(sm, $, i18n) {
        var initialize;
        
        initialize = function(text) {

            var $body = $('#gcvMain');
            var html = '';
                html += '<div id="divShowMessage" class="gcvMargLeft10 gcvMargTop10">';
                html += '<span id="spnMsgText">'+text+'</span>';
                html += '</div>';
            $('<div id="divMessage" class="whitebg" />').dialog({
            modal: true,
            title: "Message",
            closeText: i18n.getDict('%close'),
            open: function() {
                $(this).html(html);
                $('.ui-widget-overlay').bind('click', function () { $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close'); });
            },
            close: function() { 
                $(this).dialog('destroy').remove();
            },
            show: {
                effect: "fade",
                duration: 700
            },
            hide: {
                effect: "fade",
                duration: 500
            },
            position: { my: "center", at: "center", of: window },
            height: 200,
            buttons: [
                {
                    text: "Ok",
                    title: "Ok",
                    click: function() {
                        $( this ).dialog( "destroy" ).remove();
                    }
                },
                {
                    text: i18n.getDict('%cancel'),
                    title: i18n.getDict('%cancel'),
                    click: function() {
                        $( this ).dialog( "destroy" ).remove();
                    }
                }
            ]
        });

            sm.initialize(text);
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);
