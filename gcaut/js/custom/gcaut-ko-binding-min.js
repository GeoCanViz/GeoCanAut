(function(){define(["jquery-private","knockout","jqueryui"],function(c,a,b){a.bindingHandlers.tooltip={init:function(g,h){var f=a.utils.unwrapObservable(h()),e={},d=c(g);a.utils.extend(e,a.bindingHandlers.tooltip.options);a.utils.extend(e,f);d.attr("title",e.content);d.tooltip(e);a.utils.domNodeDisposal.addDisposeCallback(g,function(){d.tooltip("destroy")})},options:{show:{effect:"slideDown",delay:2000},hide:{effect:"slideUp",delay:100},position:{my:"right+30 top+5"},tooltipClass:"gcviz-tooltip",trigger:"hover, focus"}};a.extenders.numeric=function(f,e){var d=a.computed({read:f,write:function(j){var i=f(),h=Math.pow(10,e),k=isNaN(j)?0:parseFloat(+j),g=Math.round(k*h)/h;if(g!==i){f(g)}else{if(j!==i){f.notifySubscribers(g)}}}}).extend({notify:"always"});d(f());return d};a.bindingHandlers.uiAutocomplete={init:function(f,g){var e=g()||{},d=c(f);d.autocomplete(e);a.utils.domNodeDisposal.addDisposeCallback(f,function(){d.autocomplete("destroy")})},update:function(e,f){var d=f()||{};c(e).autocomplete("option","source",d.source.availServ())}};a.bindingHandlers.uiSortable={init:function(g,h){var f=h()||{},e=c("#"+f.refresh),d=c(g);d.sortable(f);d.disableSelection();if(typeof e!=="undefined"){e.focus(function(){d.sortable("refresh")})}a.utils.domNodeDisposal.addDisposeCallback(g,function(){d.sortable("destroy")})},update:function(e,f){var d=f()||{};c(e).sortable("destroy").sortable(d)}};a.bindingHandlers.uiAccordion={init:function(g,h){var f=h()||{},e=c("#"+f.refresh),d=c(g);d.accordion(f);if(typeof e!=="undefined"){e.focus(function(){d.accordion("refresh")})}a.utils.domNodeDisposal.addDisposeCallback(g,function(){d.accordion("destroy")})},update:function(e,f){var d=f()||{};c(e).accordion("destroy").accordion(d)}};a.bindingHandlers.uiDialog={init:function(g,h){var f=a.utils.unwrapObservable(h()),e={},d=c(g);a.utils.extend(e,a.bindingHandlers.uiDialog.options);a.utils.extend(e,f);if(typeof e.ok!=="undefined"){e.buttons[0].click=e.ok}if(typeof e.cancel!=="undefined"){e.buttons[1].click=e.cancel}d.dialog(e)},options:{autoOpen:false,modal:true,resizable:false,draggable:false,show:"fade",hide:"fade",closeOnEscape:true,close:function(){},buttons:[{text:"Ok",click:function(){c(this).dialog("close")}},{text:"Cancel",click:function(){c(this).dialog("close")}}]}};a.bindingHandlers.openDialog={update:function(d,e){var f=a.utils.unwrapObservable(e());f?c(d).dialog("open"):c(d).dialog("close")}}})}).call(this);