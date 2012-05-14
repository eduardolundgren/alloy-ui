/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add("jsonp",function(c){var b=c.Lang.isFunction;function a(){this._init.apply(this,arguments);}a.prototype={_init:function(d,f){this.url=d;this._requests={};this._timeouts={};f=(b(f))?{on:{success:f}}:f||{};var e=f.on||{};if(!e.success){e.success=this._defaultCallback(d,f);}this._config=c.merge({context:this,args:[],format:this._format,allowCache:false},f,{on:e});},_defaultCallback:function(){},send:function(){var d=this,g=c.Array(arguments,0,true),f=d._config,h=d._proxy||c.guid(),e;if(f.allowCache){d._proxy=h;}if(d._requests[h]===undefined){d._requests[h]=0;}if(d._timeouts[h]===undefined){d._timeouts[h]=0;}d._requests[h]++;g.unshift(d.url,"YUI.Env.JSONP."+h);e=f.format.apply(d,g);if(!f.on.success){return d;}function i(k,j){return(b(k))?function(n){var m=true,l="_requests";if(j){++d._timeouts[h];--d._requests[h];}else{if(!d._requests[h]){m=false;l="_timeouts";}--d[l][h];}if(!d._requests[h]&&!d._timeouts[h]){delete YUI.Env.JSONP[h];}if(m){k.apply(f.context,[n].concat(f.args));}}:null;}YUI.Env.JSONP[h]=i(f.on.success);c.Get.script(e,{onFailure:i(f.on.failure),onTimeout:i(f.on.timeout,true),timeout:f.timeout,charset:f.charset,attributes:f.attributes});return d;},_format:function(d,e){return d.replace(/\{callback\}/,e);}};c.JSONPRequest=a;c.jsonp=function(d,f){var e=new c.JSONPRequest(d,f);return e.send.apply(e,c.Array(arguments,2,true));};if(!YUI.Env.JSONP){YUI.Env.JSONP={};}},"3.5.0",{requires:["get","oop"]});