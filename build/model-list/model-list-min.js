/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0
build: 3.6.0
*/
YUI.add("model-list",function(b){var g=b.Attribute.prototype,j=b.Lang,k=b.Array,c="add",e="create",h="error",i="load",d="remove",f="reset";function a(){a.superclass.constructor.apply(this,arguments);}b.ModelList=b.extend(a,b.Base,{model:b.Model,_isYUIModelList:true,initializer:function(m){m||(m={});var l=this.model=m.model||this.model;if(typeof l==="string"){this.model=b.Object.getValue(b,l.split("."));if(!this.model){b.error("ModelList: Model class not found: "+l);}}this.publish(c,{defaultFn:this._defAddFn});this.publish(f,{defaultFn:this._defResetFn});this.publish(d,{defaultFn:this._defRemoveFn});this.after("*:idChange",this._afterIdChange);this._clear();},destructor:function(){this._clear();},add:function(n,l){var m=n._isYUIModelList;if(m||j.isArray(n)){return k.map(m?n.toArray():n,function(p,o){var q=l||{};if("index" in q){q=b.merge(q,{index:q.index+o});}return this._add(p,q);},this);}else{return this._add(n,l);}},create:function(n,m,o){var l=this;if(typeof m==="function"){o=m;m={};}m||(m={});if(!n._isYUIModel){n=new this.model(n);}l.fire(e,b.merge(m,{model:n}));return n.save(m,function(p){if(!p){l.add(n,m);}o&&o.apply(null,arguments);});},each:function(q,p){var m=this._items.concat(),n,o,l;for(n=0,l=m.length;n<l;n++){o=m[n];q.call(p||o,o,n,this);}return this;},filter:function(o,s){var n=[],m=this._items,p,q,l,r;if(typeof o==="function"){s=o;o={};}for(p=0,l=m.length;p<l;++p){q=m[p];if(s.call(this,q,p,this)){n.push(q);}}if(o.asList){r=new this.constructor({model:this.model});if(n.length){r.add(n,{silent:true});}return r;}else{return n;}},get:function(l){if(this.attrAdded(l)){return g.get.apply(this,arguments);}return this.invoke("get",l);},getAsHTML:function(l){if(this.attrAdded(l)){return b.Escape.html(g.get.apply(this,arguments));}return this.invoke("getAsHTML",l);},getAsURL:function(l){if(this.attrAdded(l)){return encodeURIComponent(g.get.apply(this,arguments));}return this.invoke("getAsURL",l);},getByClientId:function(l){return this._clientIdMap[l]||null;},getById:function(l){return this._idMap[l]||null;},invoke:function(m){var l=[this._items,m].concat(k(arguments,1,true));return k.invoke.apply(k,l);},load:function(m,n){var l=this;if(typeof m==="function"){n=m;m={};}m||(m={});this.sync("read",m,function(r,p){var q={options:m,response:p},o;if(r){q.error=r;q.src="load";l.fire(h,q);}else{if(!l._loadEvent){l._loadEvent=l.publish(i,{preventable:false});}o=q.parsed=l.parse(p);l.reset(o,m);l.fire(i,q);}n&&n.apply(null,arguments);});return this;},map:function(l,m){return k.map(this._items,l,m);},parse:function(l){if(typeof l==="string"){try{return b.JSON.parse(l)||[];}catch(m){this.fire(h,{error:m,response:l,src:"parse"});return null;}}return l||[];},remove:function(n,l){var m=n._isYUIModelList;if(m||j.isArray(n)){n=k.map(m?n.toArray():n,function(o){if(j.isNumber(o)){return this.item(o);}return o;},this);return k.map(n,function(o){return this._remove(o,l);},this);}else{return this._remove(n,l);}},reset:function(n,l){n||(n=[]);l||(l={});var m=b.merge({src:"reset"},l);if(n._isYUIModelList){n=n.toArray();}else{n=k.map(n,function(o){return o._isYUIModel?o:new this.model(o);},this);}m.models=n;if(l.silent){this._defResetFn(m);}else{if(this.comparator){n.sort(b.bind(this._sort,this));}this.fire(f,m);}return this;},some:function(q,p){var m=this._items.concat(),n,o,l;for(n=0,l=m.length;n<l;n++){o=m[n];if(q.call(p||o,o,n,this)){return true;}}return false;},sort:function(l){if(!this.comparator){return this;}var n=this._items.concat(),m;l||(l={});n.sort(b.bind(this._sort,this));m=b.merge(l,{models:n,src:"sort"});l.silent?this._defResetFn(m):this.fire(f,m);return this;},sync:function(){var l=k(arguments,0,true).pop();if(typeof l==="function"){l();}},toArray:function(){return this._items.concat();},toJSON:function(){return this.map(function(l){return l.toJSON();});},_add:function(m,l){var n,o;l||(l={});if(!m._isYUIModel){m=new this.model(m);}o=m.get("id");if(this._clientIdMap[m.get("clientId")]||(j.isValue(o)&&this._idMap[o])){this.fire(h,{error:"Model is already in the list.",model:m,src:"add"});return;}n=b.merge(l,{index:"index" in l?l.index:this._findIndex(m),model:m});l.silent?this._defAddFn(n):this.fire(c,n);return m;},_attachList:function(l){l.lists.push(this);l.addTarget(this);},_clear:function(){k.each(this._items,this._detachList,this);this._clientIdMap={};this._idMap={};this._items=[];},_compare:function(m,l){return m<l?-1:(m>l?1:0);},_detachList:function(m){var l=k.indexOf(m.lists,this);if(l>-1){m.lists.splice(l,1);m.removeTarget(this);}},_findIndex:function(o){var m=this._items,l=m.length,p=0,q,n,r;if(!this.comparator||!l){return l;}r=this.comparator(o);while(p<l){n=(p+l)>>1;q=m[n];if(this._compare(this.comparator(q),r)<0){p=n+1;}else{l=n;}}return p;},_remove:function(n,m){var l,o;m||(m={});if(j.isNumber(n)){l=n;n=this.item(l);}else{l=this.indexOf(n);}if(l===-1||!n){this.fire(h,{error:"Model is not in the list.",index:l,model:n,src:"remove"});return;}o=b.merge(m,{index:l,model:n});m.silent?this._defRemoveFn(o):this.fire(d,o);return n;},_sort:function(m,l){return this._compare(this.comparator(m),this.comparator(l));},_afterIdChange:function(n){var l=n.newVal,o=n.prevVal,m=n.target;if(j.isValue(o)){if(this._idMap[o]===m){delete this._idMap[o];}else{return;}}else{if(this.indexOf(m)===-1){return;}}if(j.isValue(l)){this._idMap[l]=m;}},_defAddFn:function(m){var l=m.model,n=l.get("id");this._clientIdMap[l.get("clientId")]=l;if(j.isValue(n)){this._idMap[n]=l;}this._attachList(l);this._items.splice(m.index,0,l);},_defRemoveFn:function(m){var l=m.model,n=l.get("id");this._detachList(l);delete this._clientIdMap[l.get("clientId")];if(j.isValue(n)){delete this._idMap[n];}this._items.splice(m.index,1);},_defResetFn:function(l){if(l.src==="sort"){this._items=l.models.concat();return;}this._clear();if(l.models.length){this.add(l.models,{silent:true});}}},{NAME:"modelList"});b.augment(a,b.ArrayList);},"3.6.0",{requires:["array-extras","array-invoke","arraylist","base-build","escape","json-parse","model"]});
