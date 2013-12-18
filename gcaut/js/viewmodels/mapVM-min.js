/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 *  Project header view model widget
 */
(function(){define(["jquery-private","knockout","gcaut-i18n"],function(d,b,e){var a,c;a=function(g,h){var f=function(l,m){var i=this,j=locationPath+"gcaut/images/projNew.png",k=m.size;i.imgNew=j;i.tpNew=e.getDict("%projheader-tpnewmap");i.mapSize=e.getDict("%size");i.mapHeight=e.getDict("%height")+": ";i.mapWidth=e.getDict("%width")+": ";i.addLayer=e.getDict("%map-addlayers");i.mapHeightValue=b.observable(k.height);i.mapWidthValue=b.observable(k.width);i.layers=b.observableArray(m.layers);b.cleanNode(document.getElementById("generalMap"));document.getElementById("layers").innerHTML="";i.init=function(){return{controlsDescendantBindings:true}};i.clean=function(){b.cleanNode(document.getElementById("generalMap"));document.getElementById("layers").innerHTML="";b.applyBindings(i,l)};i.addLayer=function(){i.layers.push({id:"New at "+new Date()})};i.removeLayer=function(){i.layers.remove(this)};i.init()};c=new f(g,h);b.applyBindings(c,g);return c};return{initialize:a}})}).call(this);