!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.receptacle=e()}}(function(){return function e(t,s,i){function r(a,o){if(!s[a]){if(!t[a]){var u="function"==typeof require&&require;if(!o&&u)return u(a,!0);if(n)return n(a,!0);var h=new Error("Cannot find module '"+a+"'");throw h.code="MODULE_NOT_FOUND",h}var c=s[a]={exports:{}};t[a][0].call(c.exports,function(e){var s=t[a][1][e];return r(s?s:e)},c,c.exports,e,t,s,i)}return s[a].exports}for(var n="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(e,t){"use strict";function s(){return(1e9*Math.random()>>>0)+a++}function i(e){e=e||{},this.id=e.id||s(),this.max=e.max,this.items=e.items||[],this.size=this.items.length,this.lastModified=new Date(e.lastModified||new Date);for(var t,i,r=this.items.length;r--;)t=this.items[r],i=new Date(t.expires)-new Date,this.items[t.key]=t,i>0&&this.expire(t.key,i)}t.exports=i;var r=e(2),n=i.prototype,a=new Date%1e9;n.has=function(e){return e in this.items},n.get=function(e){if(!this.has(e))return null;var t=this.items[e];return t.refresh&&this.expire(e,t.refresh),this.items.splice(this.items.indexOf(t),1),this.items.push(t),t.value},n.meta=function(e){if(!this.has(e))return null;var t=this.items[e];return"meta"in t?t.meta:null},n.set=function(e,t,s){var i=this.items[e],r=this.items[e]={key:e,value:t};return this.lastModified=new Date,i?(clearInterval(i.timeout),this.items.splice(this.items.indexOf(i),1,r)):(this.items.length>=this.max&&this["delete"](this.items[0].key),this.items.unshift(r),this.size++),s&&("ttl"in s&&this.expire(e,s.ttl),"meta"in s&&(r.meta=s.meta),s.refresh&&(r.refresh=s.ttl)),this},n["delete"]=function(e){var t=this.items[e];return t?(this.lastModified=new Date,this.items.splice(this.items.indexOf(t),1),clearTimeout(t.timeout),delete this.items[e],this.size--,this):!1},n.expire=function(e,t){var s=t||0,i=this.items[e];if(!i)return this;if("string"==typeof s&&(s=r(t)),"number"!=typeof s)throw new TypeError("Expiration time must be a string or number.");return clearTimeout(i.timeout),i.timeout=setTimeout(this["delete"].bind(this,i.key),s),i.expires=Number(new Date)+s,this},n.clear=function(){for(var e=this.items.length;e--;)this["delete"](this.items[e].key);return this},n.toJSON=function(){for(var e,t=new Array(this.items.length),s=t.length;s--;)e=this.items[s],t[s]={key:e.key,meta:e.meta,value:e.value,expires:e.expires,refresh:e.refresh};return{id:this.id,max:this.max,lastModified:this.lastModified,items:t}}},{2:2}],2:[function(e,t){function s(e){if(e=""+e,!(e.length>1e4)){var t=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(t){var s=parseFloat(t[1]),i=(t[2]||"ms").toLowerCase();switch(i){case"years":case"year":case"yrs":case"yr":case"y":return s*c;case"days":case"day":case"d":return s*h;case"hours":case"hour":case"hrs":case"hr":case"h":return s*u;case"minutes":case"minute":case"mins":case"min":case"m":return s*o;case"seconds":case"second":case"secs":case"sec":case"s":return s*a;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return s}}}}function i(e){return e>=h?Math.round(e/h)+"d":e>=u?Math.round(e/u)+"h":e>=o?Math.round(e/o)+"m":e>=a?Math.round(e/a)+"s":e+"ms"}function r(e){return n(e,h,"day")||n(e,u,"hour")||n(e,o,"minute")||n(e,a,"second")||e+" ms"}function n(e,t,s){return t>e?void 0:1.5*t>e?Math.floor(e/t)+" "+s:Math.ceil(e/t)+" "+s+"s"}var a=1e3,o=60*a,u=60*o,h=24*u,c=365.25*h;t.exports=function(e,t){return t=t||{},"string"==typeof e?s(e):t["long"]?r(e):i(e)}},{}]},{},[1])(1)});