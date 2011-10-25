AUI.add("aui-form-builder-base",function(br){var bk=br.Lang,aA=bk.isArray,aC=bk.isBoolean,bh=bk.isString,bO=bk.isObject,ac=bk.isValue,bL=br.Array,bQ=br.AvailableField.getAvailableFieldById,e=function(A){return(A instanceof br.AvailableField);},aY=function(A){return(A instanceof br.Node);},aH=function(A){return(A instanceof br.NodeList);},bP=function(A){return(A instanceof br.FormBuilder);},bg=function(A){return(A instanceof br.FormBuilderField);},a0=br.DD.DDM,d="acceptChildren",bm="active",aX="allowRemoveRequiredFields",H="add",bI="append",o="autoSelectFields",bu="availableField",bN="availableFields",X="base",ax="boundingBox",by="builder",bD="button",z="buttons",s="buttonsNode",i="children",bj="click",al="cloneNode",az="component",at="container",ar="content",bK="contentBox",aZ="data",ad="dblclick",Y="dd",bC="default",ag="defaultMessage",B="defaultMessageNode",aB="delete",j="diagram",bb=".",aL="drag",am="dragContainer",r="dragContainerNode",bn="dragNodesList",bc="draggable",n="dragging",ai="drop",aR="dropContainer",aU="dropContainerNode",bt="dropNode",aF="dropZoneNode",ao="duplicate",C="edit",bF="editing",bd="emptySelection",a6="",bs="enableEditing",aV="field",c="fields",D="fieldsNestedListConfig",aj="first",m="firstChild",P="focused",k="form",aO="formBuilder",Q="form-layout",h="helper",aa="hidden",l="icon",bA="id",bJ="inactive",bx="index",aE="input",b="items",bR="key",R="label",bp="labelNode",av="last",aI="lastChild",af="list",aJ="localizationMap",aW="message",be="mouseenter",w="mouseleave",ak="name",a3="nestedList",bS="node",N="options",aK="over",ah="parent",G="parentNode",S="placeAfter",y="placeBefore",bq="placeholder",au="predefinedValue",aN="prepend",bv="readOnlyAttributes",a8="records",bz="recordset",T="region",bM="remove",t="render",ay="rendered",W="required",ba="save",aP="selected",aD="settings",aT="settingsButtonsNode",Z="settingsFormNode",I="showLabel",J=" ",aQ="srcNode",a5="state",bl="strings",aM="tabs",U="tabsContentNode",a2="tabsListNode",a="tabsNode",bE="tabview",p="target",M="templateNode",a7="text",q="tip",K="type",an="unique",f="value",E="values",aS="widget",a1="width",bi="zone",g=",",bH="-",ab=".",x="",bo="#",aG="_",v=br.getClassName,bf=bN+aG+aV+aG,bw=c+aG+aV+aG,O=v(Y,n),bG=v(j,by,ai,at),bB=v(j,by,aV,bc),V=v(k,by,ai,bi),a9=v(k,by,aV),aq=v(k,by,aV,bF),u=v(k,by,bq),a4=v(k,by,an),ap=[bA,ak],ae='<div class="'+u+'"></div>';var F=br.Component.create({NAME:bu,ATTRS:{name:{value:x},options:{validator:bO,value:{}},predefinedValue:{value:x},readOnlyAttributes:{value:[],validator:aA},required:{validator:aC,value:false},showLabel:{validator:aC,value:true},tip:{validator:bh,value:x},unique:{value:false,validator:aC},width:{}},EXTENDS:br.AvailableField});br.FormBuilderAvailableField=F;var aw=br.Component.create({NAME:aO,ATTRS:{allowRemoveRequiredFields:{validator:aC,value:false},autoSelectFields:{value:false},enableEditing:{value:true},fieldsNestedListConfig:{setter:"_setFieldsNestedListConfig",validator:bO,value:null},strings:{value:{addNode:"Add field",cancel:"Cancel",propertyName:"Property Name",save:"Save",settings:"Settings",value:"Value"}}},UI_ATTRS:[aX],EXTENDS:br.DiagramBuilderBase,FIELDS_TAB:0,SETTINGS_TAB:1,prototype:{uniqueFields:new br.DataSet(),initializer:function(){var A=this;A.on({cancel:A._onCancel,"drag:end":A._onDragEnd,"drag:start":A._onDragStart,"drag:mouseDown":A._onDragMouseDown,save:A._onSave});A.uniqueFields.after(H,br.bind(A._afterUniqueFieldsAdd,A));A.uniqueFields.after(bM,br.bind(A._afterUniqueFieldsRemove,A));A.dropContainer.delegate(bj,br.bind(A._onClickField,A),ab+a9);A.dropContainer.delegate(ad,br.bind(A._onDblClickField,A),ab+a9);},syncUI:function(){var A=this;A._setupAvailableFieldsNestedList();A._setupFieldsNestedList();},closeEditProperties:function(){var A=this;var L=A.editingField;A.tabView.selectTab(br.FormBuilder.FIELDS_TAB);if(L&&L.get(ay)){L.get(ax).removeClass(aq);}A.editingField=null;},createField:function(L){var A=this;if(!bg(L)){L=new (A.getFieldClass(L.type||aV))(L);}L.set(by,A);L.set(ah,A);return L;},duplicateField:function(bT){var A=this;var L=A._getFieldNodeIndex(bT.get(ax));var bU=A._cloneField(bT,true);A.insertField(bU,++L,bT.get(ah));},editField:function(L){var A=this;if(bg(L)){A.closeEditProperties();A.tabView.selectTab(br.FormBuilder.SETTINGS_TAB);A.propertyList.set(bz,L.getProperties());L.get(ax).addClass(aq);A.editingField=A.selectedField=L;}},getFieldClass:function(bT){var A=this;var L=br.FormBuilder.types[bT];if(L){return L;}else{br.log("The field type: ["+bT+"] couldn't be found.");return null;}},insertField:function(bU,L,bT){var A=this;bT=bT||A;bU.get(ah).removeField(bU);bT.addField(bU,L);},plotField:function(bU,L){var A=this;var bT=bU.get(ax);if(!bU.get(ay)){bU.render(L);}else{L.append(bT);}A._syncUniqueField(bU);A.fieldsNestedList.add(bT);},plotFields:function(L,bT){var A=this;bT=bT||A.dropContainer;L=L||A.get(c);bT.setContent(a6);br.each(L,function(bU){A.plotField(bU,bT);});},select:function(L){var A=this;A.unselectFields();A.selectedField=L.set(aP,true).focus();},unselectFields:function(){var A=this;var L=A.selectedField;if(L){L.set(aP,false);}A.selectedField=null;},_afterUniqueFieldsAdd:function(bT){var A=this;var bU=bT.attrName;if(e(bU)){var L=bU.get(bS);bU.set(bc,false);L.unselectable();}},_afterUniqueFieldsRemove:function(bT){var A=this;var bU=bT.attrName;if(e(bU)){var L=bU.get(bS);bU.set(bc,true);L.selectable();}},_cloneField:function(bU,L){var A=this;var bT={};bL.each(bU.getProperties(),function(bW){var bV=bW.attributeName;if(bL.indexOf(ap,bV)===-1){bT[bV]=bW.value;}});if(L){bT[c]=[];br.each(bU.get(c),function(bW,bV){if(!bW.get(an)){bT[c][bV]=A._cloneField(bW,L);}});}return A.createField(bT);},_dropField:function(bW){var L=this;var bY=bW.getData(bu);var bX=br.Widget.getByNode(bW);var A=bW.get(G);if(e(bY)){var bU={label:bY.get(R),localizationMap:bY.get(aJ),options:bY.get(N),predefinedValue:bY.get(au),readOnlyAttributes:bY.get(bv),required:bY.get(W),showLabel:bY.get(I),tip:bY.get(q),type:bY.get(K),unique:bY.get(an),width:bY.get(a1)};
if(bU.unique){bU.id=L._getFieldId(bY);bU.name=bY.get(ak);}bX=L.createField(bU);}if(bg(bX)){var bV=br.Widget.getByNode(A);if(!bg(bV)){bV=L;}var bT=L._getFieldNodeIndex(bW);L.insertField(bX,bT,bV);L.select(bX);}},_getFieldId:function(bT){var A=this;var bU=bT.get(bA);var L;if(e(bT)){L=bf;}else{L=bw;}return bU.replace(L,x);},_getFieldNodeIndex:function(L){var A=this;return L.get(G).all("> *:not("+ab+u+")").indexOf(L);},_onClickField:function(L){var A=this;var bT=br.Widget.getByNode(L.currentTarget);A.select(bT);L.stopPropagation();},_onDblClickField:function(L){var A=this;if(!L.target.ancestor(ab+a9,true)){return;}var bT=br.Widget.getByNode(L.currentTarget);if(bT){A.editField(bT);}L.stopPropagation();},_onDragEnd:function(bT){var A=this;var L=bT.target;var bU=L.get(bS);A._dropField(bU);if(!bg(br.Widget.getByNode(bU))){bU.remove();L.set(bS,A._originalDragNode);}},_onDragMouseDown:function(L){var A=this;var bT=L.target.get(bS);var bU=br.AvailableField.getAvailableFieldByNode(bT);if(e(bU)&&!bU.get(bc)){L.halt();}},_onDragStart:function(bU){var A=this;var bT=bU.target;var bW=bT.get(bS);if(bg(br.Widget.getByNode(bW))){return;}A._originalDragNode=bW;var bV=bW.clone();bW.placeBefore(bV);bT.set(bS,bV);var L=bW.getData(bu);bV.setData(bu,L);bV.attr(bA,a6);bV.hide();bW.removeClass(O);bW.show();A.fieldsNestedList.add(bV);},_onSave:function(bT){var A=this;var L=A.editingField;if(L){var bU=A.propertyList.get(bz);bL.each(bU.get(a8),function(bV){var bW=bV.get(aZ);L.set(bW.attributeName,bW.value);});A._syncUniqueField(L);}},_setAvailableFields:function(bT){var L=this;var A=[];bL.each(bT,function(bV,bU){A.push(e(bV)?bV:new br.FormBuilderAvailableField(bV));});return A;},_setFieldsNestedListConfig:function(bT){var A=this;var L=A.dropContainer;return br.merge({bubbleTargets:A,dd:{groups:[bN],plugins:[{cfg:{horizontal:false,scrollDelay:150},fn:br.Plugin.DDWinScroll}]},dropCondition:function(bV){var bU=bV.drop.get(bS);var bW=br.Widget.getByNode(bU);if(bg(bW)){return true;}return false;},placeholder:br.Node.create(ae),dropOn:ab+V,sortCondition:function(bV){var bU=bV.drop.get(bS);return(bU!==A.dropContainer&&L.contains(bU));}},bT||{});},_setupAvailableFieldsNestedList:function(){var A=this;if(!A.availableFieldsNestedList){var L=A.fieldsContainer.all(ab+bB);A.availableFieldsNestedList=new br.NestedList(br.merge(A.get(D),{nodes:L}));}},_setupFieldsNestedList:function(){var A=this;if(!A.fieldsNestedList){A.fieldsNestedList=new br.NestedList(A.get(D));}},_syncUniqueField:function(bT){var A=this;var L=A.uniqueFields;var bU=bQ(A._getFieldId(bT));if(e(bU)){if(bU.get(an)||bT.get(an)){L.add(bU,bT);}}},_uiSetAllowRemoveRequiredFields:function(L){var A=this;A.get(c).each(function(bT){bT._uiSetRequired(bT.get(W));});}}});br.FormBuilder=aw;br.FormBuilder.types={};},"@VERSION@",{requires:["aui-base","aui-button-item","aui-data-set","aui-diagram-builder-base","aui-nested-list","aui-tabs"],skinnable:true});