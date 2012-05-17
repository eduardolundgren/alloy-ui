/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("widget-buttons",function(c){var i=c.Array,k=c.Lang,f=c.Object,a=c.Plugin.Button,j=c.Widget,n=c.WidgetStdMod,d=c.ClassNameManager.getClassName,e=k.isArray,m=k.isNumber,b=k.isString,h=k.isValue;function l(o){return !!o.getDOMNode;}function g(){if(!this._stdModNode){c.error("WidgetStdMod must be added to a Widget before WidgetButtons.");}this._buttonsHandles={};}g.ATTRS={buttons:{getter:"_getButtons",setter:"_setButtons",value:{}},defaultButton:{readOnly:true,value:null}};g.CLASS_NAMES={button:d("button"),buttons:j.getClassName("buttons"),primary:d("button","primary")};g.HTML_PARSER={buttons:function(o){return this._parseButtons(o);}};g.NON_BUTTON_NODE_CFG=["action","classNames","context","events","isDefault","section"];g.prototype={BUTTONS:{},BUTTONS_TEMPLATE:"<span />",DEFAULT_BUTTONS_SECTION:n.FOOTER,initializer:function(){this._mapButtons(this.get("buttons"));this._updateDefaultButton();this.after("buttonsChange",c.bind("_afterButtonsChange",this));c.after(this._bindUIButtons,this,"bindUI");c.after(this._syncUIButtons,this,"syncUI");},destructor:function(){f.each(this._buttonsHandles,function(o){o.detach();});delete this._buttonsHandles;delete this._buttonsMap;delete this._defaultButton;},addButton:function(q,t,o){var s=this.get("buttons"),r,p;if(!l(q)){q=this._mergeButtonConfig(q);t||(t=q.section);}t||(t=this.DEFAULT_BUTTONS_SECTION);r=s[t]||(s[t]=[]);m(o)||(o=r.length);r.splice(o,0,q);p=i.indexOf(r,q);this.set("buttons",s,{button:q,section:t,index:p,src:"add"});return this;},getButton:function(o,r){if(!h(o)){return;}var q=this._buttonsMap,p;r||(r=this.DEFAULT_BUTTONS_SECTION);if(m(o)){p=this.get("buttons");return p[r]&&p[r][o];}return arguments.length>1?q[r+":"+o]:q[o];},removeButton:function(p,r){if(!h(p)){return this;}var q=this.get("buttons"),o;if(m(p)){r||(r=this.DEFAULT_BUTTONS_SECTION);o=p;p=q[r][o];}else{if(b(p)){p=this.getButton.apply(this,arguments);}f.some(q,function(s,t){o=i.indexOf(s,p);if(o>-1){r=t;return true;}});}if(p&&o>-1){q[r].splice(o,1);this.set("buttons",q,{button:p,section:r,index:o,src:"remove"});}return this;},_bindUIButtons:function(){var o=c.bind("_afterContentChangeButtons",this);this.after({defaultButtonChange:c.bind("_afterDefaultButtonChange",this),visibleChange:c.bind("_afterVisibleChangeButtons",this),headerContentChange:o,bodyContentChange:o,footerContentChange:o});},_createButton:function(t){var q,p,w,s,v,r,o,u;if(l(t)){return c.one(t.getDOMNode()).plug(a);}q=c.merge({context:this,events:"click",label:t.value},t);p=c.merge(q);w=g.NON_BUTTON_NODE_CFG;for(s=0,v=w.length;s<v;s+=1){delete p[w[s]];}t=a.createNode(p);o=q.context;r=q.action;if(b(r)){r=c.bind(r,o);}u=t.on(q.events,r,o);this._buttonsHandles[c.stamp(t,true)]=u;t.setData("name",this._getButtonName(q));t.setData("default",this._getButtonDefault(q));i.each(i(q.classNames),t.addClass,t);return t;},_getButtonContainer:function(t,r){var u=n.SECTION_CLASS_NAMES[t],s=g.CLASS_NAMES.buttons,q=this.get("contentBox"),o,p;o="."+u+" ."+s;p=q.one(o);if(!p&&r){p=c.Node.create(this.BUTTONS_TEMPLATE);p.addClass(s);}return p;},_getButtonDefault:function(o){var p=l(o)?o.getData("default"):o.isDefault;if(b(p)){return p.toLowerCase()==="true";}return !!p;},_getButtonName:function(p){var o;if(l(p)){o=p.getData("name")||p.get("name");}else{o=p&&(p.name||p.type);}return o;},_getButtons:function(p){var o={};f.each(p,function(q,r){o[r]=q.concat();});return o;},_mapButton:function(p,s){var r=this._buttonsMap,o=this._getButtonName(p),q=this._getButtonDefault(p);if(o){r[o]=p;r[s+":"+o]=p;}q&&(this._defaultButton=p);},_mapButtons:function(o){this._buttonsMap={};this._defaultButton=null;f.each(o,function(r,s){var q,p;for(q=0,p=r.length;q<p;q+=1){this._mapButton(r[q],s);}},this);},_mergeButtonConfig:function(r){var o,u,q,t,s,p;r=b(r)?{name:r}:c.merge(r);if(r.srcNode){t=r.srcNode;s=t.get("tagName").toLowerCase();p=t.get(s==="input"?"value":"text");o={disabled:!!t.get("disabled"),isDefault:this._getButtonDefault(t),name:this._getButtonName(t)};p&&(o.label=p);c.mix(r,o,false,null,0,true);}q=this._getButtonName(r);u=this.BUTTONS&&this.BUTTONS[q];if(u){c.mix(r,u,false,null,0,true);}return r;},_parseButtons:function(q){var o="."+g.CLASS_NAMES.button,r=["header","body","footer"],p=null;i.each(r,function(v){var s=this._getButtonContainer(v),u=s&&s.all(o),t;if(!u||u.isEmpty()){return;}t=[];u.each(function(w){t.push({srcNode:w});});p||(p={});p[v]=t;},this);return p;},_setButtons:function(q){var p=this.DEFAULT_BUTTONS_SECTION,r={};function o(v,x){if(!e(v)){return;}var u,s,t,w;for(u=0,s=v.length;u<s;u+=1){t=v[u];w=x;if(!l(t)){t=this._mergeButtonConfig(t);w||(w=t.section);}t=this._createButton(t);w||(w=p);(r[w]||(r[w]=[])).push(t);}}if(e(q)){o.call(this,q);}else{f.each(q,o,this);}return r;},_syncUIButtons:function(){this._uiSetButtons(this.get("buttons"));this._uiSetDefaultButton(this.get("defaultButton"));this._uiSetVisibleButtons(this.get("visible"));},_uiInsertButton:function(q,t,p){var s=g.CLASS_NAMES.button,o=this._getButtonContainer(t,true),r=o.all("."+s);o.insertBefore(q,r.item(p));this.setStdModContent(t,o,"after");},_uiRemoveButton:function(s,v,p){var r=c.stamp(s,this),q=this._buttonsHandles,u=q[r],o,t;u&&u.detach();delete q[r];s.remove();p||(p={});if(!p.preserveContent){o=this._getButtonContainer(v);t=g.CLASS_NAMES.button;if(o&&o.all("."+t).isEmpty()){o.remove();this._updateContentButtons(v);}}},_uiSetButtons:function(o){var p=g.CLASS_NAMES.button,q=["header","body","footer"];i.each(q,function(y){var w=o[y]||[],t=w.length,z=this._getButtonContainer(y,t),x=false,s,u,v,r;if(!z){return;}s=z.all("."+p);for(u=0;u<t;u+=1){v=w[u];r=s?s.indexOf(v):-1;if(r>-1){s.splice(r,1);if(r!==u){z.insertBefore(v,u+1);x=true;}}else{z.appendChild(v);x=true;}}s.each(function(A){this._uiRemoveButton(A,y,{preserveContent:true});x=true;},this);if(t===0){z.remove();this._updateContentButtons(y);return;}if(x){this.setStdModContent(y,z,"after");}},this);},_uiSetDefaultButton:function(q,p){var o=g.CLASS_NAMES.primary;q&&q.addClass(o);p&&p.removeClass(o);
},_uiSetVisibleButtons:function(p){if(!p){return;}var o=this.get("defaultButton");if(o){o.focus();}},_unMapButton:function(q,s){var r=this._buttonsMap,p=this._getButtonName(q),o;if(p){if(r[p]===q){delete r[p];}o=s+":"+p;if(r[o]===q){delete r[o];}}if(this._defaultButton===q){this._defaultButton=null;}},_updateDefaultButton:function(){var o=this._defaultButton;if(this.get("defaultButton")!==o){this._set("defaultButton",o);}},_updateContentButtons:function(p){var o=this.getStdModNode(p).get("childNodes");this.set(p+"Content",o.isEmpty()?null:o,{src:"buttons"});},_afterButtonsChange:function(s){var q=s.newVal,r=s.section,o=s.index,t=s.src,p;if(t==="add"){p=q[r][o];this._mapButton(p,r);this._updateDefaultButton();this._uiInsertButton(p,r,o);return;}if(t==="remove"){p=s.button;this._unMapButton(p,r);this._updateDefaultButton();this._uiRemoveButton(p,r);return;}this._mapButtons(q);this._updateDefaultButton();this._uiSetButtons(q);},_afterContentChangeButtons:function(p){var q=p.src,r=p.stdModPosition,o=!r||r===n.REPLACE;if(o&&q!=="buttons"&&q!==j.UI_SRC){this._uiSetButtons(this.get("buttons"));}},_afterDefaultButtonChange:function(o){this._uiSetDefaultButton(o.newVal,o.prevVal);},_afterVisibleChangeButtons:function(o){this._uiSetVisibleButtons(o.newVal);}};c.WidgetButtons=g;},"3.6.0pr1",{requires:["button-plugin","cssbutton","widget-stdmod"]});