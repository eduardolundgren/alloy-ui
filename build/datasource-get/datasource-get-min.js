/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0
build: 3.6.0
*/
YUI.add("datasource-get",function(b){var a=function(){a.superclass.constructor.apply(this,arguments);};b.DataSource.Get=b.extend(a,b.DataSource.Local,{_defRequestFn:function(j){var h=this.get("source"),f=this.get("get"),d=b.guid().replace(/\-/g,"_"),g=this.get("generateRequestCallback"),i=j.details[0],c=this;this._last=d;YUI.Env.DataSource.callbacks[d]=function(e){delete YUI.Env.DataSource.callbacks[d];delete b.DataSource.Local.transactions[j.tId];var k=c.get("asyncMode")!=="ignoreStaleResponses"||c._last===d;if(k){i.data=e;c.fire("data",i);}else{}};h+=j.request+g.call(this,d);b.DataSource.Local.transactions[j.tId]=f.script(h,{autopurge:true,onFailure:function(e){delete YUI.Env.DataSource.callbacks[d];delete b.DataSource.Local.transactions[j.tId];i.error=new Error(e.msg||"Script node data failure");c.fire("data",i);},onTimeout:function(e){delete YUI.Env.DataSource.callbacks[d];delete b.DataSource.Local.transactions[j.tId];i.error=new Error(e.msg||"Script node data timeout");c.fire("data",i);}});return j.tId;},_generateRequest:function(c){return"&"+this.get("scriptCallbackParam")+"=YUI.Env.DataSource.callbacks."+c;}},{NAME:"dataSourceGet",ATTRS:{get:{value:b.Get,cloneDefaultValue:false},asyncMode:{value:"allowAll"},scriptCallbackParam:{value:"callback"},generateRequestCallback:{value:function(){return this._generateRequest.apply(this,arguments);}}}});YUI.namespace("Env.DataSource.callbacks");},"3.6.0",{requires:["datasource-local","get"]});