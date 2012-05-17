/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("editor-bidi",function(a){var b=function(){b.superclass.constructor.apply(this,arguments);},i="host",h="dir",f="BODY",d="nodeChange",e="bidiContextChange",c=f+" > p",g="style";a.extend(b,a.Base,{lastDirection:null,firstEvent:null,_checkForChange:function(){var k=this.get(i),m=k.getInstance(),l=new m.EditorSelection(),j,n;if(l.isCollapsed){j=b.blockParent(l.focusNode);if(j){n=j.getStyle("direction");if(n!==this.lastDirection){k.fire(e,{changedTo:n});this.lastDirection=n;}}}else{k.fire(e,{changedTo:"select"});this.lastDirection=null;}},_afterNodeChange:function(j){if(this.firstEvent||b.EVENTS[j.changedType]){this._checkForChange();this.firstEvent=false;}},_afterMouseUp:function(j){this._checkForChange();this.firstEvent=false;},initializer:function(){var j=this.get(i);this.firstEvent=true;j.after(d,a.bind(this._afterNodeChange,this));j.after("dom:mouseup",a.bind(this._afterMouseUp,this));}},{EVENTS:{"backspace-up":true,"pageup-up":true,"pagedown-down":true,"end-up":true,"home-up":true,"left-up":true,"up-up":true,"right-up":true,"down-up":true,"delete-up":true},BLOCKS:a.EditorSelection.BLOCKS,DIV_WRAPPER:"<DIV></DIV>",blockParent:function(l,k){var j=l,n,m;if(!j){j=a.one(f);}if(!j.test(b.BLOCKS)){j=j.ancestor(b.BLOCKS);}if(k&&j.test(f)){n=a.Node.create(b.DIV_WRAPPER);j.get("children").each(function(p,o){if(o===0){m=p;}else{n.append(p);}});m.replace(n);n.prepend(m);j=n;}return j;},_NODE_SELECTED:"bidiSelected",addParents:function(m){var j,l,k;for(j=0;j<m.length;j+=1){m[j].setData(b._NODE_SELECTED,true);}for(j=0;j<m.length;j+=1){l=m[j].get("parentNode");if(!l.test(f)&&!l.getData(b._NODE_SELECTED)){k=true;l.get("children").some(function(n){if(!n.getData(b._NODE_SELECTED)){k=false;return true;}});if(k){m.push(l);l.setData(b._NODE_SELECTED,true);}}}for(j=0;j<m.length;j+=1){m[j].clearData(b._NODE_SELECTED);}return m;},NAME:"editorBidi",NS:"editorBidi",ATTRS:{host:{value:false}},RE_TEXT_ALIGN:/text-align:\s*\w*\s*;/,removeTextAlign:function(j){if(j){if(j.getAttribute(g).match(b.RE_TEXT_ALIGN)){j.setAttribute(g,j.getAttribute(g).replace(b.RE_TEXT_ALIGN,""));}if(j.hasAttribute("align")){j.removeAttribute("align");}}return j;}});a.namespace("Plugin");a.Plugin.EditorBidi=b;a.Plugin.ExecCommand.COMMANDS.bidi=function(m,s){var p=this.getInstance(),k=new p.EditorSelection(),r=this.get(i).get(i).editorBidi,j,n,o,t,l;if(!r){a.error("bidi execCommand is not available without the EditorBiDi plugin.");return;}p.EditorSelection.filterBlocks();if(k.isCollapsed){n=b.blockParent(k.anchorNode);if(!n){n=p.one("body").one(p.EditorSelection.BLOCKS);}n=b.removeTextAlign(n);if(!s){l=n.getAttribute(h);if(!l||l=="ltr"){s="rtl";}else{s="ltr";}}n.setAttribute(h,s);if(a.UA.ie){var q=n.all("br.yui-cursor");if(q.size()===1&&n.get("childNodes").size()==1){q.remove();}}j=n;}else{o=k.getSelected();t=[];o.each(function(u){t.push(b.blockParent(u));});t=p.all(b.addParents(t));t.each(function(v){var u=s;v=b.removeTextAlign(v);if(!u){l=v.getAttribute(h);if(!l||l=="ltr"){u="rtl";}else{u="ltr";}}v.setAttribute(h,u);});j=t;}r._checkForChange();return j;};},"3.6.0pr1",{skinnable:false,requires:["editor-base"]});