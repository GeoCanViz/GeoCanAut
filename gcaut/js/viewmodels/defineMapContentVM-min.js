(function(){define(["jquery","knockout","accessibletabs","syncheight","gcaut-i18n","gcaut-showMessageV"],function(g,c,b,d,f,e,h){var a;a=function(k){var i=function(n){var m=this;m.definemap=f.getDict("%definemap");m.nameconfig=f.getDict("%nameconfig");m.open=f.getDict("%open");m.openconfig=f.getDict("%openconfig");m.projectname=f.getDict("%projectname");m.save=f.getDict("%save");m.saveconfig=f.getDict("%saveconfig");m.title=f.getDict("%title");var l=g(".tabs2");l.accessibleTabs();l.accessibleTabs({tabhead:"h2",tabbody:".tabbody2",tabheadClass:"tabhead2",fx:"fadeIn",currentInfoText:""});m.init=function(){return{controlsDescendantBindings:true}};m.init()};var j="#secMap"+k;c.applyBindings(new i(k),g(j)[0])};return{initialize:a}})}).call(this);