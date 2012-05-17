/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("transition-native",function(b){var i="",h="",f=b.config.doc,r="documentElement",s="transition",k="Transition",m,j,p,a,n,c,l,t,q={},g=["Webkit","Moz"],e={Webkit:"webkitTransitionEnd"},d=function(){this.init.apply(this,arguments);};d._toCamel=function(u){u=u.replace(/-([a-z])/gi,function(w,v){return v.toUpperCase();});return u;};d._toHyphen=function(u){u=u.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g,function(y,x,w,v){var z=((x)?"-"+x.toLowerCase():"")+w;if(v){z+="-"+v.toLowerCase();}return z;});return u;};d.SHOW_TRANSITION="fadeIn";d.HIDE_TRANSITION="fadeOut";d.useNative=false;b.Array.each(g,function(v){var u=v+k;if(u in f[r].style){i=v;h=d._toHyphen(v)+"-";d.useNative=true;d.supported=true;}});k=i+k;m=i+"TransitionProperty";j=h+"transition-property";p=h+"transition-duration";a=h+"transition-timing-function";n=h+"transition-delay";c="transitionend";l="on"+i.toLowerCase()+"transitionend";c=e[i]||c;t=i+"Transform";d.fx={};d.toggles={};d._hasEnd={};d._reKeywords=/^(?:node|duration|iterations|easing|delay|on|onstart|onend)$/i;b.Node.DOM_EVENTS[c]=1;d.NAME="transition";d.DEFAULT_EASING="ease";d.DEFAULT_DURATION=0.5;d.DEFAULT_DELAY=0;d._nodeAttrs={};d.prototype={constructor:d,init:function(v,u){var w=this;w._node=v;if(!w._running&&u){w._config=u;v._transition=w;w._duration=("duration" in u)?u.duration:w.constructor.DEFAULT_DURATION;w._delay=("delay" in u)?u.delay:w.constructor.DEFAULT_DELAY;w._easing=u.easing||w.constructor.DEFAULT_EASING;w._count=0;w._running=false;}return w;},addProperty:function(v,x){var A=this,y=this._node,C=b.stamp(y),B=b.one(y),F=d._nodeAttrs[C],z,E,u,D,w;if(!F){F=d._nodeAttrs[C]={};}D=F[v];if(x&&x.value!==undefined){w=x.value;}else{if(x!==undefined){w=x;x=q;}}if(typeof w==="function"){w=w.call(B,B);}if(D&&D.transition){if(D.transition!==A){D.transition._count--;}}A._count++;u=((typeof x.duration!="undefined")?x.duration:A._duration)||0.0001;F[v]={value:w,duration:u,delay:(typeof x.delay!="undefined")?x.delay:A._delay,easing:x.easing||A._easing,transition:A};z=b.DOM.getComputedStyle(y,v);E=(typeof w==="string")?z:parseFloat(z);if(d.useNative&&E===w){setTimeout(function(){A._onNativeEnd.call(y,{propertyName:v,elapsedTime:u});},u*1000);}},removeProperty:function(w){var v=this,u=d._nodeAttrs[b.stamp(v._node)];if(u&&u[w]){delete u[w];v._count--;}},initAttrs:function(v){var u,w=this._node;if(v.transform&&!v[t]){v[t]=v.transform;delete v.transform;}for(u in v){if(v.hasOwnProperty(u)&&!d._reKeywords.test(u)){this.addProperty(u,v[u]);if(w.style[u]===""){b.DOM.setStyle(w,u,b.DOM.getComputedStyle(w,u));}}}},run:function(y){var x=this,v=x._node,u=x._config,w={type:"transition:start",config:u};if(!x._running){x._running=true;if(u.on&&u.on.start){u.on.start.call(b.one(v),w);}x.initAttrs(x._config);x._callback=y;x._start();}return x;},_start:function(){this._runNative();},_prepDur:function(u){u=parseFloat(u);return u+"s";},_runNative:function(w){var C=this,x=C._node,E=b.stamp(x),v=x.style,A=getComputedStyle(x),I=d._nodeAttrs[E],y="",J=A[d._toCamel(j)],H=j+": ",B=p+": ",G=a+": ",D=n+": ",z,F,u;if(J!=="all"){H+=J+",";B+=A[d._toCamel(p)]+",";G+=A[d._toCamel(a)]+",";D+=A[d._toCamel(n)]+",";}for(u in I){z=d._toHyphen(u);F=I[u];if((F=I[u])&&F.transition===C){if(u in x.style){B+=C._prepDur(F.duration)+",";D+=C._prepDur(F.delay)+",";G+=(F.easing)+",";H+=z+",";y+=z+": "+F.value+"; ";}else{this.removeProperty(u);}}}H=H.replace(/,$/,";");B=B.replace(/,$/,";");G=G.replace(/,$/,";");D=D.replace(/,$/,";");if(!d._hasEnd[E]){x.addEventListener(c,C._onNativeEnd,"");d._hasEnd[E]=true;}v.cssText+=H+B+G+D+y;},_end:function(u){var y=this,w=y._node,A=y._callback,v=y._config,x={type:"transition:end",config:v,elapsedTime:u},z=b.one(w);y._running=false;y._callback=null;if(w){if(v.on&&v.on.end){setTimeout(function(){v.on.end.call(z,x);if(A){A.call(z,x);}},1);}else{if(A){setTimeout(function(){A.call(z,x);},1);}}}},_endNative:function(u){var v=this._node,w=v.ownerDocument.defaultView.getComputedStyle(v,"")[d._toCamel(j)];if(typeof w==="string"){w=w.replace(new RegExp("(?:^|,\\s)"+u+",?"),",");w=w.replace(/^,|,$/,"");v.style[k]=w;}},_onNativeEnd:function(B){var x=this,A=b.stamp(x),u=B,v=d._toCamel(u.propertyName),E=u.elapsedTime,D=d._nodeAttrs[A],C=D[v],y=(C)?C.transition:null,z,w;if(y){y.removeProperty(v);y._endNative(v);w=y._config[v];z={type:"propertyEnd",propertyName:v,elapsedTime:E,config:w};if(w&&w.on&&w.on.end){w.on.end.call(b.one(x),z);}if(y._count<=0){y._end(E);}}},destroy:function(){var v=this,u=v._node;if(u){u.removeEventListener(c,v._onNativeEnd,false);v._node=null;}}};b.Transition=d;b.TransitionNative=d;b.Node.prototype.transition=function(w,v,A){var u=d._nodeAttrs[b.stamp(this._node)],y=(u)?u.transition||null:null,x,z;if(typeof w==="string"){if(typeof v==="function"){A=v;v=null;}x=d.fx[w];if(v&&typeof v!=="boolean"){v=b.clone(v);for(z in x){if(x.hasOwnProperty(z)){if(!(z in v)){v[z]=x[z];}}}}else{v=x;}}else{A=v;v=w;}if(y&&!y._running){y.init(this,v);}else{y=new d(this._node,v);}y.run(A);return this;};b.Node.prototype.show=function(v,u,w){this._show();if(v&&b.Transition){if(typeof v!=="string"&&!v.push){if(typeof u==="function"){w=u;u=v;}v=d.SHOW_TRANSITION;}this.transition(v,u,w);}return this;};var o=function(v,u,w){return function(){if(u){u.call(v);}if(w){w.apply(v._node,arguments);}};};b.Node.prototype.hide=function(v,u,w){if(v&&b.Transition){if(typeof u==="function"){w=u;u=null;}w=o(this,this._hide,w);if(typeof v!=="string"&&!v.push){if(typeof u==="function"){w=u;u=v;}v=d.HIDE_TRANSITION;}this.transition(v,u,w);}else{this._hide();}return this;};b.NodeList.prototype.transition=function(v,y){var u=this._nodes,w=0,x;while((x=u[w++])){b.one(x).transition(v,y);}return this;};b.Node.prototype.toggleView=function(v,u,w){this._toggles=this._toggles||[];w=arguments[arguments.length-1];if(typeof v=="boolean"){u=v;v=null;}v=v||b.Transition.DEFAULT_TOGGLE;if(typeof u=="undefined"&&v in this._toggles){u=!this._toggles[v];}u=(u)?1:0;if(u){this._show();}else{w=o(this,this._hide,w);}this._toggles[v]=u;this.transition(b.Transition.toggles[v][u],w);
return this;};b.NodeList.prototype.toggleView=function(w,u,z){var v=this._nodes,x=0,y;while((y=v[x++])){b.one(y).toggleView(w,u,z);}return this;};b.mix(d.fx,{fadeOut:{opacity:0,duration:0.5,easing:"ease-out"},fadeIn:{opacity:1,duration:0.5,easing:"ease-in"},sizeOut:{height:0,width:0,duration:0.75,easing:"ease-out"},sizeIn:{height:function(u){return u.get("scrollHeight")+"px";},width:function(u){return u.get("scrollWidth")+"px";},duration:0.5,easing:"ease-in",on:{start:function(){var u=this.getStyle("overflow");if(u!=="hidden"){this.setStyle("overflow","hidden");this._transitionOverflow=u;}},end:function(){if(this._transitionOverflow){this.setStyle("overflow",this._transitionOverflow);delete this._transitionOverflow;}}}}});b.mix(d.toggles,{size:["sizeOut","sizeIn"],fade:["fadeOut","fadeIn"]});d.DEFAULT_TOGGLE="fade";},"3.6.0pr1",{requires:["node-base"]});