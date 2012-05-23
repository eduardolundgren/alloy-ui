AUI.add("aui-datatable-edit",function(ar){var ab=ar.Lang,bd=ar.Array,e=ab.isArray,aS=ab.isBoolean,aN=ab.isFunction,H=ab.isObject,aX=ab.isString,aM=ab.String,aK=ar.cached(function(A){return A.substring(0,1).toUpperCase()+A.substring(1);}),a3=function(A){return(A instanceof ar.BaseCellEditor);},ao=ar.WidgetStdMod,z=ar.getClassName,ad="add",a4="addOption",aL="baseCellEditor",r="boundingBox",P="calendar",ak="cancel",aP="cell",aw="celleditor",B="checkboxCellEditor",o="checked",aH="click",aG="columns",v="contentBox",aC="data",O="datatable",K="dateCellEditor",aj="dd",T="delete",an="disk",aE="dotted",aO="dropDownCellEditor",L="edit",X="editable",f="editor",E="editEvent",ah="editOptions",G="element",aB="elementName",aQ="field",c="grip",D="handle",u="hide",au="hideOnSave",af="icon",aF="id",n="initEdit",bc="initToolbar",at="initValidator",Z="input",d="inputFormatter",bb="key",av="label",ap="link",V="mousedown",Y="multiple",l="name",aU="option",aZ="options",t="optionsCellEditor",a8="outputFormatter",k="pencil",ai="radioCellEditor",ag="records",a9="remove",a6="rendered",ae="return",m="row",aJ="save",aV="selected",az="selectedAttrName",W="showToolbar",aY="submit",Q="textAreaCellEditor",x="textCellEditor",N="toolbar",y="unescapeValue",U="validator",a2="value",aq="vertical",ac="visible",a0="wrapper",bg=",",i=".",R="",h="#",a5="\n",ba=" ",s=/<br\s*\/?>/gi,C=/[\r\n]/g,b=z(aw,L),g=z(aw,L,ad,aU),bf=z(aw,L,aj,D),aT=z(aw,L,T,aU),a7=z(aw,L,u,aU),ax=z(aw,L,Z,l),aI=z(aw,L,Z,a2),am=z(aw,L,av),p=z(aw,L,ap),aA=z(aw,L,aU,m),S=z(aw,G),aW=z(aw,av),J=z(aw,aU),w=z(aw,a0),F=z(O,X),j=z(af),aa=z(af,c,aE,aq),aR="<br/>";var a1=function(){};a1.NAME="dataTableCellEditorSupport";a1.ATTRS={editEvent:{setter:"_setEditEvent",validator:aX,value:aH}};ar.mix(a1.prototype,{initializer:function(){var A=this;A.after({render:A._afterRenderEditor});A.on(A.get(E),A._onCellEdit);A.after(A._afterUiSetRecordset,A,"_uiSetRecordset");},getCellEditor:function(bh,bj){var A=this;var bi=bj.get(f);var bk=bh.get(aC).editor;if(bi===false||bk===false){return null;}return bk||bi;},getRecordColumnValue:function(A,bh){return A.getValue(bh.get(aQ));},syncEditableColumnsUI:function(){var A=this;var bh=A.get(aG);var bi=A.get(aC);ar.each(bh.idHash,function(bk){var bj=bk.get(f);if(a3(bj)){ar.all("[headers="+bk.get(aF)+"]").addClass(F);}});ar.each(bi.get(ag),function(bj){var bk=bj.get(aC).editor;var bl=a3(bk);ar.all(h+bj.get("id")+">td").each(function(bo,bm){var bn=bh.getColumn(bm);if(bk===false){bo.removeClass(F);}else{if(bl||(bn.get(f)!==false)){bo.addClass(F);}}});});},_afterUiSetRecordset:function(bh){var A=this;A.syncEditableColumnsUI();},_afterRenderEditor:function(bh){var A=this;if(!A.events){A.plug(ar.Plugin.DataTableEvents);}},_editCell:function(bm){var A=this;var bj=A.get(aG);var bn=A.get(aC);var bl=bm.column;var bh=bm.record;A.activeColumnIndex=bj.getColumnIndex(bl);A.activeRecordIndex=bn.getRecordIndex(bh);var bi=bm.alignNode||bm.cell;var bk=A.getCellEditor(bh,bl);if(a3(bk)){if(!bk.get(a6)){bk.on({visibleChange:ar.bind(A._onEditorVisibleChange,A),save:ar.bind(A._onEditorSave,A)});bk.render();}bk.set(a2,A.getRecordColumnValue(bh,bl));bk.show().move(bi.getXY());}},_onCellEdit:function(bh){var A=this;A._editCell(bh);},_onEditorVisibleChange:function(bm){var bh=this;var bk=bm.currentTarget;var bj=bh.selection;if(bj){var bi=bj.getActiveRecord();var bl=bj.getActiveColumn();var A=bh.getCellNode(bi,bl);var bn=bh.getRowNode(bi);if(bm.newVal){bk._syncFocus();}else{bj.select(A,bn);}}},_onEditorSave:function(bj){var A=this;var bi=bj.currentTarget;var bk=A.get(aC);bi.set(a2,bj.newVal);var bh=A.selection;if(bh){bk.updateRecordDataByKey(bh.getActiveRecord(),bh.getActiveColumn().get(bb),bj.newVal);}},_setEditEvent:function(A){return aP+aK(A);}});ar.DataTable.CellEditorSupport=a1;ar.DataTable=ar.Base.create("dataTable",ar.DataTable,[ar.DataTable.CellEditorSupport]);var q=ar.Component.create({NAME:aL,ATTRS:{editable:{value:false,validator:aS},elementName:{value:a2,validator:aX},footerContent:{value:R},hideOnSave:{value:true,validator:aS},inputFormatter:{value:function(A){if(aX(A)){A=A.replace(C,aR);}return A;}},outputFormatter:{value:function(bh){var A=this;if(aX(bh)){if(A.get(y)){bh=aM.unescapeEntities(bh);}bh=bh.replace(s,a5);}return bh;}},showToolbar:{value:true,validator:aS},strings:{value:{edit:"Edit",save:"Save",cancel:"Cancel"}},tabIndex:{value:1},toolbar:{setter:"_setToolbar",validator:H,value:null},unescapeValue:{value:true,validator:aS},validator:{setter:"_setValidator",validator:H,value:null},value:{value:R},visible:{value:false}},EXTENDS:ar.Overlay,UI_ATTRS:[X,W,a2],prototype:{CONTENT_TEMPLATE:"<form></form>",ELEMENT_TEMPLATE:null,elements:null,validator:null,_hDocMouseDownEv:null,initializer:function(bh){var A=this;A._initEvents();},destructor:function(){var bh=this;var A=bh._hDocMouseDownEv;var bj=bh.toolbar;var bi=bh.validator;if(A){A.detach();}if(bj){bj.destroy();}if(bi){bi.destroy();}},bindUI:function(){var A=this;A.get(r).on(bb,ar.bind(A._onEscKey,A),"down:27");},formatValue:function(bh,bi){var A=this;if(aN(bh)){bi=bh.call(A,bi);}return bi;},getValue:function(){var A=this;return A.formatValue(A.get(d),A.getElementsValue());},_initEvents:function(){var A=this;A.publish({cancel:{defaultFn:A._defCancelFn},initEdit:{defaultFn:A._defInitEditFn,fireOnce:true},initValidator:{defaultFn:A._defInitValidatorFn,fireOnce:true},initToolbar:{defaultFn:A._defInitToolbarFn,fireOnce:true},save:{defaultFn:A._defSaveFn}});A.after({render:A._afterRender,visibleChange:ar.debounce(A._debounceVisibleChange,350,A)});A.on({"form-validator:submit":ar.bind(A._onSubmit,A)});},_afterRender:function(){var A=this;A._handleInitValidatorEvent();A._handleInitToolbarEvent();},_defCancelFn:function(bh){var A=this;A.hide();},_defInitValidatorFn:function(bh){var A=this;A.validator=new ar.FormValidator(A.get(U));},_defInitToolbarFn:function(bi){var A=this;var bh=A.get(X);A.toolbar=new ar.Toolbar(A.get(N)).render(A.footerNode);if(bh){A._uiSetEditable(bh);}},_defSaveFn:function(bh){var A=this;
if(A.get(au)){A.hide();}},_debounceVisibleChange:function(bi){var bh=this;var A=bh._hDocMouseDownEv;if(bi.newVal){if(!A){bh._hDocMouseDownEv=ar.getDoc().on(V,ar.bind(bh._onDocMouseDownExt,bh));}}else{if(A){A.detach();bh._hDocMouseDownEv=null;}}},_handleCancelEvent:function(){var A=this;A.fire(ak);},_handleEditEvent:function(){var A=this;A.fire(L);},_handleInitEditEvent:function(){var A=this;if(A.get(a6)){this.fire(n);}},_handleInitValidatorEvent:function(){var A=this;if(A.get(a6)){this.fire(at);}},_handleInitToolbarEvent:function(){var A=this;if(A.get(a6)&&A.get(W)){this.fire(bc);}},_handleSaveEvent:function(){var A=this;if(!A.validator.hasErrors()){A.fire(aJ,{newVal:A.getValue(),prevVal:A.get(a2)});}},_onDocMouseDownExt:function(bi){var A=this;var bh=A.get(r);if(!bh.contains(bi.target)){A.set(ac,false);}},_onEscKey:function(bh){var A=this;A.hide();},_onSubmit:function(bi){var A=this;var bh=bi.validator;A._handleSaveEvent();if(bh){bh.formEvent.halt();}},_setToolbar:function(bi){var bh=this;var A=bh.getStrings();return ar.merge({activeState:false,children:[{label:A[aJ],icon:an,type:aY},{handler:ar.bind(bh._handleCancelEvent,bh),label:A[ak]}]},bi);},_setValidator:function(bh){var A=this;return ar.merge({boundingBox:A.get(v),bubbleTargets:A},bh);},_uiSetShowToolbar:function(bi){var A=this;var bh=A.footerNode;if(bi){bh.show();}else{bh.hide();}A._handleInitToolbarEvent();},getElementsValue:function(){var A=this;var bh=A.elements;if(bh){return bh.get(a2);}return R;},renderUI:function(){var A=this;if(A.ELEMENT_TEMPLATE){A.elements=ar.Node.create(A.ELEMENT_TEMPLATE);A._syncElementsName();A.setStdModContent(ao.BODY,A.elements);}},_defInitEditFn:function(A){},_syncElementsFocus:function(){var A=this;A.elements.selectText();},_syncElementsName:function(){var A=this;A.elements.setAttribute(l,A.get(aB));},_syncFocus:function(){var A=this;ar.later(0,A,A._syncElementsFocus);},_uiSetEditable:function(bi){var A=this;var bh=A.toolbar;if(A.get(a6)&&bh){if(bi){bh.add({handler:ar.bind(A._handleEditEvent,A),icon:k,label:A.getString(L)},1);}else{bh.remove(1);}}},_uiSetValue:function(bi){var A=this;var bh=A.elements;if(bh){bh.val(A.formatValue(A.get(a8),bi));}}}});ar.BaseCellEditor=q;var be=ar.Component.create({NAME:t,ATTRS:{inputFormatter:{value:null},options:{setter:"_setOptions",value:{},validator:H},outputFormatter:{value:null},selectedAttrName:{value:aV,validator:aX},strings:{value:{add:"Add",cancel:"Cancel",addOption:"Add option",edit:"Edit options",editOptions:"Edit option(s)",name:"Name",remove:"Remove",save:"Save",stopEditing:"Stop editing",value:"Value"}}},EXTENDS:ar.BaseCellEditor,UI_ATTRS:[aZ],prototype:{EDIT_TEMPLATE:'<div class="'+b+'"></div>',EDIT_OPTION_ROW_TEMPLATE:'<div class="'+aA+'">'+'<span class="'+[bf,j,aa].join(ba)+'"></span>'+'<input class="'+ax+'" size="7" placeholder="{titleName}" title="{titleName}" type="text" value="{valueName}" /> '+'<input class="'+aI+'" size="7" placeholder="{titleValue}" title="{titleValue}" type="text" value="{valueValue}" /> '+'<a class="'+[p,aT].join(ba)+'" href="javascript:void(0);">{remove}</a> '+"</div>",EDIT_ADD_LINK_TEMPLATE:'<a class="'+[p,g].join(ba)+'" href="javascript:void(0);">{addOption}</a> ',EDIT_LABEL_TEMPLATE:'<div class="'+am+'">{editOptions}</div>',editContainer:null,editSortable:null,options:null,initializer:function(){var A=this;A.on(L,A._onEditEvent);A.on(aJ,A._onSave);A.after(bc,A._afterInitToolbar);},addNewOption:function(bj,bk){var A=this;var bi=A.editContainer.one(i+g);var bh=ar.Node.create(A._createEditOption(bj||R,bk||R));bi.placeBefore(bh);bh.one(Z).focus();},removeOption:function(A){A.remove();},saveOptions:function(){var A=this;var bk=A.editContainer;if(bk){var bj=bk.all(i+ax);var bh=bk.all(i+aI);var bi={};bj.each(function(bn,bm){var bl=bn.val();var bo=bh.item(bm).val();if(bl&&bo){bi[bo]=bl;}});A.set(aZ,bi);A._uiSetValue(A.get(a2));A.toggleEdit();}},toggleEdit:function(){var A=this;A.editContainer.toggle();},_createOptions:function(bi){var bm=this;var A=bm.elements;var bk=[];var bh=[];var bj=bm.OPTION_TEMPLATE;var bn=bm.OPTION_WRAPPER;ar.each(bi,function(br,bq){var bp={id:ar.guid(),label:br,name:bq,value:bq};if(bj){bk.push(ab.sub(bj,bp));}if(bn){bh.push(ab.sub(bn,bp));}});var bo=ar.NodeList.create(bk.join(R));var bl=ar.NodeList.create(bh.join(R));if(bl.size()){bl.each(function(bq,bp){bq.prepend(bo.item(bp));});A.setContent(bl);}else{A.setContent(bo);}bm.options=bo;},_createEditBuffer:function(){var bh=this;var A=bh.getStrings();var bi=[];bi.push(ab.sub(bh.EDIT_LABEL_TEMPLATE,{editOptions:A[ah]}));ar.each(bh.get(aZ),function(bj,bk){bi.push(bh._createEditOption(bj,bk));});bi.push(ab.sub(bh.EDIT_ADD_LINK_TEMPLATE,{addOption:A[a4]}));return bi.join(R);},_createEditOption:function(bi,bj){var bh=this;var A=bh.getStrings();return ab.sub(bh.EDIT_OPTION_ROW_TEMPLATE,{remove:A[a9],titleName:A[l],titleValue:A[a2],valueName:bi,valueValue:bj});},_defInitEditFn:function(bh){var A=this;var bi=ar.Node.create(A.EDIT_TEMPLATE);bi.delegate("click",ar.bind(A._onEditLinkClickEvent,A),i+p);bi.delegate("keydown",ar.bind(A._onEditKeyEvent,A),Z);A.editContainer=bi;A.setStdModContent(ao.BODY,bi.hide(),ao.AFTER);A.editSortable=new ar.Sortable({container:bi,handles:[i+bf],nodes:i+aA,opacity:".3"}).delegate.dd.plug(ar.Plugin.DDConstrained,{constrain:bi,stickY:true});A._syncEditOptionsUI();},_getSelectedOptions:function(){var A=this;var bh=[];A.options.each(function(bi){if(bi.get(A.get(az))){bh.push(bi);}});return ar.all(bh);},_onEditEvent:function(bh){var A=this;A._handleInitEditEvent();A.toggleEdit();A._syncEditOptionsUI();},_onEditLinkClickEvent:function(bh){var A=this;var bi=bh.currentTarget;if(bi.test(i+g)){A.addNewOption();}else{if(bi.test(i+a7)){A.toggleEdit();}else{if(bi.test(i+aT)){A.removeOption(bi.ancestor(i+aA));}}}bh.halt();},_onEditKeyEvent:function(bh){var A=this;var bi=bh.currentTarget;if(bh.isKey(ae)){var bj=bi.next(Z);if(bj){bj.selectText();}else{A.addNewOption();}bh.halt();}},_onSave:function(bh){var A=this;A.saveOptions();},_setOptions:function(bh){var A={};
if(e(bh)){bd.each(bh,function(bi){A[bi]=bi;});}else{if(H(bh)){A=bh;}}return A;},_syncEditOptionsUI:function(){var A=this;A.editContainer.setContent(A._createEditBuffer());},_uiSetOptions:function(bh){var A=this;A._uiSetValue(A.get(a2));A._createOptions(bh);A._syncElementsName();},_uiSetValue:function(bi){var A=this;var bh=A.options;if(bh&&bh.size()){bh.set(A.get(az),false);if(bi){if(!e(bi)){bi=bi.split(bg);}bd.each(bi,function(bj){bh.filter('[value="'+ab.trim(bj)+'"]').set(A.get(az),true);});}}return bi;}}});ar.BaseOptionsCellEditor=be;var ay=ar.Component.create({NAME:x,EXTENDS:ar.BaseCellEditor,prototype:{ELEMENT_TEMPLATE:'<input autocomplete="off" class="'+S+'" type="text" />'}});ar.TextCellEditor=ay;var aD=ar.Component.create({NAME:Q,EXTENDS:ar.BaseCellEditor,prototype:{ELEMENT_TEMPLATE:'<textarea class="'+S+'"></textarea>'}});ar.TextAreaCellEditor=aD;var M=ar.Component.create({NAME:aO,ATTRS:{multiple:{value:false,validator:aS}},EXTENDS:ar.BaseOptionsCellEditor,UI_ATTRS:[Y],prototype:{ELEMENT_TEMPLATE:'<select class="'+S+'"></select>',OPTION_TEMPLATE:'<option value="{value}">{label}</option>',getElementsValue:function(){var A=this;if(A.get(Y)){return A._getSelectedOptions().get(a2);}return A.elements.get(a2);},_syncElementsFocus:function(){var A=this;A.elements.focus();},_uiSetMultiple:function(bi){var A=this;var bh=A.elements;if(bi){bh.setAttribute(Y,Y);}else{bh.removeAttribute(Y);}}}});ar.DropDownCellEditor=M;var al=ar.Component.create({NAME:B,ATTRS:{selectedAttrName:{value:o}},EXTENDS:ar.BaseOptionsCellEditor,prototype:{ELEMENT_TEMPLATE:'<div class="'+S+'"></div>',OPTION_TEMPLATE:'<input class="'+J+'" id="{id}" name="{name}" type="checkbox" value="{value}"/>',OPTION_WRAPPER:'<label class="'+w+'" for="{id}"><span class="'+aW+'">{label}</span></label>',getElementsValue:function(){var A=this;return A._getSelectedOptions().get(a2);},_syncElementsFocus:function(){var A=this;var bh=A.options;if(bh&&bh.size()){bh.item(0).focus();}},_syncElementsName:function(){var A=this;var bh=A.options;if(bh){bh.setAttribute(l,A.get(aB));}}}});ar.CheckboxCellEditor=al;var I=ar.Component.create({NAME:ai,EXTENDS:ar.CheckboxCellEditor,prototype:{OPTION_TEMPLATE:'<input class="aui-field-input-choice" id="{id}" name="{name}" type="radio" value="{value}"/>',getElementsValue:function(){var A=this;return A._getSelectedOptions().get(a2)[0];}}});ar.RadioCellEditor=I;var a=ar.Component.create({NAME:K,EXTENDS:ar.BaseCellEditor,ATTRS:{bodyContent:{value:R},calendar:{setter:"_setCalendar",validator:H,value:null}},prototype:{ELEMENT_TEMPLATE:'<input class="'+S+'" type="hidden" />',initializer:function(){var A=this;A.on("calendar:select",ar.bind(A._onDateSelect,A));},getElementsValue:function(){var A=this;return A.calendar.getFormattedSelectedDates().join(bg);},_afterRender:function(){var A=this;ar.DateCellEditor.superclass._afterRender.apply(A,arguments);A.calendar=new ar.Calendar(A.get(P)).render(A.bodyNode);},_onDateSelect:function(bh){var A=this;A.elements.val(bh.date.formatted.join(bg));},_setCalendar:function(bh){var A=this;return ar.merge({bubbleTargets:A},bh);},_uiSetValue:function(bi){var A=this;var bh=A.calendar;if(bh){if(bi&&aX(bi)){bi=bi.split(bg);}A.calendar.set("dates",bi);}}}});ar.DateCellEditor=a;},"@VERSION@",{skinnable:true,requires:["datatable-base","aui-calendar","aui-toolbar","aui-form-validator","overlay","sortable"]});