AUI.add("aui-portal-layout",function(v){var aq=v.Lang,X=aq.isBoolean,y=aq.isFunction,aa=aq.isObject,n=aq.isString,i=aq.isValue,o=aq.toInt,N=Math.ceil,g=v.DD.DDM,u="append",an="circle",P="delegateConfig",O="down",F="drag",k="dragNode",l="dragNodes",B="dropContainer",t="dropNodes",ad="groups",T="icon",b="indicator",m="l",C="lazyStart",J="left",Q="marginBottom",q="marginTop",am="node",ab="offsetHeight",ac="offsetWidth",w="placeholder",Z="placeAfter",p="placeBefore",ao="portal-layout",x="prepend",ap="proxy",af="proxyNode",h="r",M="region",ah="right",a=" ",S="target",ak="triangle",D="up",r="placeholderAlign",U="quadrantEnter",s="quadrantExit",aj="quadrantOver",al=0,Y=0,z=0,f=0,K=function(){return Array.prototype.slice.call(arguments).join(a);},W=function(L,A){return o(L.getStyle(A));},E=function(A){return(A instanceof v.NodeList);},c=function(A){return E(A)?A:v.all(A);},j=v.getClassName,I=j(ao,F,b),H=j(ao,F,b,T),ae=j(ao,F,b,T,J),e=j(ao,F,b,T,ah),d=j(ao,F,S,b),ag=j(T),ar=j(T,an,ak,m),ai=j(T,an,ak,h),G='<div class="'+I+'">'+'<div class="'+K(H,ae,ag,ai)+'"></div>'+'<div class="'+K(H,e,ag,ar)+'"></div>'+"<div>";var V=v.Component.create({NAME:ao,ATTRS:{delegateConfig:{setter:function(R){var A=this;var L=v.merge({bubbleTargets:A,dragConfig:{},nodes:A.get(l),target:true},R);v.mix(L.dragConfig,{groups:A.get(ad),startCentered:true});return L;},validator:aa,value:null},dragNodes:{validator:n},dropContainer:{validator:y,value:function(A){return A;}},dropNodes:{setter:"_setDropNodes"},groups:{value:[ao]},lazyStart:{validator:X,value:false},placeholder:{setter:function(L){var A=n(L)?v.Node.create(L):L;if(!A.inDoc()){v.getBody().prepend(A.hide());}al=W(A,Q);Y=W(A,q);A.addClass(d);z=W(A,Q);f=W(A,q);return A;},value:G},proxy:{setter:function(R){var A=this;var L={moveOnEnd:false,positionProxy:false};if(A.get(af)){L.borderStyle=null;}return v.merge(L,R||{});},value:null},proxyNode:{setter:function(A){return n(A)?v.Node.create(A):A;}}},EXTENDS:v.Base,prototype:{initializer:function(){var A=this;A.bindUI();},bindUI:function(){var A=this;A.publish(r,{bubbles:true,defaultFn:A._defPlaceholderAlign,emitFacade:true,queuable:false});A._bindDDEvents();A._bindDropZones();},addDropNode:function(R,L){var A=this;R=v.one(R);if(!g.getDrop(R)){A.addDropTarget(new v.DD.Drop(v.merge({bubbleTargets:A,groups:A.get(ad),node:R},L)));}},addDropTarget:function(L){var A=this;L.addToGroup(A.get(ad));},alignPlaceholder:function(R,L){var A=this;var at=A.get(w);if(!A.lazyEvents){at.show();}A._syncPlaceholderSize();at.setXY(A.getPlaceholderXY(R,L));},calculateDirections:function(R){var L=this;var au=L.lastX;var at=L.lastY;var A=R.lastXY[0];var av=R.lastXY[1];if(A!=au){L.XDirection=(A<au)?J:ah;}if(av!=at){L.YDirection=(av<at)?D:O;}L.lastX=A;L.lastY=av;},calculateQuadrant:function(ay,L){var aB=this;var av=1;var aA=L.get(am).get(M);var ax=ay.mouseXY;var au=ax[0];var at=ax[1];var az=aA.top;var R=aA.left;var A=az+(aA.bottom-az)/2;var aw=R+(aA.right-R)/2;if(at<A){av=(au>aw)?1:2;}else{av=(au<aw)?3:4;}aB.quadrant=av;return av;},getPlaceholderXY:function(aw,L){var aA=this;var az=aA.get(w);var au=al;var A=Y;if(L){au=z;A=f;}az.toggleClass(d,L);var at=N(aw.bottom);var R=N(aw.left);var ay=N(aw.top);var ax=R;var av=(aA.quadrant<3)?(ay-(az.get(ab)+au)):(at+A);return[ax,av];},removeDropTarget:function(L){var A=this;L.removeFromGroup(A.get(ad));},_afterDragStart:function(L){var A=this;if(A.get(ap)){A._syncProxyNodeUI(L);}},_alignCondition:function(){var A=this;var au=g.activeDrag;var R=A.activeDrop;if(au&&R){var at=au.get(am);var L=R.get(am);return !at.contains(L);}return true;},_bindDDEvents:function(){var A=this;var L=A.get(P);var R=A.get(ap);A.delegate=new v.DD.Delegate(L);A.delegate.dd.plug(v.Plugin.DDProxy,R);A.on("drag:end",v.bind(A._onDragEnd,A));A.on("drag:enter",v.bind(A._onDragEnter,A));A.on("drag:exit",v.bind(A._onDragExit,A));A.on("drag:over",v.bind(A._onDragOver,A));A.on("drag:start",v.bind(A._onDragStart,A));A.after("drag:start",v.bind(A._afterDragStart,A));A.on(U,A._syncPlaceholderUI);A.on(s,A._syncPlaceholderUI);},_bindDropZones:function(){var A=this;var L=A.get(t);if(L){L.each(function(at,R){A.addDropNode(at);});}},_defPlaceholderAlign:function(au){var A=this;var R=A.activeDrop;var av=A.get(w);if(R&&av){var at=R.get("node");var L=!!at.drop;A.lastAlignDrop=R;A.alignPlaceholder(R.get(am).get(M),L);}},_evOutput:function(){var A=this;return{drag:g.activeDrag,drop:A.activeDrop,quadrant:A.quadrant,XDirection:A.XDirection,YDirection:A.YDirection};},_fireQuadrantEvents:function(){var A=this;var at=A._evOutput();var R=A.lastQuadrant;var L=A.quadrant;if(L!=R){if(R){A.fire(s,v.merge({lastDrag:A.lastDrag,lastDrop:A.lastDrop,lastQuadrant:A.lastQuadrant,lastXDirection:A.lastXDirection,lastYDirection:A.lastYDirection},at));}A.fire(U,at);}A.fire(aj,at);A.lastDrag=g.activeDrag;A.lastDrop=A.activeDrop;A.lastQuadrant=L;A.lastXDirection=A.XDirection;A.lastYDirection=A.YDirection;},_getAppendNode:function(){return g.activeDrag.get(am);},_onDragEnd:function(R){var A=this;var at=A.get(w);var L=A.get(af);A.appendNode=A._getAppendNode();if(!A.lazyEvents){A._positionNode(R);}if(L){L.remove();}if(at){at.hide();}A.lastQuadrant=null;A.lastXDirection=null;A.lastYDirection=null;},_onDragEnter:function(L){var A=this;A.activeDrop=g.activeDrop;if(A.lazyEvents&&A.lastActiveDrop){A.lazyEvents=false;A._syncPlaceholderUI(L);}if(!A.lastActiveDrop){A.lastActiveDrop=g.activeDrop;}},_onDragExit:function(L){var A=this;A._syncPlaceholderUI(L);A.activeDrop=g.activeDrop;A.lastActiveDrop=g.activeDrop;},_onDragOver:function(R){var A=this;var L=R.drag;if(A.activeDrop==g.activeDrop){A.calculateDirections(L);A.calculateQuadrant(L,A.activeDrop);A._fireQuadrantEvents();}},_onDragStart:function(L){var A=this;if(A.get(C)){A.lazyEvents=true;}A.lastActiveDrop=null;A.activeDrop=g.activeDrop;},_positionNode:function(au){var A=this;var at=A.lastAlignDrop||A.activeDrop;if(at){var aw=A.appendNode;var L=at.get(am);var R=i(L.drop);var av=(A.quadrant<3);if(A._alignCondition()){if(R){L[av?p:Z](aw);}else{var ax=A.get(B).apply(A,[L]);
ax[av?x:u](aw);}}}},_setDropNodes:function(L){var A=this;if(y(L)){L=L.call(A);}return c(L);},_syncPlaceholderSize:function(){var A=this;var L=A.activeDrop.get(am);var R=A.get(w);if(R){R.set(ac,L.get(ac));}},_syncPlaceholderUI:function(L){var A=this;if(A._alignCondition()){A.fire(r,{drop:A.activeDrop,originalEvent:L});}},_syncProxyNodeSize:function(){var A=this;var R=g.activeDrag.get(am);var L=A.get(af);if(R&&L){L.set(ab,R.get(ab));L.set(ac,R.get(ac));}},_syncProxyNodeUI:function(R){var A=this;var at=g.activeDrag.get(k);var L=A.get(af);if(L&&!L.compareTo(at)){at.append(L);A._syncProxyNodeSize();}}}});v.PortalLayout=V;},"@VERSION@",{requires:["aui-base","dd-drag","dd-delegate","dd-drop","dd-proxy"],skinnable:true});