/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add("io-xdr",function(a){var k=a.publish("io:xdrReady",{fireOnce:true}),e={},g={},j=a.config.doc,l=a.config.win,f=l&&l.XDomainRequest;function h(m,q,d){var n='<object id="io_swf" type="application/x-shockwave-flash" data="'+m+'" width="0" height="0">'+'<param name="movie" value="'+m+'">'+'<param name="FlashVars" value="yid='+q+"&uid="+d+'">'+'<param name="allowScriptAccess" value="always">'+"</object>",p=j.createElement("div");j.body.appendChild(p);p.innerHTML=n;}function b(p,m,n){if(m==="flash"){p.c.responseText=decodeURI(p.c.responseText);}if(n==="xml"){p.c.responseXML=a.DataType.XML.parse(p.c.responseText);}return p;}function i(d,m){return d.c.abort(d.id,m);}function c(d){return f?g[d.id]!==4:d.c.isInProgress(d.id);}a.mix(a.IO.prototype,{_transport:{},_ieEvt:function(n,q){var p=this,m=n.id,d="timeout";n.c.onprogress=function(){g[m]=3;};n.c.onload=function(){g[m]=4;p.xdrResponse("success",n,q);};n.c.onerror=function(){g[m]=4;p.xdrResponse("failure",n,q);};if(q[d]){n.c.ontimeout=function(){g[m]=4;p.xdrResponse(d,n,q);};n.c[d]=q[d];}},xdr:function(d,m,p){var n=this;if(p.xdr.use==="flash"){e[m.id]=p;l.setTimeout(function(){try{m.c.send(d,{id:m.id,uid:m.uid,method:p.method,data:p.data,headers:p.headers});}catch(o){n.xdrResponse("transport error",m,p);delete e[m.id];}},a.io.xdr.delay);}else{if(f){n._ieEvt(m,p);m.c.open(p.method||"GET",d);m.c.send(p.data);}else{m.c.send(d,m,p);}}return{id:m.id,abort:function(){return m.c?i(m,p):false;},isInProgress:function(){return m.c?c(m.id):false;},io:n};},xdrResponse:function(q,s,v){v=e[s.id]?e[s.id]:v;var t=this,n=f?g:e,p=v.xdr.use,r=v.xdr.dataType;switch(q){case"start":t.start(s,v);break;case"success":t.success(b(s,p,r),v);delete n[s.id];break;case"timeout":case"abort":case"transport error":s.c={status:0,statusText:q};case"failure":t.failure(b(s,p,r),v);delete n[s.id];break;}},_xdrReady:function(m,d){a.fire(k,m,d);},transport:function(d){if(d.id==="flash"){h(a.UA.ie?d.src+"?d="+new Date().valueOf().toString():d.src,a.id,d.uid);a.IO.transports.flash=function(){return j.getElementById("io_swf");};}}});a.io.xdrReady=function(n,d){var m=a.io._map[d];a.io.xdr.delay=0;m._xdrReady.apply(m,[n,d]);};a.io.xdrResponse=function(d,m,p){var n=a.io._map[m.uid];n.xdrResponse.apply(n,[d,m,p]);};a.io.transport=function(m){var d=a.io._map["io:0"]||new a.IO();m.uid=d._uid;d.transport.apply(d,[m]);};a.io.xdr={delay:100};},"3.5.0",{requires:["io-base","datatype-xml-parse"]});