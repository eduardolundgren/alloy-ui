/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0
build: 3.6.0
*/
YUI.add("pjax-plugin",function(a){a.Plugin.Pjax=a.Base.create("pjaxPlugin",a.Pjax,[a.Plugin.Base],{initializer:function(b){this.set("container",b.host);}},{NS:"pjax"});},"3.6.0",{requires:["node-pluginhost","pjax","plugin"]});