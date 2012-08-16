AUI.add("aui-datatable-edit",function(au){var ad=au.Lang,bd=au.Array,e=ad.isArray,aR=ad.isBoolean,aN=ad.isFunction,J=ad.isObject,aW=ad.isString,aM=ad.String,a3=function(A){return(A instanceof au.BaseCellEditor);},aq=au.WidgetStdMod,B=au.getClassName,aY="activeCell",af="add",a4="addOption",aL="baseCellEditor",s="boundingBox",R="calendar",am="cancel",aP="cell",ay="celleditor",C="checkboxCellEditor",p="checked",aH="click",w="contentBox",aE="data",Q="datatable",M="dateCellEditor",al="dd",V="delete",ap="disk",aG="dotted",aO="dropDownCellEditor",N="edit",G="editEvent",ai="editOptions",Z="editable",g="editor",I="element",aD="elementName",c="grip",F="handle",v="hide",aw="hideOnSave",ah="icon",o="initEdit",bc="initToolbar",av="initValidator",ab="input",d="inputFormatter",bb="key",ax="label",ar="link",X="mousedown",aa="multiple",m="name",aK="only",aT="option",aZ="options",u="optionsCellEditor",a8="outputFormatter",l="pencil",aj="radioCellEditor",i="read",ak="readOnly",a9="remove",f="render",a6="rendered",ag="return",n="row",aJ="save",aU="selected",aB="selectedAttrName",Y="showToolbar",aX="submit",S="textAreaCellEditor",y="textCellEditor",P="toolbar",z="unescapeValue",W="validator",a2="value",at="vertical",ae="visible",a0="wrapper",D="zIndex",bg=",",j=".",T="",a5="\n",ba=" ",t=/<br\s*\/?>/gi,E=/[\r\n]/g,b=B(ay,N),h=B(ay,N,af,aT),bf=B(ay,N,al,F),aS=B(ay,N,V,aT),a7=B(ay,N,v,aT),az=B(ay,N,ab,m),aI=B(ay,N,ab,a2),ao=B(ay,N,ax),q=B(ay,N,ar),aC=B(ay,N,aT,n),U=B(ay,I),aV=B(ay,ax),L=B(ay,aT),x=B(ay,a0),H=B(Q,Z),k=B(ah),ac=B(ah,c,aG,at),aQ="<br/>";var a1=function(){};a1.NAME="dataTableCellEditorSupport";a1.EDITOR_ZINDEX=9999;a1.ATTRS={editEvent:{setter:"_setEditEvent",validator:aW,value:aH}};au.mix(a1.prototype,{initializer:function(){var A=this,bh=A.get(G);A.CLASS_NAMES_CELL_EDITOR_SUPPORT={cell:A.getClassName(aP),readOnly:A.getClassName(i,aK)};A.after(f,A._afterCellEditorSupportRender);A.delegate(bh,A._onEditCell,j+A.CLASS_NAMES_CELL_EDITOR_SUPPORT.cell,A);},getEditor:function(bh,bj){var A=this,bi=bj.editor,bk=bh.get(g);if(bi===false||bk===false){return null;}return bk||bi;},_afterCellEditorSupportRender:function(){var A=this;A._syncModelsReadOnlyUI();A.body.after(au.bind(A._syncModelsReadOnlyUI,A),A.body,f);},_onEditCell:function(bm){var A=this,bj=A.get(aY),bi=bm.alignNode||bj,bl=A.getColumn(bi),bh=A.getRecord(bi),bk=A.getEditor(bh,bl);if(a3(bk)&&!bh.get(ak)){if(!bk.get(a6)){bk.on({visibleChange:au.bind(A._onEditorVisibleChange,A),save:au.bind(A._onEditorSave,A)});bk.set(D,a1.EDITOR_ZINDEX);bk.render();}bk.set(a2,bh.get(bl.key));bk.show().move(bi.getXY());}},_onEditorSave:function(bk){var A=this,bj=bk.currentTarget,bi=A.getActiveColumn(),bh=A.getActiveRecord();bj.set(a2,bk.newVal);A.set(aY,A.get(aY));bh.set(bi.key,bk.newVal);if(A.highlight){A.highlight.clear();}},_onEditorVisibleChange:function(bi){var A=this,bh=bi.currentTarget;if(bi.newVal){bh._syncFocus();}},_syncModelReadOnlyUI:function(bh){var A=this,bi=A.getRow(bh);bi.toggleClass(A.CLASS_NAMES_CELL_EDITOR_SUPPORT[ak],bh.get(ak)===true);},_syncModelsReadOnlyUI:function(){var A=this;A.get(aE).each(function(bh){A._syncModelReadOnlyUI(bh);});},getCellEditor:function(){return this.getEditor.apply(this,arguments);},getRecordColumnValue:function(A,bh){return A.get(bh.key);}});au.DataTable.CellEditorSupport=a1;au.Base.mix(au.DataTable,[a1]);var r=au.Component.create({NAME:aL,ATTRS:{editable:{value:false,validator:aR},elementName:{value:a2,validator:aW},footerContent:{value:T},hideOnSave:{value:true,validator:aR},inputFormatter:{value:function(A){if(aW(A)){A=A.replace(E,aQ);}return A;}},outputFormatter:{value:function(bh){var A=this;if(aW(bh)){if(A.get(z)){bh=aM.unescapeEntities(bh);}bh=bh.replace(t,a5);}return bh;}},showToolbar:{value:true,validator:aR},strings:{value:{edit:"Edit",save:"Save",cancel:"Cancel"}},tabIndex:{value:1},toolbar:{setter:"_setToolbar",validator:J,value:null},unescapeValue:{value:true,validator:aR},validator:{setter:"_setValidator",validator:J,value:null},value:{value:T},visible:{value:false}},EXTENDS:au.Overlay,UI_ATTRS:[Z,Y,a2],prototype:{CONTENT_TEMPLATE:"<form></form>",ELEMENT_TEMPLATE:null,elements:null,validator:null,_hDocMouseDownEv:null,initializer:function(bh){var A=this;A._initEvents();},destructor:function(){var bh=this;var A=bh._hDocMouseDownEv;var bj=bh.toolbar;var bi=bh.validator;if(A){A.detach();}if(bj){bj.destroy();}if(bi){bi.destroy();}},bindUI:function(){var A=this;A.get(s).on(bb,au.bind(A._onEscKey,A),"down:27");},formatValue:function(bh,bi){var A=this;if(aN(bh)){bi=bh.call(A,bi);}return bi;},getValue:function(){var A=this;return A.formatValue(A.get(d),A.getElementsValue());},_initEvents:function(){var A=this;A.publish({cancel:{defaultFn:A._defCancelFn},initEdit:{defaultFn:A._defInitEditFn,fireOnce:true},initValidator:{defaultFn:A._defInitValidatorFn,fireOnce:true},initToolbar:{defaultFn:A._defInitToolbarFn,fireOnce:true},save:{defaultFn:A._defSaveFn}});A.after({render:A._afterRender,visibleChange:au.debounce(A._debounceVisibleChange,350,A)});A.on({"form-validator:submit":au.bind(A._onSubmit,A)});},_afterRender:function(){var A=this;A._handleInitValidatorEvent();A._handleInitToolbarEvent();},_defCancelFn:function(bh){var A=this;A.hide();},_defInitValidatorFn:function(bh){var A=this;A.validator=new au.FormValidator(A.get(W));},_defInitToolbarFn:function(bi){var A=this;var bh=A.get(Z);A.toolbar=new au.Toolbar(A.get(P)).render(A.footerNode);if(bh){A._uiSetEditable(bh);}},_defSaveFn:function(bh){var A=this;if(A.get(aw)){A.hide();}},_debounceVisibleChange:function(bi){var bh=this;var A=bh._hDocMouseDownEv;if(bi.newVal){if(!A){bh._hDocMouseDownEv=au.getDoc().on(X,au.bind(bh._onDocMouseDownExt,bh));}}else{if(A){A.detach();bh._hDocMouseDownEv=null;}}},_handleCancelEvent:function(){var A=this;A.fire(am);},_handleEditEvent:function(){var A=this;A.fire(N);},_handleInitEditEvent:function(){var A=this;if(A.get(a6)){this.fire(o);}},_handleInitValidatorEvent:function(){var A=this;if(A.get(a6)){this.fire(av);}},_handleInitToolbarEvent:function(){var A=this;
if(A.get(a6)&&A.get(Y)){this.fire(bc);}},_handleSaveEvent:function(){var A=this;if(!A.validator.hasErrors()){A.fire(aJ,{newVal:A.getValue(),prevVal:A.get(a2)});}},_onDocMouseDownExt:function(bi){var A=this;var bh=A.get(s);if(!bh.contains(bi.target)){A.set(ae,false);}},_onEscKey:function(bh){var A=this;A.hide();},_onSubmit:function(bi){var A=this;var bh=bi.validator;A._handleSaveEvent();if(bh){bh.formEvent.halt();}},_setToolbar:function(bi){var bh=this;var A=bh.getStrings();return au.merge({activeState:false,children:[{label:A[aJ],icon:ap,type:aX},{handler:au.bind(bh._handleCancelEvent,bh),label:A[am]}]},bi);},_setValidator:function(bh){var A=this;return au.merge({boundingBox:A.get(w),bubbleTargets:A},bh);},_uiSetShowToolbar:function(bi){var A=this;var bh=A.footerNode;if(bi){bh.show();}else{bh.hide();}A._handleInitToolbarEvent();},getElementsValue:function(){var A=this;var bh=A.elements;if(bh){return bh.get(a2);}return T;},renderUI:function(){var A=this;if(A.ELEMENT_TEMPLATE){A.elements=au.Node.create(A.ELEMENT_TEMPLATE);A._syncElementsName();A.setStdModContent(aq.BODY,A.elements);}},_defInitEditFn:function(A){},_syncElementsFocus:function(){var A=this;A.elements.selectText();},_syncElementsName:function(){var A=this;A.elements.setAttribute(m,A.get(aD));},_syncFocus:function(){var A=this;au.later(0,A,A._syncElementsFocus);},_uiSetEditable:function(bi){var A=this;var bh=A.toolbar;if(A.get(a6)&&bh){if(bi){bh.add({handler:au.bind(A._handleEditEvent,A),icon:l,label:A.getString(N)},1);}else{bh.remove(1);}}},_uiSetValue:function(bi){var A=this;var bh=A.elements;if(bh){bh.val(A.formatValue(A.get(a8),bi));}}}});au.BaseCellEditor=r;var be=au.Component.create({NAME:u,ATTRS:{inputFormatter:{value:null},options:{setter:"_setOptions",value:{},validator:J},outputFormatter:{value:null},selectedAttrName:{value:aU,validator:aW},strings:{value:{add:"Add",cancel:"Cancel",addOption:"Add option",edit:"Edit options",editOptions:"Edit option(s)",name:"Name",remove:"Remove",save:"Save",stopEditing:"Stop editing",value:"Value"}}},EXTENDS:au.BaseCellEditor,UI_ATTRS:[aZ],prototype:{EDIT_TEMPLATE:'<div class="'+b+'"></div>',EDIT_OPTION_ROW_TEMPLATE:'<div class="'+aC+'">'+'<span class="'+[bf,k,ac].join(ba)+'"></span>'+'<input class="'+az+'" size="7" placeholder="{titleName}" title="{titleName}" type="text" value="{valueName}" /> '+'<input class="'+aI+'" size="7" placeholder="{titleValue}" title="{titleValue}" type="text" value="{valueValue}" /> '+'<a class="'+[q,aS].join(ba)+'" href="javascript:void(0);">{remove}</a> '+"</div>",EDIT_ADD_LINK_TEMPLATE:'<a class="'+[q,h].join(ba)+'" href="javascript:void(0);">{addOption}</a> ',EDIT_LABEL_TEMPLATE:'<div class="'+ao+'">{editOptions}</div>',editContainer:null,editSortable:null,options:null,initializer:function(){var A=this;A.on(N,A._onEditEvent);A.on(aJ,A._onSave);A.after(bc,A._afterInitToolbar);},addNewOption:function(bj,bk){var A=this;var bi=A.editContainer.one(j+h);var bh=au.Node.create(A._createEditOption(bj||T,bk||T));bi.placeBefore(bh);bh.one(ab).focus();},removeOption:function(A){A.remove();},saveOptions:function(){var A=this;var bk=A.editContainer;if(bk){var bj=bk.all(j+az);var bh=bk.all(j+aI);var bi={};bj.each(function(bn,bm){var bl=bn.val();var bo=bh.item(bm).val();if(bl&&bo){bi[bo]=bl;}});A.set(aZ,bi);A._uiSetValue(A.get(a2));A.toggleEdit();}},toggleEdit:function(){var A=this;A.editContainer.toggle();},_createOptions:function(bi){var bm=this;var A=bm.elements;var bk=[];var bh=[];var bj=bm.OPTION_TEMPLATE;var bn=bm.OPTION_WRAPPER;au.each(bi,function(br,bq){var bp={id:au.guid(),label:br,name:bq,value:bq};if(bj){bk.push(ad.sub(bj,bp));}if(bn){bh.push(ad.sub(bn,bp));}});var bo=au.NodeList.create(bk.join(T));var bl=au.NodeList.create(bh.join(T));if(bl.size()){bl.each(function(bq,bp){bq.prepend(bo.item(bp));});A.setContent(bl);}else{A.setContent(bo);}bm.options=bo;},_createEditBuffer:function(){var bh=this;var A=bh.getStrings();var bi=[];bi.push(ad.sub(bh.EDIT_LABEL_TEMPLATE,{editOptions:A[ai]}));au.each(bh.get(aZ),function(bj,bk){bi.push(bh._createEditOption(bj,bk));});bi.push(ad.sub(bh.EDIT_ADD_LINK_TEMPLATE,{addOption:A[a4]}));return bi.join(T);},_createEditOption:function(bi,bj){var bh=this;var A=bh.getStrings();return ad.sub(bh.EDIT_OPTION_ROW_TEMPLATE,{remove:A[a9],titleName:A[m],titleValue:A[a2],valueName:bi,valueValue:bj});},_defInitEditFn:function(bh){var A=this;var bi=au.Node.create(A.EDIT_TEMPLATE);bi.delegate("click",au.bind(A._onEditLinkClickEvent,A),j+q);bi.delegate("keydown",au.bind(A._onEditKeyEvent,A),ab);A.editContainer=bi;A.setStdModContent(aq.BODY,bi.hide(),aq.AFTER);A.editSortable=new au.Sortable({container:bi,handles:[j+bf],nodes:j+aC,opacity:".3"}).delegate.dd.plug(au.Plugin.DDConstrained,{constrain:bi,stickY:true});A._syncEditOptionsUI();},_getSelectedOptions:function(){var A=this;var bh=[];A.options.each(function(bi){if(bi.get(A.get(aB))){bh.push(bi);}});return au.all(bh);},_onEditEvent:function(bh){var A=this;A._handleInitEditEvent();A.toggleEdit();A._syncEditOptionsUI();},_onEditLinkClickEvent:function(bh){var A=this;var bi=bh.currentTarget;if(bi.test(j+h)){A.addNewOption();}else{if(bi.test(j+a7)){A.toggleEdit();}else{if(bi.test(j+aS)){A.removeOption(bi.ancestor(j+aC));}}}bh.halt();},_onEditKeyEvent:function(bh){var A=this;var bi=bh.currentTarget;if(bh.isKey(ag)){var bj=bi.next(ab);if(bj){bj.selectText();}else{A.addNewOption();}bh.halt();}},_onSave:function(bh){var A=this;A.saveOptions();},_setOptions:function(bh){var A={};if(e(bh)){bd.each(bh,function(bi){A[bi]=bi;});}else{if(J(bh)){A=bh;}}return A;},_syncEditOptionsUI:function(){var A=this;A.editContainer.setContent(A._createEditBuffer());},_uiSetOptions:function(bh){var A=this;A._uiSetValue(A.get(a2));A._createOptions(bh);A._syncElementsName();},_uiSetValue:function(bi){var A=this;var bh=A.options;if(bh&&bh.size()){bh.set(A.get(aB),false);if(bi){if(!e(bi)){bi=String(bi).split(bg);}bd.each(bi,function(bj){bh.filter('[value="'+ad.trim(bj)+'"]').set(A.get(aB),true);});}}return bi;}}});au.BaseOptionsCellEditor=be;
var aA=au.Component.create({NAME:y,EXTENDS:au.BaseCellEditor,prototype:{ELEMENT_TEMPLATE:'<input autocomplete="off" class="'+U+'" type="text" />'}});au.TextCellEditor=aA;var aF=au.Component.create({NAME:S,EXTENDS:au.BaseCellEditor,prototype:{ELEMENT_TEMPLATE:'<textarea class="'+U+'"></textarea>'}});au.TextAreaCellEditor=aF;var O=au.Component.create({NAME:aO,ATTRS:{multiple:{value:false,validator:aR}},EXTENDS:au.BaseOptionsCellEditor,UI_ATTRS:[aa],prototype:{ELEMENT_TEMPLATE:'<select class="'+U+'"></select>',OPTION_TEMPLATE:'<option value="{value}">{label}</option>',getElementsValue:function(){var A=this;if(A.get(aa)){return A._getSelectedOptions().get(a2);}return A.elements.get(a2);},_syncElementsFocus:function(){var A=this;A.elements.focus();},_uiSetMultiple:function(bi){var A=this;var bh=A.elements;if(bi){bh.setAttribute(aa,aa);}else{bh.removeAttribute(aa);}}}});au.DropDownCellEditor=O;var an=au.Component.create({NAME:C,ATTRS:{selectedAttrName:{value:p}},EXTENDS:au.BaseOptionsCellEditor,prototype:{ELEMENT_TEMPLATE:'<div class="'+U+'"></div>',OPTION_TEMPLATE:'<input class="'+L+'" id="{id}" name="{name}" type="checkbox" value="{value}"/>',OPTION_WRAPPER:'<label class="'+x+'" for="{id}"><span class="'+aV+'">{label}</span></label>',getElementsValue:function(){var A=this;return A._getSelectedOptions().get(a2);},_syncElementsFocus:function(){var A=this;var bh=A.options;if(bh&&bh.size()){bh.item(0).focus();}},_syncElementsName:function(){var A=this;var bh=A.options;if(bh){bh.setAttribute(m,A.get(aD));}}}});au.CheckboxCellEditor=an;var K=au.Component.create({NAME:aj,EXTENDS:au.CheckboxCellEditor,prototype:{OPTION_TEMPLATE:'<input class="aui-field-input-choice" id="{id}" name="{name}" type="radio" value="{value}"/>',getElementsValue:function(){var A=this;return A._getSelectedOptions().get(a2)[0];}}});au.RadioCellEditor=K;var a=au.Component.create({NAME:M,EXTENDS:au.BaseCellEditor,ATTRS:{bodyContent:{value:T},calendar:{setter:"_setCalendar",validator:J,value:null}},prototype:{ELEMENT_TEMPLATE:'<input class="'+U+'" type="hidden" />',initializer:function(){var A=this;A.on("calendar:select",au.bind(A._onDateSelect,A));},getElementsValue:function(){var A=this;return A.calendar.getFormattedSelectedDates().join(bg);},_afterRender:function(){var A=this;au.DateCellEditor.superclass._afterRender.apply(A,arguments);A.calendar=new au.Calendar(A.get(R)).render(A.bodyNode);},_onDateSelect:function(bh){var A=this;A.elements.val(bh.date.formatted.join(bg));},_setCalendar:function(bh){var A=this;return au.merge({bubbleTargets:A},bh);},_uiSetValue:function(bi){var A=this;var bh=A.calendar;if(bh){if(bi&&aW(bi)){bi=bi.split(bg);}A.calendar.set("dates",bi);}}}});au.DateCellEditor=a;},"@VERSION@",{skinnable:true,requires:["datatable-base","aui-calendar","aui-toolbar","aui-form-validator","overlay","sortable"]});AUI.add("aui-datatable-selection",function(s){var e=s.Lang,n=e.isArray,p=e.isString,l=e.isObject,v="CLASS_NAMES_SELECTION",i="activeCell",k="activeCellChange",c="activeRow",x="boundingBox",h="cell",d="cellIndex",f="children",o="focused",b="key",j="mousedown",u="mouseenter",g="mouseup",m="render",t="selection",r="tabindex",w=".",q=function(A,z,y){return Math.min(Math.max(A,z),y);};var a=function(){};a.ATTRS={activeCell:{setter:"getCell"},activeRow:{setter:"getRow"},selection:{setter:"_setSelection"},tabIndex:{value:0}};s.mix(a.prototype,{_capturing:false,_selectionEnd:null,_selectionSeed:null,_selectionStart:null,initializer:function(){var y=this,z=y.get(x);y[v]={cell:y.getClassName(h),selection:y.getClassName(t)};y._bindSelectionUI();z.addClass(y[v].selection);},destroy:function(){var y=this;y._selectionKeyHandler.detach();},captureSelection:function(C){var E=this,F=[],B=[],y=[],G=[],z;for(z=0;z<C.length;z++){var A=C[z],D=E.getCell(A);G.push(A[0]);F.push(D);B.push(E.getColumn(D));}G=s.Array.unique(G);B=s.Array.unique(B);for(z=0;z<G.length;z++){G[z]=E.getRow(G[z]);y[z]=E.getRecord(G[z]);}return{cells:F,cols:B,coords:C,records:y,rows:G};},getActiveColumn:function(){var y=this;return y.getColumn(y.get(i));},getActiveRecord:function(){var y=this;return y.getRecord(y.get(i));},getCoord:function(A){var z=this,y=z.getCell(A),B=z.body.tbodyNode,C=B.get("firstChild.rowIndex");return[y.get("parentNode.rowIndex")-C,y.get(d)];},_afterActiveCellChange:function(A){var y=this,z=A.newVal;y.set(c,z);if(z){z.setAttribute(r,0).focus();}},_afterRender:function(z){var y=this;y.set(c,y.get(i));},_bindSelectionUI:function(){var y=this,z=y[v];y._selectionKeyHandler=s.getDoc().on(b,s.bind(y._onSelectionKey,y),"down:enter,37,38,39,40");y.after(m,y._afterRender);y.after(k,y._afterActiveCellChange);y.delegate(g,s.bind(y._onSelectionMouseUp,y),w+z.cell);y.delegate(j,s.bind(y._onSelectionMouseDown,y),w+z.cell);y.delegate(u,s.bind(y._onSelectionMouseEnter,y),w+z.cell);},_onSelectionMouseDown:function(B){var y=this,z=B.currentTarget,A=y.get(x);A.unselectable();y._capturing=true;y._selectionSeed=z;y._selectionStart=y._selectionEnd=y.getCoord(z);y.set(i,z);},_onSelectionMouseEnter:function(A){var y=this,z=A.currentTarget;if(!y._capturing){return;}y._selectionSeed=z;y._selectionEnd=y.getCoord(z);y.set(t,{start:y._selectionStart,end:y._selectionEnd});},_onSelectionMouseUp:function(A){var y=this,z=y.get(x);if(y.get(o)){y._selectionEnd=y.getCoord(y._selectionSeed);y.set(t,{start:y._selectionStart,end:y._selectionEnd});}z.selectable();y._capturing=false;},_onSelectionKey:function(z){var G=this,F=G.body,E=F.tbodyNode,H=z.keyCode,B=G.get(i),I,A=E.get(f).size(),y=F.get("columns").length,D,C;if(B&&G.get(o)){I=G.getCoord(B);D=I[0];C=I[1];if(H===37){C--;}else{if(H===38){D--;}else{if(H===39){C++;}else{if(H===40){D++;}}}}D=q(D,0,A-1);C=q(C,0,y-1);G.set(i,[D,C]);G.set(t,[D,C]);z.preventDefault();}},_parseRange:function(D){var B=D[0],A=D[1],C=[],z,y;for(z=Math.min(B[0],A[0]);z<=Math.max(B[0],A[0]);z++){for(y=Math.min(B[1],A[1]);y<=Math.max(B[1],A[1]);y++){C.push([z,y]);}}return C;},_setSelection:function(z){var y=this;if(n(z)){if(!n(z[0])){z=[z];}}else{if(l(z)){z=y._parseRange([z.start,z.end]);
}else{if(s.instanceOf(z,s.Node)){z=[y.getCoord(z)];}}}return y.captureSelection(z);}});s.DataTable.Selection=a;s.Base.mix(s.DataTable,[a]);s.DataTable.prototype.getColumn=(function(y){return function(A){var z;if(s.instanceOf(A,s.Node)){z=this.getCell(A);A=z&&(z.get("className").match(new RegExp(this.getClassName("col","(\\w+)")))||[])[1];}return y.call(this,A);};}(s.DataTable.prototype.getColumn));s.DataTable.prototype.getRow=(function(y){return function(A){var z=this,B=z.body.tbodyNode,C;if(s.instanceOf(A,s.Node)){C=A.ancestor(function(D){return D.get("parentNode").compareTo(B);},true);return C;}else{return y.call(this,A);}};}(s.DataTable.prototype.getRow));s.DataTable.prototype._setColumns=function(z){var E={},F=[],B=[],C=s.Array.indexOf,A=s.Lang.isArray;function G(K){var L={},I,J,H;F.push(K);B.push(L);for(I in K){if(K.hasOwnProperty(I)){J=K[I];if(A(J)){L[I]=J.slice();}else{if(l(J,true)&&J.constructor===L.constructor){H=C(J,F);L[I]=H===-1?G(J):B[H];}else{L[I]=K[I];}}}}return L;}function D(H){H=H.replace(/\s+/,"-");if(E[H]){H+=(E[H]++);}else{E[H]=1;}return H;}function y(N,M){var L=[],K,H,I,J;for(K=0,H=N.length;K<H;++K){L[K]=I=p(N[K])?{key:N[K]}:G(N[K]);J=s.stamp(I);if(!I.id){I.id=J;}if(I.field){I.name=I.field;}if(M){I._parent=M;}else{delete I._parent;}I._id=D(I.name||I.key||I.id);if(A(I.children)){I.children=y(I.children,I);}}return L;}return z&&y(z);};},"@VERSION@",{skinnable:true,requires:["datatable-base"]});AUI.add("aui-datatable-highlight",function(s){var d=s.Lang,n=d.isArray,o=d.isString,m=d.isBoolean,h="active",u="activeBorderWidth",k="activeCell",b="activeRow",a="activeRowChange",v="border",j="cell",y="cells",f="children",B="highlight",r="highlightRange",z="host",l="overlay",g="overlayActiveNode",x="overlayNode",c="rangeBorderWidth",t="region",w="rows",i="selectionChange",p="type",C=" ",q=function(F){var D=this,E=0,A;if(o(F)){F=d.trim(F).replace(/\s+/g," ").split(C);}else{if(!n(F)){F=s.Array(F);}}for(A=4-F.length;E<A;E++){F.push(F[E]);}return s.Array.map(F,parseFloat);};var e=s.Base.create("datatable-highlight",s.Plugin.Base,[],{CLASS_NAMES:null,TPL_FRAME:'<div class="{overlay}">'+'<div class="{border}"></div>'+'<div class="{border}"></div>'+'<div class="{border}"></div>'+'<div class="{border}"></div>'+"</div>",_nodes:null,initializer:function(){var A=this,D=A.get(z);A.CLASS_NAMES={active:D.getClassName(h),border:D.getClassName(B,v),highlight:D.getClassName(B),overlay:D.getClassName(B,l),overlayActive:D.getClassName(B,l,h)};A.afterHostEvent(a,A._afterActiveRowChange);A.afterHostEvent(i,A._afterSelectionChange);},clear:function(){var A=this,E=A.get(z),D=E.get(k);if(D){D.removeClass(A.CLASS_NAMES.active);}A._clearBorders();A._clearHighlights();},getActiveRegion:function(){var A=this,E=A.get(z),D=A.get(p),F=null,G;if(D===w){G=E.get(b);}else{G=E.get(k);}if(G){F=G.get(t);}return F;},getSelectionRegion:function(){var A=this,F=A._nodes,E=F[0].get(t),D=F[F.length-1].get(t);return{0:E.top,1:E.left,bottom:D.bottom,height:D.bottom-E.top,left:E.left,right:D.right,top:E.top,width:D.right-E.left};},_afterActiveRowChange:function(F){var A=this,E=A.get(u),D=A.get(g),G=A.CLASS_NAMES;if(!A.get(p)){return;}A.clear();if(F.prevVal){F.prevVal.removeClass(G.active);}if(F.newVal){A._alignBorder(D,A.getActiveRegion(),E);F.newVal.addClass(G.active);}},_afterSelectionChange:function(F){var A=this,D,H=A.get(r),E=A.get(x),G=A.get(c);if(!A.get(p)){return;}A._clearHighlights();D=A._collectNodes(F.newVal);if(H&&D&&(D.length>1)){A._alignBorder(E,A.getSelectionRegion(),G);s.Array.each(D,function(I){I.addClass(A.CLASS_NAMES.highlight);});}},_alignBorder:function(L,H,D){var I=this,J=I.get(z);J._tableNode.appendChild(L);if(H){var F=L.get(f),K=F.item(0),A=F.item(1),G=F.item(2),E=F.item(3);L.setXY([H.left,H.top]);K.sizeTo(H.width,D[0]);E.sizeTo(D[3],H.height-D[2]);G.sizeTo(H.width,D[2]);A.sizeTo(D[1],H.height-D[2]);K.setXY([H.left,H.top]);E.setXY([H.left,H.top]);G.setXY([H.left,H.bottom-D[2]]);A.setXY([H.right-D[1],H.top]);}},_collectNodes:function(E){var A=this,D=A.get(p);if(!D||!E){return null;}return(A._nodes=E[D]);},_clearBorders:function(){var A=this;A.get(x).remove();A.get(g).remove();},_clearHighlights:function(){var A=this;s.Array.each(A._nodes,function(D){D.removeClass(A.CLASS_NAMES.highlight);});},_validateType:function(A){return(A===y||A===w||A===null);}},{NS:B,NAME:"datatable-highlight",ATTRS:{activeBorderWidth:{setter:q,value:2},overlayActiveNode:{setter:function(E){var A=this,D=A.CLASS_NAMES;if(!E){E=s.Node.create(d.sub(A.TPL_FRAME,D));E.addClass(D.overlayActive);}return E;},value:null},overlayNode:{setter:function(D){var A=this;if(!D){D=s.Node.create(d.sub(A.TPL_FRAME,A.CLASS_NAMES));}return D;},value:null},highlightRange:{validator:m,value:true},rangeBorderWidth:{setter:q,value:1},type:{validator:"_validateType",value:y}}});s.namespace("Plugin").DataTableHighlight=e;},"@VERSION@",{skinnable:true,requires:["aui-datatable-selection"]});AUI.add("aui-datatable",function(a){},"@VERSION@",{skinnable:true,use:["aui-datatable-edit","aui-datatable-selection","aui-datatable-highlight"]});