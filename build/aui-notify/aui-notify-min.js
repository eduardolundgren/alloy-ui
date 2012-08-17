AUI.add("aui-notify",function(u){var d=u.Lang,b=d.isUndefined,z="alert",G="boundingBox",p="contentBox",c="info",i="notice",C="shadow",E="showTransition",D="text",a="timeout",q="title",m="type",t="notify-item",F=u.ClassNameManager.getClassName;u.NotifyItem=u.Base.create(t,u.Widget,[u.WidgetAutohide,u.WidgetChild,u.WidgetPosition,u.WidgetPositionAlign,u.WidgetStdMod],{bindUI:function(){var A=this;A.after({render:A._afterRender,visibleChange:A._afterVisibleChange});},renderUI:function(){var A=this,J=A.get(G),L=A.get(E),K=A.get(m);if(K){J.addClass(F(t,K));}if(L){J.transition(L);}},syncUI:function(){var A=this,K=A.get(D),J=A.get(q);if(!b(J)){A.setStdModContent(u.WidgetStdMod.HEADER,J);}if(!b(K)){A.setStdModContent(u.WidgetStdMod.BODY,K);}},_afterRender:function(){var A=this,J=A.get(a);if(J>0){setTimeout(function(){A.hide();},J);}},_afterVisibleChange:function(M){var A=this,L=A.get(G),J=A.get("hideTransition");if(M.newVal){return;}if(J){L.transition(J,function(){var N=A.get("index");A.fire("hide",{index:N});});}else{var K=A.get("index");A.fire("hide",{index:K});}}},{ATTRS:{hideOn:{valueFn:function(){return[{node:this.get(G),eventName:"click"}];},validator:u.Lang.isArray},hideTransition:{value:{opacity:0}},showTransition:{value:{opacity:1}},text:{},timeout:{value:2000},title:{},type:{validator:function(A){return(A===z||A===c||A===i);},value:z}}});var B="body",I="center",v="direction",k="id",H="indent",g="maxRows",x="region",j="bottom",s="bottom-left",f="bottom-right",o="left",l="right",w="top",y="top-left",e="top-right",r="position",n={},h="px";u.NotifyContainer=u.Base.create("notify-container",u.Widget,[u.WidgetParent],{handles:null,regions:null,initializer:function(){var A=this;A.handles={};A.regions={};n[j]=[u.WidgetPositionAlign.TL,u.WidgetPositionAlign.BL];n[s]=[u.WidgetPositionAlign.BL,u.WidgetPositionAlign.BL];n[f]=[u.WidgetPositionAlign.BR,u.WidgetPositionAlign.BR];n[o]=[u.WidgetPositionAlign.TR,u.WidgetPositionAlign.TL];n[l]=[u.WidgetPositionAlign.TL,u.WidgetPositionAlign.TR];n[w]=[u.WidgetPositionAlign.BL,u.WidgetPositionAlign.TL];n[y]=[u.WidgetPositionAlign.TL,u.WidgetPositionAlign.TL];n[e]=[u.WidgetPositionAlign.TR,u.WidgetPositionAlign.TR];},bindUI:function(){var A=this;A.after("addChild",A._afterAdd);A.after("notify-item:hide",A._afterHide);},_afterAdd:function(A){var S=this,K=A.child,Q=S.get(v),T=S.size(),L=S.get(H),O=A.index,J=B,M=n[S.get(r)];if(T>1){var R=S.get(g),P;if((T%R)===1){P=S.item(O-R);J=P.get(G);M=n[L];}else{P=S.item(O-1);J=P.get(G);M=n[Q];}}if(M===I){K.centered(J);}else{K.align(J,M);}var N=K.after(function(){S.regions[K.get(k)]=K.get(G).get(x);},K,"_doAlign");S.handles[K.get(k)]=N;},_afterHide:function(K){var A=this,J=K.index;A._syncRegions(J);A._moveChildren(J);var M=A.item(J).get(k);var L=A.handles[M];L.detach();delete A.handles[M];delete A.regions[M];A.remove(J);},_moveChildren:function(J){var A=this;A.each(function(N,K){if(K<=J){return;}var M=A.regions[N.get(k)];if(!M){return;}var L=N.get(G);L.transition({top:M.top+h,left:M.left+h});});},_syncRegions:function(J){var A=this;var L=A.size()-1;for(;L>J;L--){var M=A.item(L);var K=A.item(L-1);A.regions[M.get(k)]=A.regions[K.get(k)];}}},{ATTRS:{alignNode:{value:B},defaultChildType:{value:u.NotifyItem,readOnly:true},direction:{valueFn:function(){var A=this.get(r);if(A.indexOf(w)===0){return j;}else{if(A.indexOf(j)===0){return w;}}return undefined;}},indent:{valueFn:function(){var A=this.get(r);if(A.indexOf(l)!==-1){return o;}else{if(A.indexOf(o)!==-1){return l;}}return undefined;}},maxRows:{value:5},position:{value:e}}});},"@VERSION@",{skinnable:true,requires:["aui-base","transition","widget","widget-autohide","widget-child","widget-parent","widget-position","widget-position-align","widget-stdmod"]});