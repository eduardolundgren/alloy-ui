/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add("datatable-column-widths",function(d){var c=d.Lang.isNumber,a=d.Array.indexOf;d.Features.add("table","badColWidth",{test:function(){var e=d.one("body"),g,f;if(e){g=e.insertBefore('<table style="position:absolute;visibility:hidden;border:0 none">'+'<colgroup><col style="width:9px"></colgroup>'+"<tbody><tr>"+'<td style="'+"padding:0 4px;"+"font:normal 2px/2px arial;"+'border:0 none">'+"."+"</td></tr></tbody>"+"</table>",e.get("firstChild"));f=g.one("td").getComputedStyle("width")!=="1px";g.remove(true);}return f;}});function b(){}d.mix(b.prototype,{COL_TEMPLATE:"<col/>",COLGROUP_TEMPLATE:"<colgroup/>",setColumnWidth:function(h,g){var f=this.getColumn(h),e=f&&a(this._displayColumns,f);if(e>-1){if(c(g)){g+="px";}f.width=g;this._setColumnWidth(e,g);}return this;},_createColumnGroup:function(){return d.Node.create(this.COLGROUP_TEMPLATE);},initializer:function(e){this.after("renderTable",function(f){this._uiSetColumns();this.after("columnsChange",this._uiSetColumns);});},_setColumnWidth:function(i,j){var g=this._colgroupNode,h=g&&g.all("col").item(i),k,f,e;if(h){if(j&&c(j)){j+="px";}h.setStyle("width",j);if(j&&d.Features.test("table","badColWidth")){k=this._tbodyNode&&this._tbodyNode.one("tr");f=k&&k.all("td").item(i);if(f){e=function(l){return parseInt(f.getComputedStyle(l),10)|0;};h.setStyle("width",parseInt(j,10)-e("paddingLeft")-e("paddingRight")-e("borderLeftWidth")-e("borderRightWidth")+"px");}}}},_uiSetColumns:function(){var j=this.COL_TEMPLATE,f=this._colgroupNode,h=this._displayColumns,g,e;if(!f){f=this._colgroupNode=this._createColumnGroup();this._tableNode.insertBefore(f,this._tableNode.one("> thead, > tfoot, > tbody"));}else{f.empty();}for(g=0,e=h.length;g<e;++g){f.append(j);this._setColumnWidth(g,h[g].width);}}},true);d.DataTable.ColumnWidths=b;d.Base.mix(d.DataTable,[b]);},"3.5.0",{requires:["datatable-base"]});