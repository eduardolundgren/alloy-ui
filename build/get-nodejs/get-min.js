/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("get",function(a){var i=require("path"),b=require("vm"),f=require("fs"),e=require("request");a.Get=function(){};a.config.base=i.join(__dirname,"../");YUI.require=require;YUI.process=process;var h=function(j){return j.replace(/\\/g,"\\\\");};a.Get._exec=function(p,l,j){var o=h(i.dirname(l));var q=h(l);if(o.match(/^https?:\/\//)){o=".";q="remoteResource";}var m="(function(YUI) { var __dirname = '"+o+"'; "+"var __filename = '"+q+"'; "+"var process = YUI.process;"+"var require = function(file) {"+" if (file.indexOf('./') === 0) {"+"   file = __dirname + file.replace('./', '/'); }"+" return YUI.require(file); }; "+p+" ;return YUI; })";var k=b.createScript(m,l);var n=k.runInThisContext(m);YUI=n(YUI);j(null,l);};a.Get._include=function(m,j){var l=this;if(m.match(/^https?:\/\//)){var k={url:m,timeout:l.timeout};e(k,function(q,p,o){if(q){j(q,m);}else{a.Get._exec(o,m,j);}});}else{if(a.config.useSync){if(i.existsSync(m)){var n=f.readFileSync(m,"utf8");a.Get._exec(n,m,j);}else{j("Path does not exist: "+m,m);}}else{f.readFile(m,"utf8",function(p,o){if(p){j(p,m);}else{a.Get._exec(o,m,j);}});}}};var d=function(k,l,j){if(a.Lang.isFunction(k.onEnd)){k.onEnd.call(a,l,j);}},g=function(j){if(a.Lang.isFunction(j.onSuccess)){j.onSuccess.call(a,j);}d(j,"success","success");},c=function(j,k){k.errors=[k];if(a.Lang.isFunction(j.onFailure)){j.onFailure.call(a,k,j);}d(j,k,"fail");};a.Get.js=function(t,u){var m=a.Array,r=this,q=m(t),j,o,n=q.length,p=0,k=function(){if(p===n){g(u);}};for(o=0;o<n;o++){j=q[o];if(a.Lang.isObject(j)){j=j.url;}j=j.replace(/'/g,"%27");a.Get._include(j,function(s,l){if(!a.config){a.config={debug:true};}if(u.onProgress){u.onProgress.call(u.context||a,l);}if(s){c(u,s);}else{p++;k();}});}};a.Get.script=a.Get.js;a.Get.css=function(k,j){g(j);};},"3.6.0pr1",{requires:["yui-base"]});