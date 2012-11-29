AUI.add("aui-event-delegate-submit",function(c){var b=c.Array,l=c.Object,k=c.Node,a=c.Selector,d="click",g="submit",n="after",j="submit_delegate",f="submit_on";c.Event.define(g,{delegate:function(t,s,r,q){var p=this;var u=p._prepareHandles(s,t);if(!l.owns(u,d)){u[d]=t.delegate(d,function(x){var w=x.target;if(p._getNodeName(w,"input")||p._getNodeName(w,"button")){var v=w.get("form");if(v){p._attachEvent(v,t,s,r,q);}}},q);}},detach:function(s,r,q){var p=this;p._detachEvents(s,r,q);},detachDelegate:function(s,r,q){var p=this;p._detachEvents(s,r,q);},on:function(s,r,q){var p=this;p._attachEvent(s,s,r,q);},_attachEvent:function(w,v,u,t,s){var q=this;var p=function(A){var x=true;if(s){if(!A.stopped||!q._hasParent(A._stoppedOnNode,v)){var y=v.getDOM();var z=w.getDOM();do{if(z&&a.test(z,s)){A.currentTarget=c.one(z);A.container=v;x=t.fire(A);if(A.stopped&&!A._stoppedOnNode){A._stoppedOnNode=v;}}z=z.parentNode;}while(x!==false&&!A.stopped&&z&&z!==y);x=((x!==false)&&(A.stopped!==2));}}else{x=t.fire(A);if(A.stopped&&!A._stoppedOnNode){A._stoppedOnNode=v;}}return x;};var r=q._prepareHandles(u,w);if(!l.owns(r,g)){r[g]=c.Event._attach([g,p,w,t,s?j:f]);}},_detachEvents:function(r,q,p){c.each(q._handles,function(t,u,s){c.each(t,function(x,w,v){x.detach();});});delete q._handles;},_getNodeName:function(q,p){var r=q.get("nodeName");return r&&r.toLowerCase()===p.toLowerCase();},_hasParent:function(p,q){return p.ancestor(function(r){return r===q;},false);},_prepareHandles:function(r,q){if(!l.owns(r,"_handles")){r._handles={};}var p=r._handles;if(!l.owns(p,q)){p[q]={};}return p[q];}},true);var i=c.CustomEvent.prototype._on;c.CustomEvent.prototype._on=function(u,s,r,q){var p=this;var t=i.apply(p,arguments);if(p._kds){o.call(p,t,u,s,r,q);}else{e.call(p,t,u,s,r,q);}return t;};function m(r){var p=this;var q=b.some(r,function(t,s){if(t.args&&t.args[0]===j){var u=r.splice(r.length-1,1)[0];r.splice(s,0,u);return true;}});}function h(r,t){var p=t;var s={};var u=t[r.sub.id];var q=false;l.each(t,function(w,v){if(!q&&w.args&&w.args[0]===j){s[u.id]=u;q=true;}if(w!==u){s[w.id]=w;}});if(q){p=s;}return p;}function e(u,t,s,r,q){var p=this;if(r&&r[0]===f){if(q===n&&p._afters.length){m.call(p,p._afters);}else{if(p._subscribers.length){m.call(p,p._subscribers);}}}}function o(u,t,s,r,q){var p=this;if(r&&r[0]===f){if(q===n&&!l.isEmpty(p.afters)){p.afters=h.call(p,u,p.afters);}else{if(!l.isEmpty(p.subscribers)){p.subscribers=h.call(p,p.subscribers);}}}}},"@VERSION@",{requires:["aui-node-base","aui-event-base"],condition:{name:"aui-event-delegate-submit",trigger:"event-base-ie",ua:"ie"}});