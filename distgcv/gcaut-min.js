/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Version: v0.0.1-development Build: 2013-10-29- 08:50 AM
 *
 */
var locationPath;(function(){define(["jquery","knockout","gcaut-secDefineServicesVM"],function(d,b,c){var a;a=function(){var j=document.getElementsByTagName("meta"),f=j.length;while(f--){if(j[f].getAttribute("property")==="location"){locationPath=j[f].getAttribute("content")}}if(navigator.userAgent.indexOf("MSIE")!==-1){var e=navigator.userAgent.indexOf("MSIE 6.0");var k=navigator.userAgent.indexOf("MSIE 7.0");var h=navigator.userAgent.indexOf("MSIE 8.0");var g=navigator.userAgent.indexOf("MSIE 9.0");if((e!==-1)||(k!==-1)||(h!==-1)||(g!==-1)){alert("You are using IE 9 or less. Use a real browser!!!")}}else{c.initialize(d("#secDefineServices"))}};return{initialize:a}})}).call(this);