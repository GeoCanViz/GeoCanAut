(function(){define(["jquery","knockout","gcaut-i18n"],function(d,b,c){var a;a=function(e){var f=function(h){var g=this;d('<div id="divMessage" class="whitebg" />').dialog({modal:true,autoOpen:true,title:"Message",closeText:c.getDict("%close"),open:function(){d(this).html(h);d(".ui-widget-overlay").bind("click",function(){d(this).siblings(".ui-dialog").find(".ui-dialog-content").dialog("close")})},close:function(){d(this).dialog("destroy").remove()},show:{effect:"fade",duration:700},hide:{effect:"fade",duration:500},position:{my:"center",at:"center",of:window},height:200,buttons:[{text:"Ok",title:"Ok",click:function(){d(this).dialog("close")}},{text:c.getDict("%cancel"),title:c.getDict("%cancel"),click:function(){d(this).dialog("close")}}]});g.init=function(){return{controlsDescendantBindings:true}};g.init()};b.applyBindings(new f(e),d("#divShowMessage")[0])};return{initialize:a}})}).call(this);