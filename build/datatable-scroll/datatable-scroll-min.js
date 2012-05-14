/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add("datatable-scroll",function(g){var d=g.Lang,a=d.isString,e=d.isNumber,c=d.isArray,b;function f(i,h){return parseInt(i.getComputedStyle(h),10)|0;}g.DataTable.Scrollable=b=function(){};b.ATTRS={scrollable:{value:false,setter:"_setScrollable"}};g.mix(b.prototype,{scrollTo:function(i){var h;if(i&&this._tbodyNode&&(this._yScrollNode||this._xScrollNode)){if(c(i)){h=this.getCell(i);}else{if(e(i)){h=this.getRow(i);}else{if(a(i)){h=this._tbodyNode.one("#"+i);}else{if(i instanceof g.Node&&i.ancestor(".yui3-datatable")===this.get("boundingBox")){h=i;}}}}h&&h.scrollIntoView();}return this;},_CAPTION_TABLE_TEMPLATE:'<table class="{className}" role="presentation"></table>',_SCROLL_LINER_TEMPLATE:'<div class="{className}"></div>',_SCROLLBAR_TEMPLATE:'<div class="{className}"><div></div></div>',_X_SCROLLER_TEMPLATE:'<div class="{className}"></div>',_Y_SCROLL_HEADER_TEMPLATE:'<table cellspacing="0" aria-hidden="true" class="{className}"></table>',_Y_SCROLLER_TEMPLATE:'<div class="{className}"><div class="{scrollerClassName}"></div></div>',_addScrollbarPadding:function(){var j=this._yScrollHeader,l="."+this.getClassName("header"),m,n,o,k,h;if(j){m=g.DOM.getScrollbarWidth()+"px";n=j.all("tr");for(k=0,h=n.size();k<h;k+=+o.get("rowSpan")){o=n.item(k).all(l).pop();o.setStyle("paddingRight",m);}}},_afterScrollableChange:function(i){var h=this._xScrollNode;if(this._xScroll&&h){if(this._yScroll&&!this._yScrollNode){h.setStyle("paddingRight",g.DOM.getScrollbarWidth()+"px");}else{if(!this._yScroll&&this._yScrollNode){h.setStyle("paddingRight","");}}}this._syncScrollUI();},_afterScrollCaptionChange:function(h){if(this._xScroll||this._yScroll){this._syncScrollUI();}},_afterScrollColumnsChange:function(h){if(this._xScroll||this._yScroll){if(this._yScroll&&this._yScrollHeader){this._syncScrollHeaders();}this._syncScrollUI();}},_afterScrollDataChange:function(h){if(this._xScroll||this._yScroll){this._syncScrollUI();}},_afterScrollHeightChange:function(h){if(this._yScroll){this._syncScrollUI();}},_afterScrollSort:function(i){var j,h;if(this._yScroll&&this._yScrollHeader){h="."+this.getClassName("header");j=this._theadNode.all(h);this._yScrollHeader.all(h).each(function(l,k){l.set("className",j.item(k).get("className"));});}},_afterScrollWidthChange:function(h){if(this._xScroll||this._yScroll){this._syncScrollUI();}},_bindScrollbar:function(){var i=this._scrollbarNode,h=this._yScrollNode;if(i&&h&&!this._scrollbarEventHandle){this._scrollbarEventHandle=new g.Event.Handle([i.on("scroll",this._syncScrollPosition,this,"virtual"),h.on("scroll",this._syncScrollPosition,this)]);}},_bindScrollResize:function(){if(!this._scrollResizeHandle){this._scrollResizeHandle=g.on("resize",this._syncScrollUI,null,this);}},_bindScrollUI:function(){this.after({columnsChange:g.bind("_afterScrollColumnsChange",this),heightChange:g.bind("_afterScrollHeightChange",this),widthChange:g.bind("_afterScrollWidthChange",this),captionChange:g.bind("_afterScrollCaptionChange",this),scrollableChange:g.bind("_afterScrollableChange",this),sort:g.bind("_afterScrollSort",this)});this.after(["dataChange","*:add","*:remove","*:reset","*:change"],g.bind("_afterScrollDataChange",this));},_clearScrollLock:function(){if(this._scrollLock){this._scrollLock.cancel();delete this._scrollLock;}},_createScrollbar:function(){var h=this._scrollbarNode;if(!h){h=this._scrollbarNode=g.Node.create(g.Lang.sub(this._SCROLLBAR_TEMPLATE,{className:this.getClassName("scrollbar")}));h.setStyle("width",(g.DOM.getScrollbarWidth()+1)+"px");}return h;},_createScrollCaptionTable:function(){if(!this._captionTable){this._captionTable=g.Node.create(g.Lang.sub(this._CAPTION_TABLE_TEMPLATE,{className:this.getClassName("caption","table")}));this._captionTable.empty();}return this._captionTable;},_createXScrollNode:function(){if(!this._xScrollNode){this._xScrollNode=g.Node.create(g.Lang.sub(this._X_SCROLLER_TEMPLATE,{className:this.getClassName("x","scroller")}));}return this._xScrollNode;},_createYScrollHeader:function(){var h=this._yScrollHeader;if(!h){h=this._yScrollHeader=g.Node.create(g.Lang.sub(this._Y_SCROLL_HEADER_TEMPLATE,{className:this.getClassName("scroll","columns")}));}return h;},_createYScrollNode:function(){var h;if(!this._yScrollNode){h=this.getClassName("y","scroller");this._yScrollContainer=g.Node.create(g.Lang.sub(this._Y_SCROLLER_TEMPLATE,{className:this.getClassName("y","scroller","container"),scrollerClassName:h}));this._yScrollNode=this._yScrollContainer.one("."+h);}return this._yScrollContainer;},_disableScrolling:function(){this._removeScrollCaptionTable();this._disableXScrolling();this._disableYScrolling();this._unbindScrollResize();this._uiSetWidth(this.get("width"));},_disableXScrolling:function(){this._removeXScrollNode();},_disableYScrolling:function(){this._removeYScrollHeader();this._removeYScrollNode();this._removeYScrollContainer();this._removeScrollbar();},destructor:function(){this._unbindScrollbar();this._unbindScrollResize();this._clearScrollLock();},initializer:function(){this._setScrollProperties();this.after(["scrollableChange","heightChange","widthChange"],this._setScrollProperties);g.Do.after(this._bindScrollUI,this,"bindUI");g.Do.after(this._syncScrollUI,this,"syncUI");},_removeScrollCaptionTable:function(){if(this._captionTable){if(this._captionNode){this._tableNode.prepend(this._captionNode);}this._captionTable.remove().destroy(true);delete this._captionTable;}},_removeXScrollNode:function(){var h=this._xScrollNode;if(h){h.replace(h.get("childNodes").toFrag());h.remove().destroy(true);delete this._xScrollNode;}},_removeYScrollContainer:function(){var h=this._yScrollContainer;if(h){h.replace(h.get("childNodes").toFrag());h.remove().destroy(true);delete this._yScrollContainer;}},_removeYScrollHeader:function(){if(this._yScrollHeader){this._yScrollHeader.remove().destroy(true);delete this._yScrollHeader;}},_removeYScrollNode:function(){var h=this._yScrollNode;if(h){h.replace(h.get("childNodes").toFrag());h.remove().destroy(true);delete this._yScrollNode;
}},_removeScrollbar:function(){if(this._scrollbarNode){this._scrollbarNode.remove().destroy(true);delete this._scrollbarNode;}if(this._scrollbarEventHandle){this._scrollbarEventHandle.detach();delete this._scrollbarEventHandle;}},_setScrollable:function(h){if(h===true){h="xy";}if(a(h)){h=h.toLowerCase();}return(h===false||h==="y"||h==="x"||h==="xy")?h:g.Attribute.INVALID_VALUE;},_setScrollProperties:function(){var j=this.get("scrollable")||"",i=this.get("width"),h=this.get("height");this._xScroll=i&&j.indexOf("x")>-1;this._yScroll=h&&j.indexOf("y")>-1;},_syncScrollPosition:function(j,i){var k=this._scrollbarNode,h=this._yScrollNode;if(k&&h){if(this._scrollLock&&this._scrollLock.source!==i){return;}this._clearScrollLock();this._scrollLock=g.later(300,this,this._clearScrollLock);this._scrollLock.source=i;if(i==="virtual"){h.set("scrollTop",k.get("scrollTop"));}else{k.set("scrollTop",h.get("scrollTop"));}}},_syncScrollCaptionUI:function(){var h=this._captionNode,i=this._tableNode,j=this._captionTable,k;if(h){k=h.getAttribute("id");if(!j){j=this._createScrollCaptionTable();this.get("contentBox").prepend(j);}if(!h.get("parentNode").compareTo(j)){j.empty().insert(h);if(!k){k=g.stamp(h);h.setAttribute("id",k);}i.setAttribute("aria-describedby",k);}}else{if(j){this._removeScrollCaptionTable();}}},_syncScrollColumnWidths:function(){var h=[];if(this._theadNode&&this._yScrollHeader){this._theadNode.all("."+this.getClassName("header")).each(function(i){h.push((g.UA.ie&&g.UA.ie<8)?(i.get("clientWidth")-f(i,"paddingLeft")-f(i,"paddingRight"))+"px":i.getComputedStyle("width"));});this._yScrollHeader.all("."+this.getClassName("scroll","liner")).each(function(j,k){j.setStyle("width",h[k]);});}},_syncScrollHeaders:function(){var h=this._yScrollHeader,j=this._SCROLL_LINER_TEMPLATE,k=this.getClassName("scroll","liner"),i=this.getClassName("header"),l=this._theadNode.all("."+i);if(this._theadNode&&h){h.empty().appendChild(this._theadNode.cloneNode(true));h.all("[id]").removeAttribute("id");h.all("."+i).each(function(p,n){var m=g.Node.create(g.Lang.sub(j,{className:k})),o=l.item(n);m.setStyle("padding",o.getComputedStyle("paddingTop")+" "+o.getComputedStyle("paddingRight")+" "+o.getComputedStyle("paddingBottom")+" "+o.getComputedStyle("paddingLeft"));m.appendChild(p.get("childNodes").toFrag());p.appendChild(m);},this);this._syncScrollColumnWidths();this._addScrollbarPadding();}},_syncScrollUI:function(){var h=this._xScroll,m=this._yScroll,i=this._xScrollNode,k=this._yScrollNode,l=i&&i.get("scrollLeft"),j=k&&k.get("scrollTop");this._uiSetScrollable();if(h||m){if((this.get("width")||"").slice(-1)==="%"){this._bindScrollResize();}else{this._unbindScrollResize();}this._syncScrollCaptionUI();}else{this._disableScrolling();}if(this._yScrollHeader){this._yScrollHeader.setStyle("display","none");}if(h){if(!m){this._disableYScrolling();}this._syncXScrollUI(m);}if(m){if(!h){this._disableXScrolling();}this._syncYScrollUI(h);}if(l&&this._xScrollNode){this._xScrollNode.set("scrollLeft",l);}if(j&&this._yScrollNode){this._yScrollNode.set("scrollTop",j);}},_syncXScrollUI:function(p){var k=this._xScrollNode,n=this._yScrollContainer,o=this._tableNode,j=this.get("width"),h=this.get("boundingBox").get("offsetWidth"),m=g.DOM.getScrollbarWidth(),i,l;if(!k){k=this._createXScrollNode();(n||o).replace(k).appendTo(k);}i=f(k,"borderLeftWidth")+f(k,"borderRightWidth");k.setStyle("width","");this._uiSetDim("width","");if(p&&this._yScrollContainer){this._yScrollContainer.setStyle("width","");}if(g.UA.ie&&g.UA.ie<8){o.setStyle("width",j);o.get("offsetWidth");}o.setStyle("width","");l=o.get("offsetWidth");o.setStyle("width",l+"px");this._uiSetDim("width",j);k.setStyle("width",(h-i)+"px");if((k.get("offsetWidth")-i)>l){if(p){o.setStyle("width",(k.get("offsetWidth")-i-m)+"px");}else{o.setStyle("width","100%");}}},_syncYScrollUI:function(v){var r=this._yScrollContainer,l=this._yScrollNode,j=this._xScrollNode,i=this._yScrollHeader,u=this._scrollbarNode,t=this._tableNode,q=this._theadNode,k=this._captionTable,m=this.get("boundingBox"),p=this.get("contentBox"),h=this.get("width"),s=m.get("offsetHeight"),o=g.DOM.getScrollbarWidth(),n;if(k&&!v){k.setStyle("width",h||"100%");}if(!r){r=this._createYScrollNode();l=this._yScrollNode;t.replace(r).appendTo(l);}n=v?j:r;if(!v){t.setStyle("width","");}if(v){s-=o;}l.setStyle("height",(s-n.get("offsetTop")-f(n,"borderTopWidth")-f(n,"borderBottomWidth"))+"px");if(v){r.setStyle("width",(t.get("offsetWidth")+o)+"px");}else{this._uiSetYScrollWidth(h);}if(k&&!v){k.setStyle("width",r.get("offsetWidth")+"px");}if(q&&!i){i=this._createYScrollHeader();r.prepend(i);this._syncScrollHeaders();}if(i){this._syncScrollColumnWidths();i.setStyle("display","");if(!u){u=this._createScrollbar();this._bindScrollbar();p.prepend(u);}this._uiSetScrollbarHeight();this._uiSetScrollbarPosition(n);}},_uiSetScrollable:function(){this.get("boundingBox").toggleClass(this.getClassName("scrollable","x"),this._xScroll).toggleClass(this.getClassName("scrollable","y"),this._yScroll);},_uiSetScrollbarHeight:function(){var j=this._scrollbarNode,h=this._yScrollNode,i=this._yScrollHeader;if(j&&h&&i){j.get("firstChild").setStyle("height",this._tbodyNode.get("scrollHeight")+"px");j.setStyle("height",(parseFloat(h.getComputedStyle("height"))-parseFloat(i.getComputedStyle("height")))+"px");}},_uiSetScrollbarPosition:function(h){var j=this._scrollbarNode,i=this._yScrollHeader;if(j&&h&&i){j.setStyles({top:(parseFloat(i.getComputedStyle("height"))+f(h,"borderTopWidth")+h.get("offsetTop"))+"px",left:(h.get("offsetWidth")-g.DOM.getScrollbarWidth()-1-f(h,"borderRightWidth"))+"px"});}},_uiSetYScrollWidth:function(l){var i=this._yScrollContainer,n=this._tableNode,h,j,k,m;if(i&&n){m=g.DOM.getScrollbarWidth();if(l){j=i.get("offsetWidth")-i.get("clientWidth")+m;i.setStyle("width",l);k=i.get("clientWidth")-j;n.setStyle("width",k+"px");h=n.get("offsetWidth");i.setStyle("width",(h+m)+"px");}else{n.setStyle("width","");i.setStyle("width","");i.setStyle("width",(n.get("offsetWidth")+m)+"px");
}}},_unbindScrollbar:function(){if(this._scrollbarEventHandle){this._scrollbarEventHandle.detach();}},_unbindScrollResize:function(){if(this._scrollResizeHandle){this._scrollResizeHandle.detach();delete this._scrollResizeHandle;}}},true);g.Base.mix(g.DataTable,[b]);},"3.5.0",{skinnable:true,requires:["datatable-base","dom-screen"]});