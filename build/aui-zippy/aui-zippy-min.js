AUI.add("aui-zippy-base",function(q){var ad=q.Lang,G=ad.isBoolean,N=ad.isObject,t=ad.isUndefined,W=function(A){return parseInt(A,10)||0;},B="-",w=".",L="",E="px",a=" ",F="animated",Q="animating",C="bindDOMEvents",R="click",r="collapsed",O="content",S="cubic-bezier",D="down",d="enter",k="esc",e="expanded",m="expandedChange",j="getBoundingClientRect",P="gutter",I="header",V="helper",ac="keydown",y="left",i="linear",o="marginTop",n="minus",s="num_minus",z="num_plus",p="parentNode",v="plus",Y="right",a="space",Z="transition",h="transitionEnd",f="transitionStart",u="up",ab="wrapper",c="zippy",g=q.getClassName,K=g(c,O),T=g(c,O,r),aa=g(c,O,e),J=g(c,O,ab),l=g(c,I),U=g(c,I,r),X=g(c,I,e),x={"false":T,"true":aa},b={"false":U,"true":X},M='<div class="'+J+'"></div>';var H=q.Component.create({NAME:c,ATTRS:{animated:{validator:G,value:false,writeOnce:true},animating:{validator:G,value:false},bindDOMEvents:{validator:G,value:true,writeOnce:true},content:{setter:q.one},expanded:{validator:G,value:true},header:{setter:q.one},transition:{validator:N,value:{duration:0.4,easing:S}}},EXTENDS:q.Base,headerEventHandler:function(ae,A){if(ae.type===R||ae.isKey(d)||ae.isKey(a)){ae.preventDefault();return A.toggle();}else{if(ae.isKey(D)||ae.isKey(Y)||ae.isKey(z)){ae.preventDefault();return A.expand();}else{if(ae.isKey(u)||ae.isKey(y)||ae.isKey(k)||ae.isKey(s)){ae.preventDefault();return A.collapse();}}}},prototype:{initializer:function(){var A=this;A.bindUI();A.syncUI();A._uiSetExpanded(A.get(e));},bindUI:function(){var A=this;var ae=A.get(I);ae.setData(c,A);A.on(m,q.bind(A._onExpandedChange,A));if(A.get(C)){ae.on([R,ac],q.rbind(H.headerEventHandler,null,A));}},syncUI:function(){var A=this;A.get(O).addClass(K);A.get(I).addClass(l);},animate:function(ae,af){var A=this;A._uiSetExpanded(true);var ag=q.merge(ae,A.get(Z));A.get(O).transition(ag,q.bind(af,A));},collapse:function(){var A=this;return A.toggle(false);},expand:function(){var A=this;return A.toggle(true);},getContentHeight:function(){var ae=this;var ah=ae.get(O);var ag=ae.get(e),A;if(!ag){ae._uiSetExpanded(true);}if(ah.hasMethod(j)){var af=ah.invoke(j);if(af){A=af.bottom-af.top;}}else{A=ah.get(OFFSET_HEIGHT);}if(!ag){ae._uiSetExpanded(false);}return A;},toggle:function(af){var ae=this;if(t(af)){af=!ae.get(e);}if(ae.get(F)){if(ae.get(Q)){return af;}var ag=ae.get(O);if(t(ae[P])){ae[P]=W(ag.getStyle(o));ag.wrap(M);}var A=ae.getContentHeight();if(af){ag.setStyle(o,-(A+ae[P]));}ae.set(Q,true);ae.animate({marginTop:(af?ae[P]:-(A+ae[P]))+E},function(){ae.set(Q,false);ae.set(e,af);});}else{ae.set(e,af);}return af;},_onExpandedChange:function(ae){var A=this;A._uiSetExpanded(ae.newVal);},_uiSetExpanded:function(ae){var A=this;A.get(O).replaceClass(x[!ae],x[ae]);A.get(I).replaceClass(b[!ae],b[ae]);}}});q.Zippy=H;},"@VERSION@",{skinnable:true,requires:["aui-base","transition"]});AUI.add("aui-zippy-delegate",function(t){var e=t.Lang,m=e.isBoolean,n=e.isObject,p=e.isString,B=t.Array,b=t.config.doc,u=t.Zippy,z="-",x=".",F="",l=" ",o="animated",f="click",q="closeAllOnExpand",v="container",h="content",w="cubic-bezier",j="expanded",a="firstChild",y="header",d="keydown",k="linear",D="transition",g="wrapper",E="zippy",r="zippy:animatingChange",s="zippy-delegate",C=t.getClassName,c=C(E,h,g);var i=t.Component.create({NAME:s,ATTRS:{animated:{validator:m,value:false,writeOnce:true},closeAllOnExpand:{validator:m,value:false},container:{setter:t.one,value:b},content:{validator:p},expanded:{validator:m,value:true},header:{validator:p},transition:{validator:n,value:{duration:0.4,easing:w}}},EXTENDS:t.Base,prototype:{items:null,initializer:function(){var A=this;A.bindUI();A.renderUI();},renderUI:function(){var A=this;if(A.get(q)){A.items=[];A.get(v).all(A.get(y)).each(function(G){A.items.push(A._create(G));});}},bindUI:function(){var A=this;var G=A.get(v);var H=A.get(y);A.on(r,t.bind(A._onAnimatingChange,A));G.delegate([f,d],t.bind(A.headerEventHandler,A),H);},findContentNode:function(J){var G=this;var H=G.get(h);var A=J.next(H)||J.one(H);if(!A){var I=J.next(x+c);if(I){A=I.get(a);}}return A;},headerEventHandler:function(H){var A=this;if(A.animating){return false;}var I=H.currentTarget;var G=I.getData(E)||A._create(I);if(u.headerEventHandler(H,G)&&A.get(q)){B.each(A.items,function(K,J,L){if(K!==G&&K.get(j)){K.collapse();}});}},_create:function(H){var A=this;var G=new u({animated:A.get(o),bindDOMEvents:false,bubbleTargets:[A],content:A.findContentNode(H),expanded:A.get(j),header:H,transition:A.get(D)});return G;},_onAnimatingChange:function(G){var A=this;A.animating=G.newVal;}}});t.ZippyDelegate=i;},"@VERSION@",{skinnable:false,requires:["aui-zippy-base"]});AUI.add("aui-zippy",function(a){},"@VERSION@",{use:["aui-zippy-base","aui-zippy-delegate"],skinnable:true});