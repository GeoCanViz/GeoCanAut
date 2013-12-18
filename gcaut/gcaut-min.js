/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: v0.0.1-development Build: 2013-12-18- 04:29 PM
 */
var locationPath;(function(){define(["gcaut-vm-projheader","jqueryui","accessibletabs"],function(e,d,c){var b,a;b=function(){var f=document.getElementById("projectHeader");a();$("#gcauttabs").accessibleTabs({currentClass:"current",tabhead:"h2",tabbody:".tabbody",fx:"fadeIn",fxspeed:"normal",currentInfoText:"",});$("#gcautmaptabs").accessibleTabs({currentClass:"current",tabhead:"h3",tabbody:".tabbody2",fx:"fadeIn",fxspeed:"normal",currentInfoText:"",});e.initialize(f)};a=function(){var j=document.getElementsByTagName("meta"),g=j.length;while(g--){if(j[g].getAttribute("property")==="location"){locationPath=j[g].getAttribute("content")}}if(typeof locationPath==="undefined"){var f=window.location.toString(),h=f.search("GeoCanAut");if(h!==-1){locationPath=f.substring(0,f.search("GeoCanAut"))+"GeoCanAut/"}}};return{initialize:b,}})}).call(this);