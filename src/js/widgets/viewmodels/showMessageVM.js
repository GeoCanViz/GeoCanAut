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


        initialize = function(html) {
            
            // data model               
            var showMessageVM = function(html) {
                var _self = this;

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

                _self.init = function() {
                    $( "#divShowMessage" ).dialog( "open" );
                    return { controlsDescendantBindings: true };
                };
                
                _self.init();
            };
            ko.applyBindings(new showMessageVM(html)); // This makes Knockout get to work
        };
        
        return {
            initialize: initialize
        };
    });
}).call(this);

