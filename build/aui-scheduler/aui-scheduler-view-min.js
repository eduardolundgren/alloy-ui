AUI.add("aui-scheduler-view",function(cE){var cS=cE.Lang,bb=cS.isBoolean,y=cS.isFunction,aL=cS.isNumber,c7=cS.isObject,cs=cS.isString,ce=function(A){return parseFloat(A)||0;},ch=function(dc,A){return Math.round(dc/A)*A;},au=cE.DataType.DateMath,cz=cE.WidgetStdMod,aT=au.WEEK_LENGTH,cj="scheduler-view",aK="scheduler-view-day",cZ="scheduler-view-month",b9="scheduler-view-table",cJ="scheduler-view-week",bp="activeColumn",cd="activeView",O="allDay",a1="boundingBox",da="cancel",ak="col",aB="colDaysNode",cH="colHeaderDaysNode",J="colblank",x="coldata",aN="colday",a="colgrid",Y="colspan",n="coltime",bK="columnData",a9="columnDayHeader",aP="columnShims",aY="columnTableGrid",bx="columnTime",aX="container",aU="content",bo="creationEndDate",ab="creationStartDate",bw="currentDate",bY="data",cP="day",U="days",C="delegateConfig",cc="disabled",a6="displayDaysInterval",Z="div",bI="division",c2="dotted",ad="down",G="draggingEvent",cr="duration",aF="endDate",bj="event",c1="eventClass",cb="eventPlaceholder",c9="eventRecorder",s="eventWidth",cy="filterFn",aM="first",cK="firstDayOfWeek",b2="fixedHeight",bs="grid",bV="gridContainer",bk="grip",c8="hd",cB="header",bu="headerDateFormat",c5="headerTableNode",bf="headerView",bG="headerViewConfig",aR="headerViewLabelNode",co="height",bm="horizontal",a0="host",aI="hourHeight",u="icon",u="icon",ao="isoTime",ae="label",a7="lasso",a2="left",aC="locale",ag="marker",bl="markercell",bd="markercellsNode",K="markers",b4="markersNode",b6="month",bq="monthContainerNode",cL="monthRowContainer",e="monthRows",D="mousedown",M="mousemove",a5="mouseup",aV="next",db="node",an="nomonth",av="noscroll",cA="offsetHeight",cC="offsetWidth",cF="pad",aO="paddingNode",cU="parentEvent",S="parentNode",bR="proxy",al="px",ah="region",a3="rendered",cw="repeated",cm="resizer",ct="resizerNode",cg="resizing",be="right",bO="row",bN="rowsContainerNode",ci="save",r="scheduler",aH="scheduler-event",aa="scrollable",T="shim",cI="startDate",X="startXY",cu="strings",a4="table",B="tableGridNode",bW="tableNode",b7="tableRowContainer",cY="tableRows",bT="tbody",g="td",bL="time",am="timesNode",i="title",ap="today",bP="top",c6="tr",bU="view",aA="visible",cV="week",b0="width",v="data-colnumber",k="a",bH=",",cf="-",cl=".",ca="",b1="%",W=" ",E=cE.getClassName,bJ=E(cj,av),af=E(cj,aa);var bc=cE.Component.create({NAME:cj,AUGMENTS:[cE.WidgetStdMod],ATTRS:{bodyContent:{value:ca},eventClass:{valueFn:function(){return cE.SchedulerEvent;}},filterFn:{validator:y,value:function(A){return true;}},height:{value:600},isoTime:{value:false,validator:bb},name:{value:ca,validator:cs},navigationDateFormat:{value:"%A - %d %B, %Y",validator:cs},nextDate:{getter:"getNextDate",readOnly:true},prevDate:{getter:"getPrevDate",readOnly:true},scheduler:{lazyAdd:false,setter:"_setScheduler"},scrollable:{value:true,validator:bb},triggerNode:{setter:cE.one},visible:{value:false}},BIND_UI_ATTRS:[aa],prototype:{initializer:function(){var A=this;A.after("render",A._afterRender);},syncUI:function(){var A=this;A.syncStdContent();},adjustCurrentDate:function(){var A=this;var dd=A.get(r);var dc=dd.get(bw);dd.set(bw,dc);},flushViewCache:function(){},getNextDate:function(){},getPrevDate:function(){},getToday:function(){return au.clearTime(new Date());},limitDate:function(dc,dd){var A=this;if(au.after(dc,dd)){dc=au.clone(dd);}return dc;},plotEvents:function(){},syncStdContent:function(){},syncEventUI:function(A){},_uiSetCurrentDate:function(A){},_afterRender:function(dc){var A=this;A.adjustCurrentDate();A._uiSetScrollable(A.get(aa));},_setScheduler:function(dd){var A=this;var dc=A.get(r);if(dc){A.removeTarget(dc);}if(dd){A.addTarget(dd);dd.after("eventsChange",cE.bind(A.flushViewCache,A));}return dd;},_uiSetScrollable:function(dd){var A=this;var dc=A.bodyNode;if(dc){dc.toggleClass(af,dd);dc.toggleClass(bJ,!dd);}},_uiSetVisible:function(dc){var A=this;bc.superclass._uiSetVisible.apply(this,arguments);if(dc&&A.get(a3)){A.adjustCurrentDate();}}}});cE.SchedulerView=bc;var b8=cS.sub;var l=cE.cached(function(){var de=cE.config.doc,dc=de.createElement("div"),A=de.getElementsByTagName("body")[0],dd=0.1;if(A){dc.style.cssText="position:absolute;visibility:hidden;overflow:scroll;width:20px;";dc.appendChild(de.createElement("p")).style.height="1px";A.insertBefore(dc,A.firstChild);dd=dc.offsetWidth-dc.clientWidth;A.removeChild(dc);}return dd;},null,0.1);var N=function(A,dc){return function(de){var dd=de.all(A);return(dd.size()>=dc)?dd:null;};},h=E(u),H=E(u,bk,c2,bm),aQ=E(aH),bC=E(aH,cc),cp=E(aH,bR),R=E(r,ap),ar=E(r,ap,c8),z=E(cj,x),d=E(cj,a),cM=E(cj,bs),cN=E(cj,bs,aX),aS=E(cj,cP,cm,u),cn=E(cj,cP,cm),bF=E(cj,ag,bI),cO=E(cj,bl),L=E(cj,K),bX=E(cj,cP,a4),cR=E(cj,cP,cB,a4),t=E(cj,cP,cB,cP),bE=E(cj,cP,cB,cP,cF,be),cq=E(cj,cP,cB,cP,aM),bi=E(cj,cP,cB,ak),br=E(cj,cP,cB,bU,ae),c3=E(cj,cP,a4,ak),aG=E(cj,cP,a4,ak,T),Q=E(cj,cP,a4,J),I=E(cj,cP,a4,aN),cW=E(cj,cP,a4,n),bM=E(cj,cP,a4,bL),p='<div class="'+cn+'">'+'<div class="'+[h,H,aS].join(W)+'"></div>'+"</div>",ai='<div class="'+cO+'">'+'<div class="'+bF+'"></div>'+"</div>",o='<span class="'+br+'">{label}</span>',ay='<table cellspacing="0" cellpadding="0" class="'+bX+'">'+"<tbody>"+'<tr class="'+d+'" height="1">'+'<td height="0" class="'+[c3,Q].join(W)+'"></td>'+'<td class="'+cN+'" colspan="1">'+'<div class="'+cM+'">'+'<div class="'+L+'"></div>'+"</div>"+"</td>"+"</tr>"+'<tr class="'+z+'">'+'<td class="'+[c3,cW].join(W)+'"></td>'+"</tr>"+"</tbody>"+"</table>",by='<td class="'+[c3,I].join(W)+'" data-colnumber="{colNumber}">'+'<div class="'+aG+'"></div>'+"</td>",j='<div class="'+bM+'">{hour}</div>',az='<table cellspacing="0" cellpadding="0" class="'+cR+'">'+"<tbody>"+'<tr class="'+bi+'"></tr>'+"</tbody>"+"</table>",bB='<th class="'+t+'" data-colnumber="{colNumber}"><a href="#">&nbsp;</a></th>',ax='<td class="'+[t,cq].join(W)+'"></td>',w='<th class="'+[t,bE].join(W)+'">&nbsp;</th>';var c4=cE.Component.create({NAME:aK,ATTRS:{bodyContent:{value:ca},days:{value:1,validator:aL},delegateConfig:{value:{},setter:function(dc){var A=this;return cE.merge({dragConfig:{useShim:false},bubbleTargets:A,container:A.get(a1),nodes:cl+aQ,invalid:"input, select, button, a, textarea, "+cl+bC},dc||{});
},validator:c7},eventWidth:{value:95,validator:aL},filterFn:{value:function(A){return(A.getHoursDuration()<=24&&!A.get(O));}},headerDateFormat:{value:"%d %A",validator:cs},headerView:{value:true,validator:bb},headerViewConfig:{setter:function(dc){var A=this;return cE.merge({displayDaysInterval:1,displayRows:6,filterFn:function(dd){return((dd.getHoursDuration()>24)||dd.get(O));},height:"auto",visible:true},dc||{});},value:{}},hourHeight:{value:52,validator:aL},name:{value:cP},strings:{value:{allDay:"All day"}},headerTableNode:{valueFn:function(){return cE.Node.create(az);}},headerViewLabelNode:{valueFn:function(){var dc=this;var A=dc.get(cu);return cE.Node.create(b8(o,{label:A[O]}));}},resizerNode:{valueFn:function(){return cE.Node.create(p);}},tableNode:{valueFn:function(){return cE.Node.create(ay);}},colDaysNode:{valueFn:"_valueColDaysNode"},colHeaderDaysNode:{valueFn:"_valueColHeaderDaysNode"},markercellsNode:{valueFn:"_valueMarkercellsNode"},timesNode:{valueFn:"_valueTimesNode"}},HTML_PARSER:{colDaysNode:N(cl+I,1),colHeaderDaysNode:N(cl+t,2),headerTableNode:cl+cR,headerViewLabelNode:cl+br,markercellsNode:N(cl+cO,24),resizerNode:cl+cn,tableNode:cl+bX,timesNode:N(cl+bM,24)},EXTENDS:cE.SchedulerView,prototype:{initializer:function(){var A=this;A[aB]=A.get(aB);A[cH]=A.get(cH);A[c5]=A.get(c5);A[bd]=A.get(bd);A[ct]=A.get(ct);A[bW]=A.get(bW);A[am]=A.get(am);A[bp]=null;A[bK]=A[bW].one(cl+z);A[a9]=A.headerTableNode.one(cl+bi);A[aP]=A[aB].all(cl+aG);A[bx]=A[bW].one(cl+cW);A[bV]=A[bW].one(cl+cN);A[b4]=A[bW].one(cl+L);if(A.get(bf)){A[bf]=new cE.SchedulerTableView(A.get(bG));}},renderUI:function(){var A=this;A[bx].setContent(A[am]);A[b4].setContent(A[bd]);A[aB].appendTo(A[bK]);A[cH].appendTo(A[a9]);if(A[bf]){A[bf].set(r,A.get(r));A[bf].render();}},bindUI:function(){var A=this;A[c5].delegate("click",cE.bind(A._onClickDaysHeader,A),cl+t);A[bK].delegate("mousedown",cE.bind(A._onMouseDownTableCol,A),cl+c3);A[bK].delegate("mouseenter",cE.bind(A._onMouseEnterEvent,A),cl+aQ);A[bK].delegate("mouseleave",cE.bind(A._onMouseLeaveEvent,A),cl+aQ);A[bK].delegate("mousemove",cE.bind(A._onMouseMoveTableCol,A),cl+I);A[bK].delegate("mouseup",cE.bind(A._onMouseUpTableCol,A),cl+c3);A.on("drag:end",A._onEventDragEnd);A.on("drag:start",A._onEventDragStart);A.on("drag:tickAlignY",A._dragTickAlignY);A.on("schedulerChange",A._onSchedulerChange);A.after("drag:align",A._afterDragAlign);},syncUI:function(){var A=this;c4.superclass.syncUI.apply(this,arguments);A[bV].attr(Y,A.get(U));A._setupDragDrop();},syncStdContent:function(){var dc=this;dc.setStdModContent(cz.BODY,dc[bW].getDOM());var A=cE.NodeList.create(dc[c5]);if(dc[bf]){A.push(dc[bf].get(a1));A.push(dc.get(aR));}dc.setStdModContent(cz.HEADER,A);},calculateEventHeight:function(dd){var dc=this;var A=dc.get(aI);return Math.max(dd*(A/60),A/2);},calculateTop:function(dc){var A=this;return((dc.getHours()*60)+dc.getMinutes()+(dc.getSeconds()/60))*(A.get(aI)/60);},getNextDate:function(){var A=this;var dc=A.get(r).get(bw);return au.add(dc,au.DAY,1);},getPrevDate:function(){var A=this;var dc=A.get(r).get(bw);return au.subtract(dc,au.DAY,1);},getColumnByDate:function(dc){var A=this;return A[aB].item(A.getDateDaysOffset(dc));},getColumnShimByDate:function(dc){var A=this;return A[aP].item(A.getDateDaysOffset(dc));},getDateByColumn:function(dd){var A=this;var dc=au.safeClearTime(A.get(r).get(bw));return au.add(dc,au.DAY,dd);},getDateDaysOffset:function(dd){var A=this;var dc=au.safeClearTime(A.get(r).get(bw));return au.getDayOffset(au.safeClearTime(dd),dc);},getYCoordTime:function(df){var dc=this;var A=dc.get(aI);var dg=ce((df/A).toFixed(2));var de=Math.floor((dg*100)%100*0.6);var dd=Math.floor(dg);return[dd,de,0];},plotEvent:function(dd){var A=this;var de=dd.get(db);if(de.size()<2){dd.addPaddingNode();}var dg=dd.get(db).item(0);var dc=dd.get(db).item(1);var df=A.getColumnShimByDate(dd.get(aF));var dh=A.getColumnShimByDate(dd.get(cI));if(dh){dh.append(dg);if(dd.get(aA)){dg.show();}}else{dg.hide();}if(df){if(df.compareTo(dh)||dd.isDayBoundaryEvent()){dc.hide();}else{df.append(dc);if(dd.get(aA)){dc.show();}}}else{dc.hide();}A.syncEventTopUI(dd);A.syncEventHeightUI(dd);},plotEvents:function(){var A=this;var dc=A.get(r);var dd=A.get(cy);A[aP].each(function(dh,dg){var de=dc.getEventsByDay(A.getDateByColumn(dg),true);var df=[];dh.empty();cE.Array.each(de,function(di){if(dd.apply(A,[di])){A.plotEvent(di);df.push(di);}});A.syncEventsIntersectionUI(df);});if(A.get(bf)){A.syncHeaderViewUI();}},syncColumnsUI:function(){var A=this;A[aB].each(function(de,dd){var dc=A.getDateByColumn(dd);de.toggleClass(R,au.isToday(dc));});},syncDaysHeaderUI:function(){var dd=this;var de=dd.get(r).get(bw);var dc=dd.get(bu);var A=dd.get(aC);dd[cH].all(k).each(function(dh,dg){var df=au.add(de,au.DAY,dg);var di=cE.DataType.Date.format(df,{format:dc,locale:A});dh.toggleClass(ar,au.isToday(df));dh.html(di);});},syncEventsIntersectionUI:function(dc){var A=this;var dd=A.get(s);A.get(r).flushEvents();cE.Array.each(dc,function(df){var dh=A.findEventIntersections(df,dc);var dg=dh.length;var de=(dd/dg);cE.Array.each(dh,function(dj,dk){var di=dj.get(db).item(0);var dm=de*dk;var dl=de*1.7;if(dk===(dg-1)){dl=dd-dm;}di.setStyle(b0,dl+b1);di.setStyle(a2,dm+b1);var dn=di.get(S);if(dn){dn.insert(di,dk);}dj._filtered=true;});});},syncEventHeightUI:function(de){var dc=this;var di=de.get(aF);var A=de.get(cI);var df=au.clone(A);df.setHours(24,0,0);var dg=au.getMinutesOffset(dc.limitDate(di,df),A);de.get(db).item(0).set(cA,dc.calculateEventHeight(dg));var dd=de.get(db).item(1);if(dd.inDoc()){var dh=au.getMinutesOffset(di,au.toMidnight(de.getClearEndDate()));dd.set(cA,dc.calculateEventHeight(dh));}},syncEventTopUI:function(dc){var A=this;dc.get(db).item(0).setStyle(bP,A.calculateTop(dc.get(cI))+al);dc.get(db).item(1).setStyle(bP,0);},syncHeaderViewUI:function(){var A=this;if(A.get(bf)){A[bf].plotEvents();var dd=A[bf].get(a1);dd.setStyle("marginRight",l());var dc=dd.one(cl+bh);A[bf].set(co,dc.get(cA));A._fillHeight();}},calculateYDelta:function(dd,dc){var A=this;
return(dc[1]-dd[1])/(A.get(aI)/2)*30;},findEventIntersections:function(dc,dd){var A=this;var de=[];cE.Array.each(dd,function(df){if(!dc._filtered&&dc.intersectHours(df)){de.push(df);}});return de;},getXYDelta:function(dc){var A=this;var dd=dc.currentTarget.getXY(),de=[dc.pageX,dc.pageY];return cE.Array.map(dd,function(dg,df){return(de[df]-dg);});},getTickY:function(){var A=this;return ch(Math.ceil(A.get(aI)/2),10);},roundToNearestHour:function(dc,dd){var A=this;dc.setHours(dd[0],ch(dd[1],A.getTickY()),dd[2]);},_afterDragAlign:function(dd){var dc=this;var A=dd.target;if(!dc[X]){dc[X]=A.actXY;}A.actXY[0]=null;},_dragTickAlignX:function(dd){var dc=this;var dg=dc[G];if(dg&&!dc[cg]){var de=dc[cb];var df=ce(dd.attr(v))-dc.startColNumber;dc.draggingEventStartDate=au.add(dg.get(cI),au.DAY,df);var A=au.clone(dc.draggingEventStartDate);au.copyHours(A,de.get(cI));de.move(A);dc.plotEvent(de);}},_dragTickAlignY:function(A){var di=this;var dc=di.get(r);var dk=dc.get(c9);var df=di[G];if(df){var dj=A.target.get(a0);var dg=di[cb];var dh=di.calculateYDelta(di[X],dj.actXY);if(di[cg]){var de=au.add(di.draggingEventEndDate,au.MINUTES,dh);if(au.getMinutesOffset(de,di.draggingEventStartDate)<=dk.get(cr)){return;}dg.set(aF,de);}else{dg.move(au.add(di.draggingEventStartDate,au.MINUTES,dh));}di.plotEvent(dg);}},_setupDragDrop:function(){var dc=this;if(!dc[cb]){var dd=dc.get(r);dc[cb]=new (dc.get(c1))({scheduler:dd});dc[cb].removeTarget(dd);dc[cb].get(db).addClass(cp).hide();}if(!dc.delegate){dc.delegate=new cE.DD.Delegate(dc.get(C));}var A=dc.delegate.dd;A.unplug(cE.Plugin.DDConstrained);A.unplug(cE.Plugin.DDNodeScroll);var de=dc.bodyNode.get(ah);de.bottom=Infinity;de.top=-Infinity;A.plug(cE.Plugin.DDConstrained,{bubbleTargets:dc,constrain:de,stickY:true,tickY:dc.get(aI)/2});A.plug(cE.Plugin.DDNodeScroll,{node:dc.bodyNode,scrollDelay:150});},_uiSetCurrentDate:function(dc){var A=this;A.syncColumnsUI();A.syncDaysHeaderUI();},_onClickDaysHeader:function(de){var A=this;var dd=A.get(r);if(de.target.test(k)){var df=dd.getViewByName(cP);if(df){var dc=ce(de.currentTarget.attr(v));dd.set(bw,A.getDateByColumn(dc));dd.set(cd,df);}}de.preventDefault();},_onEventDragEnd:function(dc){var A=this;var de=A[G];if(de){var dd=A[cb];dd.set(aA,false);de.set(aA,true);de.copyDates(dd);A.get(r).syncEventsUI();}A[X]=null;A[G]=null;},_onEventDragStart:function(dd){var A=this;var df=A[G]=A.delegate.dd.get(db).getData(aH);if(df){var de=A[cb];de.copyPropagateAttrValues(df);A.plotEvent(de);df.set(aA,false);A.draggingEventStartDate=au.clone(df.get(cI));A.draggingEventEndDate=au.clone(df.get(aF));var dc=A.getColumnByDate(df.get(cI));A.startColNumber=dc?ce(dc.attr(v)):0;}},_onMouseDownTableCol:function(dc){var dh=this;var dg=dc.target;var de=dh.get(r);var di=de.get(c9);if(di&&!de.get(cc)){di.hideOverlay();if(dg.test(cl+aG)){dh[X]=[dc.pageX,dc.pageY];var dj=ce(dc.currentTarget.attr(v));var dd=dh.getDateByColumn(dj);var A=dh.getXYDelta(dc);dh.roundToNearestHour(dd,dh.getYCoordTime(A[1]));var df=au.add(dd,au.MINUTES,di.get(cr));di.move(dd);di.set(O,false);di.set(aF,df);dh[ab]=dd;dh[bo]=df;dc.halt();}else{if(dg.test([cl+cn,cl+aS].join(bH))){dh[cg]=true;}}}dh.get(a1).unselectable();},_onMouseEnterEvent:function(dc){var A=this;var dd=dc.currentTarget;A[ct].appendTo(dd);},_onMouseLeaveEvent:function(dc){var A=this;if(!A[cg]){A._removeResizer();}},_onMouseMoveTableCol:function(df){var A=this;var de=df.currentTarget;var dc=A.get(r).get(c9);if(A[bp]!==de){A[bp]=de;A._dragTickAlignX(A[bp]);}var dd=A[bo];var dg=A[ab];if(dg){var dh=ch(A.calculateYDelta(A[X],[df.pageX,df.pageY]),A.getTickY());if(A._delta!==dh){if(dh>0){dc.set(aF,au.add(dd,au.MINUTES,dh));}else{dc.set(cI,au.add(dg,au.MINUTES,dh));}A.plotEvent(dc);A._delta=dh;}}},_onMouseUpTableCol:function(de){var A=this;var dd=A.get(r);var dc=dd.get(c9);if(dc&&!dd.get(cc)){if(A[ab]){A.plotEvent(dc);dc.showOverlay();}}A[ab]=null;A[bo]=null;A[cg]=false;A[X]=null;A._removeResizer();A.get(a1).selectable();},_onSchedulerChange:function(dc){var A=this;if(A[bf]){A[bf].set(r,dc.newVal);}},_removeResizer:function(){var A=this;A[ct].remove();},_valueColDaysNode:function(){var A=this;var de=A.get(U);var dc=[],dd=0;while(de--){dc.push(cE.Lang.sub(by,{colNumber:dd++}));}return cE.NodeList.create(dc.join(ca));},_valueColHeaderDaysNode:function(){var A=this;var de=A.get(U);var dc=[],dd=0;dc.push(ax);while(de--){dc.push(cE.Lang.sub(bB,{colNumber:dd++}));}dc.push(w);return cE.NodeList.create(dc.join(ca));},_valueMarkercellsNode:function(){var A=this;var dc=[],dd;for(dd=0;dd<=23;dd++){dc.push(ai);}return cE.NodeList.create(dc.join(ca));},_valueTimesNode:function(){var A=this;var de=A.get(ao);var dd=[],dc;for(dc=0;dc<=23;dc++){dd.push(b8(j,{hour:de?au.toIsoTimeString(dc):au.toUsTimeString(dc,false,true)}));}return cE.NodeList.create(dd.join(ca));}}});cE.SchedulerDayView=c4;var aq=cE.Component.create({NAME:cJ,ATTRS:{bodyContent:{value:ca},days:{value:7},headerViewConfig:{value:{displayDaysInterval:aT}},name:{value:cV}},EXTENDS:cE.SchedulerDayView,prototype:{adjustCurrentDate:function(){var A=this;var de=A.get(r);var dc=de.get(bw);var dd=de.get(cK);de.set(bw,au.getFirstDayOfWeek(dc,dd));},getNextDate:function(){var A=this;var dd=A.get(r);var dc=dd.get(bw);var de=A._firstDayOfWeek(dc);return au.add(de,au.WEEK,1);},getPrevDate:function(){var A=this;var dd=A.get(r);var dc=dd.get(bw);var de=A._firstDayOfWeek(dc);return au.subtract(de,au.WEEK,1);},getToday:function(){var A=this;var dc=aq.superclass.getToday.apply(this,arguments);return A._firstDayOfWeek(dc);},_firstDayOfWeek:function(dd){var A=this;var de=A.get(r);var dc=de.get(cK);return au.getFirstDayOfWeek(dd,dc);}}});cE.SchedulerWeekView=aq;var h=E(u),m=E(u,"arrowstop-1-l"),cX=E(u,"arrowstop-1-r"),q=E(cj,a4,a),aW=E(cj,a4,a,aM),aw=E(cj,a4,a,ap),bz=E(cj,a4,aX),at=E(cj,a4,cB,ak),cT=E(cj,a4,cB,cP),c=E(cj,a4,cB,a4),F=E(cj,a4,a7),cD=E(cj,a4,bO),bZ=E(cj,a4,bO,aX),bh=E(cj,a4,bY),cx=E(cj,a4,bY,ak),bS=E(cj,a4,bY,ak,i),cv=E(cj,a4,bY,ak,i,ad),b3=E(cj,a4,bY,ak,i,aM),c0=E(cj,a4,bY,ak,i,aV),bD=E(cj,a4,bY,ak,i,ap),aD=E(cj,a4,bY,bj),b=E(cj,a4,bY,bj,a2),cG=E(cj,a4,bY,bj,cw),aj=E(cj,a4,bY,bj,be),ac=E(cj,a4,bY,aM),aJ=E(cj,a4,bs),b5=E(cj,a4,bs,aM),aZ='<div class="'+bz+'">'+'<div class="'+bZ+'"></div>'+"</div>",ck='<td class="'+q+'">&nbsp;</td>',f='<th class="'+cT+'"><div>&nbsp;</div></th>',V='<table cellspacing="0" cellpadding="0" class="'+c+'">'+"<tbody>"+'<tr class="'+at+'"></tr>'+"</tbody>"+"</table>",bQ='<div class="'+F+'"></div>',bv='<div class="'+cD+'" style="top: {top}%; height: {height}%;"></div>',bA='<table cellspacing="0" cellpadding="0" class="'+bh+'">'+"<tbody></tbody>"+"</table>",a8='<table cellspacing="0" cellpadding="0" class="'+aJ+'">'+"<tbody>"+"<tr></tr>"+"</tbody>"+"</table>",P='<span class="'+[h,m].join(W)+'"></span>',bn='<span class="'+[h,cX].join(W)+'"></span>',bt='<td class="'+cx+'"><div></div></td>',cQ="<tr></tr>";
var ba=cE.Component.create({NAME:b9,ATTRS:{bodyContent:{value:ca},displayDaysInterval:{value:42},displayRows:{value:4},fixedHeight:{value:true},name:{value:a4},headerDateFormat:{value:"%a"},navigationDateFormat:{value:"%b %Y"},scrollable:{value:false},headerTableNode:{valueFn:function(){return cE.Node.create(V);}},colHeaderDaysNode:{valueFn:"_valueColHeaderDaysNode"},rowsContainerNode:{valueFn:function(){return cE.Node.create(aZ);}},tableGridNode:{valueFn:"_valueTableGridNode"}},HTML_PARSER:{colHeaderDaysNode:N(cl+cT,7),headerTableNode:cl+c,rowsContainerNode:cl+bz,tableGridNode:N(cl+aJ,7)},EXTENDS:cE.SchedulerView,prototype:{evtDateStack:null,evtDataTableStack:null,initializer:function(){var A=this;A.evtDateStack={};A.evtDataTableStack={};A[cH]=A.get(cH);A[c5]=A.get(c5);A[bN]=A.get(bN);A[B]=A.get(B);A[a9]=A.headerTableNode.one(cl+at);A[aY]=cE.NodeList.create();A[b7]=A[bN].one(cl+bZ);A[cY]=cE.NodeList.create();},bindUI:function(){var A=this;var dc=A.get(r).get(c9);dc.on({cancel:cE.bind(A.removeLasso,A),save:cE.bind(A.removeLasso,A)});A[bN].on({mousedown:cE.bind(A._onMouseDownGrid,A),mousemove:cE.bind(A._onMouseMoveGrid,A),mouseup:cE.bind(A._onMouseUpGrid,A)});},renderUI:function(){var dc=this;var df=dc.get(a6);var dd=Math.ceil(df/aT);var dh=100/dd;for(var de=0;de<dd;de++){var A=dc._getTableGridNode(de);var dg=cE.Node.create(cS.sub(bv,{height:dh,top:dh*de}));dg.append(A.toggleClass(b5,(de===0)));dc[cY].push(dg);}dc[cH].appendTo(dc[a9]);dc[cY].appendTo(dc[b7]);},buildEventsTable:function(dc,dg){var dp=this;var dh=dp.get(a6);var dl=dp.get("displayRows");var dq=dp.get(cy);var dn=au.clearTime(dp._findCurrentIntervalEnd());var dk=au.clearTime(dp._findCurrentIntervalStart());var dj=String(dk.getTime()).concat(dc.getTime()).concat(dg.getTime());var di=dp.evtDataTableStack[dj];if(!di){di=cE.Node.create(bA);var dm=di.one(bT);var de=cE.Node.create(cQ);dp.loopDates(dc,dg,function(ds,dr){var dt=cE.Node.create(bt);dt.addClass(bS).toggleClass(b3,(dr===0)).toggleClass(bD,au.isToday(ds)).toggleClass(c0,au.isToday(au.subtract(ds,au.DAY,1))).toggleClass(cv,au.isToday(au.subtract(ds,au.WEEK,1)));de.append(dt.setContent(ds.getDate()));});dm.append(de);var A;for(A=0;A<dl;A++){var df=0;var dd=cE.Node.create(cQ);dp.loopDates(dc,dg,function(dC,dx){if(df<=dx){var dD=dp.getIntersectEvents(dC),dA=dD[A];var du=cE.Node.create(bt);if(dA&&dq.apply(dp,[dA])){var ds=dA.get(cI);var dy=!au.isDayOverlap(ds,dC);var dz=au.after(dC,ds)&&!au.isDayOverlap(dC,dc);if(dy||dz){var dt=dA.get(db);var dv=au.getFirstDayOfWeek(new Date(Math.max(ds,dk)));var dB=Math.floor(au.getDayOffset(dC,dv)/aT);if(dt.size()<=dB){dA.addPaddingNode();}var dw=dt.item(dB);dw.setStyles({height:"auto",left:0,top:0,width:"auto"});dA.syncNodeUI();var dr=du.one(Z);dw.appendTo(dr);var dE=dp._getEvtSplitInfo(dA,dC,dc,dg);du.attr(Y,dE.colspan);dr.addClass(aD);if(dE.left){dr.addClass(b).prepend(P);}if(dE.right){dr.addClass(aj).append(bn);}if(dA.get(cU)){dr.addClass(cG);}df+=dE.colspan;}else{df++;}}else{df++;}dd.append(du);}});dm.append(dd);}dp.evtDataTableStack[dj]=di;}return di;},flushViewCache:function(){var A=this;A.evtDateStack={};A.evtDataTableStack={};},getIntersectEvents:function(dc){var A=this;var df=A.get(r);var de=String(dc.getTime());if(!A.evtDateStack[de]){var dd=df.getIntersectEvents(dc);A.evtDateStack[de]=dd.filter(A.get(cy));}return A.evtDateStack[de];},getNextDate:function(){var A=this;var de=A.get(r);var dc=de.get(bw);var dd=A.get(a6);return au.add(dc,au.DAY,dd);},getPrevDate:function(){var A=this;var de=A.get(r);var dc=de.get(bw);var dd=A.get(a6);return au.subtract(dc,au.DAY,dd);},loopDates:function(A,de,dh,di,dg){var dj=this;var dc=au.clone(A);var dd=de.getTime(),df;for(df=0;dc.getTime()<=dd;df++){dh.apply(dj,[dc,df]);dc=au.add(dc,(di||au.DAY),(dg||1));}},plotEvents:function(){var dc=this;var df=dc._findCurrentIntervalStart();var A=au.safeClearTime(df);dc.flushViewCache();dc.bodyNode.all(cl+bh).remove();var dd=dc.get(a6);var de=Math.min(dd,aT);dc[cY].each(function(dj,dh){var dg=au.add(A,au.DAY,de*dh);var dk=au.add(dg,au.DAY,de-1);var di=dc.buildEventsTable(dg,dk);if(dh===0){di.addClass(ac);}dj.append(di);});},removeLasso:function(){var A=this;if(A.lasso){A.lasso.remove();}},renderLasso:function(di,dc){var dp=this;var df=di;var dh=dc;if(di[1]>dc[1]){df=dc;dh=di;}var dq=df[0],dk=df[1],dd=dh[0],A=dh[1];dp.removeLasso();dp.lasso=cE.NodeList.create();for(var de=dk;de<=A;de++){var dg=dp.gridCellHeight,dn=dp.gridCellWidth,dl=0,dj=(dg*de);if(de===dk){if(dk===A){dl+=Math.min(dq,dd)*dn;dn*=Math.abs(dd-dq)+1;}else{dl+=dq*dn;dn*=aT-dq;}}else{if(de===A){dn*=dd+1;}else{dn*=aT;}}var dm=cE.Node.create(bQ);dp.lasso.push(dm);dp[bN].append(dm);dm.sizeTo(dn,dg);dm.setXY(dp._offsetXY([dl,dj],1));}},syncDaysHeaderUI:function(){var dd=this;var dg=dd.get(r);var de=dg.get(bw);var dc=dd.get(bu);var A=dd.get(aC);var df=dd._findFirstDayOfWeek(de);dd.colHeaderDaysNode.all(Z).each(function(dj,di){var dh=au.add(df,au.DAY,di);var dk=cE.DataType.Date.format(dh,{format:dc,locale:A});dj.html(dk);});},syncGridUI:function(){var dl=this;var df=dl.getToday();var dc=dl.get(r);dl[aY].removeClass(aw);var de=dl._findCurrentIntervalStart();var dh=dl._findCurrentIntervalEnd();if(au.between(df,de,dh)){var A=dc.get(cK);var dj=dl._findFirstDayOfWeek(df);var dg=au.getWeekNumber(df,A)-au.getWeekNumber(de,A);var dk=(df.getDate()-dj.getDate());var dd=dl._getCellIndex([dk,dg]);var di=dl[aY].item(dd);if(di){di.addClass(aw);}}},syncStdContent:function(){var A=this;A.setStdModContent(cz.BODY,A[bN].getDOM());A.setStdModContent(cz.HEADER,A[c5].getDOM());},_findCurrentIntervalEnd:function(){var A=this;var de=A.get(r);var dc=de.get(bw);var dd=A.get(a6);return au.add(dc,au.DAY,dd);},_findCurrentIntervalStart:function(){var A=this;var dc=A.get(r);return dc.get(bw);},_findFirstDayOfWeek:function(dd){var A=this;var de=A.get(r);var dc=de.get(cK);return au.getFirstDayOfWeek(dd,dc);},_getCellIndex:function(dc){var A=this;return dc[1]*aT+dc[0];},_getEvtLabel:function(dd){var dc=this;var de=dd.get(aF);var A=dd.get(cI);
return[A.getHours(),cf,de.getHours(),W,dd.get(aU)].join(ca);},_getEvtSplitInfo:function(dg,dj,A,de){var dh=this;var dc=dg.getClearStartDate();var df=dg.getClearEndDate();var di=au.getDayOffset(de,dj);var dd={colspan:Math.min(au.getDayOffset(df,dj),di)+1,left:au.before(dc,A),right:au.after(df,de)};return dd;},_getPositionDate:function(dd){var dc=this;var de=dc._findCurrentIntervalStart();var A=au.safeClearTime(dc._findFirstDayOfWeek(de));return au.add(A,au.DAY,dc._getCellIndex(dd));},_getTableGridNode:function(dh){var dc=this;var de=dc.get(a6);var A=dc[B].item(dh);var dg=A.one(c6);for(var dd=0;dd<Math.min(de,aT);dd++){var df=cE.Node.create(ck);dg.append(df);dc[aY].push(df);}return A;},_offsetXY:function(de,dd){var A=this;var dc=A[bN].getXY();return[de[0]+dc[0]*dd,de[1]+dc[1]*dd];},_onMouseDownGrid:function(dg){var A=this;var dh=dg.target;if(dh.test([cl+q,cl+cx].join(bH))){A._recording=true;var de=A.get(a6);var dc=Math.ceil(de/aT);var df=Math.min(de,aT);A.gridCellHeight=A[bN].get(cA)/dc;A.gridCellWidth=A[bN].get(cC)/df;var dd=A._offsetXY([dg.pageX,dg.pageY],-1);A.lassoStartPosition=A.lassoLastPosition=A._findPosition(dd);A.renderLasso(A.lassoStartPosition,A.lassoLastPosition);A[bN].unselectable();}},_onMouseMoveGrid:function(df){var dc=this;var dg=df.currentTarget;var dd=dc._offsetXY([df.pageX,df.pageY],-1);var de=dc.lassoLastPosition||dc.lassoStartPosition;var A=dc._findPosition(dd);var dh=de&&((A[0]!==de[0])||(A[1]!==de[1]));if(dh&&dc._recording){dc.lassoLastPosition=A;dc.renderLasso(dc.lassoStartPosition,A);}},_onMouseUpGrid:function(dh){var dc=this;var dg=dc.get(r);var de=dg.get(c9);if(de&&dc._recording&&!dg.get(cc)){var df=dc._getPositionDate(dc.lassoStartPosition);var dd=dc._getPositionDate(dc.lassoLastPosition);var A=new Date(Math.min(df,dd));A.setHours(0,0,0);var di=new Date(Math.max(df,dd));di.setHours(23,59,59);de.set(O,true);de.set(aF,di);de.set(cI,A);de.showOverlay([dh.pageX,dh.pageY]);dc._recording=false;}},_findPosition:function(de){var A=this;var dd=Math.floor(de[0]/A.gridCellWidth);var dc=Math.floor(de[1]/A.gridCellHeight);return[dd,dc];},_uiSetCurrentDate:function(dc){var A=this;A.syncDaysHeaderUI();A.syncGridUI();},_valueColHeaderDaysNode:function(){var A=this;var dc=A.get(a6);var dd=Math.min(dc,aT);return A._valueNodeList(dd,f);},_valueTableGridNode:function(){var A=this;var dc=A.get(a6);var dd=Math.min(dc,aT);return A._valueNodeList(dd,a8);},_valueNodeList:function(de,dd){var A=this;var dc=[];while(de--){dc.push(dd);}return cE.NodeList.create(dc.join(ca));}}});cE.SchedulerTableView=ba;var bg=E(cZ,a4,bY,ak,an);var aE=cE.Component.create({NAME:cZ,ATTRS:{displayDaysInterval:{readOnly:true,value:42},name:{value:b6}},EXTENDS:cE.SchedulerTableView,prototype:{getNextDate:function(){var A=this;var dd=A.get(r);var dc=dd.get(bw);return au.add(dc,au.MONTH,1);},getPrevDate:function(){var A=this;var dd=A.get(r);var dc=dd.get(bw);return au.subtract(dc,au.MONTH,1);},plotEvents:function(){var A=this;cE.SchedulerMonthView.superclass.plotEvents.apply(A,arguments);var dd=A.get(r);var dc=dd.get(bw);var dg=au.findMonthEnd(dc);var df=au.findMonthStart(dc);var de=A._findCurrentIntervalStart();var dh=A[b7].all(cl+bS);dh.each(function(dk,di){var dj=au.add(de,au.DAY,di);if(au.before(dj,df)||au.after(dj,dg)){dk.addClass(bg);}});},_findCurrentIntervalStart:function(){var A=this;var de=A.get(r);var dc=de.get(bw);var dd=au.findMonthStart(dc);return A._findFirstDayOfWeek(dd);},_findFirstDayOfWeek:function(dd){var A=this;var de=A.get(r);var dc=de.get(cK);return au.getFirstDayOfWeek(dd,dc);}}});cE.SchedulerMonthView=aE;},"@VERSION@",{skinnable:true,requires:["aui-scheduler-event","aui-calendar","aui-button-item","dd-drag","dd-delegate","dd-drop","dd-constrain"]});