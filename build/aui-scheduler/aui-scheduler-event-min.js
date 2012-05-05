AUI.add("aui-scheduler-event",function(aK){var an=aK.Lang,bj=an.isString,f=an.isDate,a9=an.isFunction,G=an.isObject,bc=an.isBoolean,ad=an.isNumber,aY=aK.ColorUtil,j=aK.DataType.DateMath,a5=aK.cached(function(A){return A.substring(0,1).toUpperCase()+A.substring(1);}),be="-",t="&ndash;",ay=".",p="",q=" ",l="_",aM="_propagateSet",P="activeView",S="borderColor",aO="borderColorRGB",aI="borderStyle",bq="borderWidth",I="Change",a3="color",aW="colorBrightnessFactor",bd="colorSaturationFactor",aG="content",w="disabled",a0="duration",aP="endDate",aS="eventClass",aq="eventStack",bk="events",au="hidden",H="hsbColor",at="icon",aa="icons",a1="id",aX="isoTime",bp="locale",aZ="never",n="node",h="overlay",aL="parentEvent",bv="recorder",aN="repeat",bi="repeated",O="repeatedEvents",bb="repeater",ag="scheduler",av="scheduler-event",ax="scheduler-event-recorder",bm="startDate",a7="template",aV="title",e="titleDateFormat",ao="visible",d="%H:%M",a6="%I:%M",E=aK.getClassName,k=E(at),s=E(av),aQ=E(av,aG),C=E(av,au),bg=E(av,w),ap=E(av,bv),aB=E(av,bi),am=E(av,bb),D=E(av,aV),bo=E(av,aa),v=E(av,at,w),b=E(av,at,bi),bs=E(av,at,bb);var U=aK.Component.create({NAME:av,ATTRS:{borderStyle:{value:"solid",validator:bj},borderWidth:{value:"1px",validator:bj},colorBrightnessFactor:{value:0.75,validator:ad},colorSaturationFactor:{value:1.5,validator:ad},content:{value:"(no title)",validator:bj},color:{lazyAdd:false,setter:"_setColor",value:"#D96666",validator:bj},titleDateFormat:{getter:"_getTitleDateFormat",validator:bj},endDate:{setter:"_setDate",valueFn:function(){var A=j.clone(this.get(bm));A.setHours(A.getHours()+1);return A;}},eventClass:{valueFn:function(){return aK.SchedulerEvent;}},disabled:{value:false,validator:bc},node:{valueFn:function(){return aK.NodeList.create(aK.Node.create(this.EVENT_NODE_TEMPLATE).setData(av,this));}},parentEvent:{},repeat:{value:p,setter:"_setRepeat"},scheduler:{lazyAdd:false,setter:"_setScheduler"},startDate:{setter:"_setDate",valueFn:function(){return new Date();}},visible:{value:true,validator:bc}},EXTENDS:aK.Base,PROPAGATE_ATTRS:[bm,aP,aG,a3,aW,bd,aI,bq,e,ao,w],prototype:{EVENT_NODE_TEMPLATE:'<div class="'+s+'">'+'<div class="'+D+'"></div>'+'<div class="'+aQ+'"></div>'+'<div class="'+bo+'">'+'<span class="'+[k,b].join(q)+'"></span>'+'<span class="'+[k,bs].join(q)+'"></span>'+'<span class="'+[k,v].join(q)+'"></span>'+"</div>"+"</div>",eventStack:null,initializer:function(){var A=this;var L=A.get(n);A[aq]={};aK.Array.each(A.get(aS).PROPAGATE_ATTRS,function(X){A.after(X+I,A._propagateAttrChange);});A._bindUIAttrs();A.syncNodeUI(true);},destroy:function(){var A=this;A.eachRepeatedEvent(function(L,X){L.destroy();});A[aq]={};A.get(n).remove(true);},addPaddingNode:function(){var A=this;A.get(n).push(aK.Node.create(A.EVENT_NODE_TEMPLATE).setData(av,A));A.syncNodeUI();},copyDates:function(L){var A=this;A.set(aP,j.clone(L.get(aP)));A.set(bm,j.clone(L.get(bm)));},copyPropagateAttrValues:function(L,X){var A=this;A.copyDates(L);aK.Array.each(A.get(aS).PROPAGATE_ATTRS,function(Y){if(!((X||{}).hasOwnProperty(Y))){var bA=L.get(Y);if(!G(bA)){A.set(Y,bA);}}});},getBorderColor:function(){var A=this;return A[aO].hex;},getDaysDuration:function(){var A=this;return j.getDayOffset(A.get(aP),A.get(bm));},getHoursDuration:function(){var A=this;return j.getHoursOffset(A.get(aP),A.get(bm));},getMinutesDuration:function(){var A=this;return j.getMinutesOffset(A.get(aP),A.get(bm));},getSecondsDuration:function(){var A=this;return j.getSecondsOffset(A.get(aP),A.get(bm));},sameEndDate:function(L){var A=this;return j.compare(A.get(aP),L.get(aP));},sameStartDate:function(L){var A=this;return j.compare(A.get(bm),L.get(bm));},isAfter:function(Y){var X=this;var L=X.get(bm);var A=Y.get(bm);return j.after(L,A);},isBefore:function(Y){var X=this;var L=X.get(bm);var A=Y.get(bm);return j.before(L,A);},repeatByDate:function(X){var L=this;var Y=L.uidByDate(X);if(!L[aq][Y]){var A=j.clone(X);var bB=j.clone(X);j.copyHours(A,L.get(bm));j.copyHours(bB,L.get(aP));var bA=new L.get(aS)({endDate:bB,parentEvent:L,scheduler:L.get(ag),startDate:A});bA.copyPropagateAttrValues(L);L[aq][Y]=bA;}return L[aq][Y];},intersects:function(Y){var X=this;var bA=X.get(aP);var L=X.get(bm);var A=Y.get(bm);return(X.sameStartDate(Y)||j.between(A,L,bA));},intersectHours:function(X){var L=this;var bA=L.get(aP);var A=L.get(bm);var Y=j.clone(A);j.copyHours(Y,X.get(bm));return(j.compare(A,Y)||j.between(Y,A,bA));},isDayBoundaryEvent:function(){var A=this;return j.isDayBoundary(A.get(bm),A.get(aP));},isDayOverlapEvent:function(){var A=this;return j.isDayOverlap(A.get(bm),A.get(aP));},isRepeatableDate:function(L){var A=this;var X=A.get(aN);return(X&&X.validate(A,L));},getClearEndDate:function(){var A=this;return j.safeClearTime(A.get(aP));},getClearStartDate:function(){var A=this;return j.safeClearTime(A.get(bm));},move:function(L){var A=this;var X=A.getMinutesDuration();A.set(bm,L);A.set(aP,j.add(j.clone(L),j.MINUTES,X));},uidByDate:function(L){var A=this;L=f(L)?j.safeClearTime(L):A.getClearStartDate();return[av,L.getTime()].join(l);},setContent:function(X,L){var A=this;A.get(n).each(function(bA){var Y=bA.one(g+aQ);Y.setContent(X);});if(L){A.eachRepeatedEvent(function(Y,bA){Y.setContent(X);});}},setTitle:function(X,L){var A=this;A.get(n).each(function(Y){var bA=Y.one(g+D);bA.setContent(X);});if(L){A.eachRepeatedEvent(function(Y,bA){Y.setTitle(X);});}},syncNodeUI:function(L){var A=this;A._syncUIAttrs();A.syncNodeColorUI(L);A.syncNodeTitleUI(L);A.syncNodeContentUI(L);},syncNodeColorUI:function(L){var A=this;var Y=A.get(n);var bA=A.getBorderColor();if(Y){var X={borderWidth:A.get(bq),borderColor:bA,backgroundColor:A.get(a3),borderStyle:A.get(aI)};Y.setStyles(X);}if(L){A.eachRepeatedEvent(function(bB,bC){bB.syncNodeColorUI();});}},syncNodeContentUI:function(L){var A=this;A.setContent(A.get(aG),L);},syncNodeTitleUI:function(L){var A=this;var Y=A._formatDate(A.get(bm));var X=A._formatDate(A.get(aP));A.setTitle([Y,X].join(q+t+q),L);},split:function(){var A=this,X=j.clone(A.get(bm)),Y=j.clone(A.get(aP));
if(A.isDayOverlapEvent()&&!A.isDayBoundaryEvent()){var L=j.clone(X);L.setHours(24,0,0,0);return[[X,j.toMidnight(j.clone(X))],[L,j.clone(Y)]];}return[[X,Y]];},eachRepeatedEvent:function(L){var A=this;aK.each(A[aq],L,A);},unlink:function(){var A=this;if(A.get(aL)){A.set(aL,null);}else{A.eachRepeatedEvent(function(L,X){L.unlink();});}A[aq]={};A.syncNodeUI();},_afterDisabledChange:function(L){var A=this;A._uiSetDisabled(L.newVal);},_afterVisibleChange:function(L){var A=this;A._uiSetVisible(L.newVal);},_afterRepeatChange:function(L){var A=this;A._uiSetRepeat(L.newVal);},_afterParentEventChange:function(L){var A=this;A._uiSetParentEvent(L.newVal);},_bindUIAttrs:function(){var A=this;A.after({disabledChange:A._afterDisabledChange,visibleChange:A._afterVisibleChange,parentEventChange:A._afterParentEventChange,repeatChange:A._afterRepeatChange});A._syncUIAttrs();},_propagateAttrChange:function(Y){var A=this;var X=Y.attrName;var L=Y.newVal;A.eachRepeatedEvent(function(bA,bB){var bC=bA[aM+a5(X)];if(bC){bC.apply(A,[bA,X,L]);}else{bA.set(X,Y.newVal);}bA.syncNodeUI();});A.syncNodeUI();},_propagateSetEndDate:function(A,L,Y){var X=j.clone(A.get(aP));j.copyHours(X,Y);A.set(aP,X);},_propagateSetStartDate:function(L,X,Y){var A=j.clone(L.get(bm));j.copyHours(A,Y);L.set(bm,A);},_setColor:function(L){var A=this;A[H]=aY.rgb2hsb(aY.getRGB(L));A[S]=aK.clone(A[H]);A[S].b*=A.get(aW);A[S].s*=A.get(bd);A[aO]=aY.hsb2rgb(A[S]);return L;},_setDate:function(L){var A=this;if(ad(L)){L=new Date(L);}return L;},_setRepeat:function(L){var A=this;if(bj(L)){L=aK.SchedulerEventRepeat[L];}return G(L)?L:null;},_setScheduler:function(X){var A=this;var L=A.get(ag);if(L){A.removeTarget(L);}A.addTarget(X);return X;},_syncUIAttrs:function(){var A=this;A._uiSetDisabled(A.get(w));A._uiSetVisible(A.get(ao));A._uiSetParentEvent(A.get(aL));A._uiSetRepeat(A.get(aN));},_formatDate:function(X,Y){var L=this;var A=L.get(bp);Y=Y||L.get(e);return aK.DataType.Date.format(X,{format:Y,locale:A});},_getTitleDateFormat:function(X){var A=this;if(!bj(X)){var L=A.get(ag);X=(L&&L.get(P).get(aX))?d:a6;}return X;},_uiSetDisabled:function(L){var A=this;A.get(n).toggleClass(bg,!!L);},_uiSetParentEvent:function(L){var A=this;A.get(n).toggleClass(aB,!!L);},_uiSetRepeat:function(X){var A=this;var L=!!X&&X!==aK.SchedulerEventRepeat[aZ];A.get(n).toggleClass(am,L);},_uiSetVisible:function(L){var A=this;A.get(n).toggleClass(C,!L);}}});aK.SchedulerEvent=U;aK.SchedulerEventRepeat={never:{description:"Never repeat",validate:function(A,L){return false;},value:"never"},daily:{description:"Every day",validate:function(A,L){return true;},value:"daily"},monthly:{description:"Every month",validate:function(L,X){var Y=L.get(aP);var A=L.get(bm);return(A.getDate()===X.getDate());},value:"monthly"},monWedFri:{description:"Every Monday, Wednesday and Friday",validate:function(A,L){return j.isMonWedOrFri(L);},value:"monWedFri"},tuesThurs:{description:"Every Tuesday and Thursday",validate:function(A,L){return j.isTueOrThu(L);},value:"tuesThurs"},weekDays:{description:"Every week days",validate:function(A,L){return j.isWeekDay(L);},value:"weekDays"},weekly:{description:"Every week",validate:function(L,X){var Y=L.get(aP);var A=L.get(bm);return(A.getDay()===X.getDay());},value:"weekly"},yearly:{description:"Every year",validate:function(L,X){var Y=L.get(aP);var A=L.get(bm);return((A.getMonth()===X.getMonth())&&(A.getDay()===X.getDay()));},value:"yearly"}};var aw=aK.Lang,a=aw.isArray,G=aw.isObject,P="activeView",c="arrow",aU="body",aA="bodyContent",o="boundingBox",az="cancel",a2="click",aG="content",aT="date",aH="dateFormat",aj="delete",ba="description",Q="edit",bu="event",aS="eventClass",B="footerContent",aE="form",z="header",u="hide",aX="isoTime",aF="link",n="node",N="offsetHeight",bh="offsetWidth",h="overlay",R="overlayOffset",bv="recorder",br="rendered",aN="repeat",a4="save",ag="scheduler",m="schedulerChange",av="scheduler-event",ax="scheduler-event-recorder",aD="shadow",aC="show",F="startDateChange",M="strings",a7="template",aV="title",bt="tl",ac="toolbar",bl="submit",bn="value",aR="visibleChange",Z="when",al="x",ak="y",af="cancel",K="delete",y="edit",aJ="save",bw="-",g=".",ae="",i="#",r=aK.IO.prototype._serialize,E=aK.getClassName,s=E(ag,bu),ap=E(ag,bu,bv),bx=E(ag,bu,bv,h),x=E(ag,bu,bv,h,c),bf=E(ag,bu,bv,h,c,aD),ai=E(ag,bu,bv,h,aU),a8=E(ag,bu,bv,h,aG),ah=E(ag,bu,bv,h,aT),T=E(ag,bu,bv,h,aE),bz=E(ag,bu,bv,h,z),V=E(ag,bu,bv,h,aF),ar=E(ag,bu,bv,h,aN),D=E(ag,bu,aV),J=new aK.Template('<div class="',bf," ",x,'"></div>','<div class="',x,'"></div>','<input type="hidden" name="startDate" value="{startDate}" />','<input type="hidden" name="endDate" value="{endDate}" />','<div class="',bz,'">','<input class="',a8,'" name="content" value="{content}" />',"</div>",'<div class="',ai,'">','<label class="',ah,'">{date}</label>','<select class="',ar,'" name="repeat">','<tpl for="eventRepeat">','<option {[ (parent.repeat && parent.repeat.value) == parent.eventRepeat[$i].value ? \'selected="selected"\' : "" ]} value="{value}">{description}</option>',"</tpl>","</select>","</div>"),ab='<a class="'+V+'" href="javascript:;">{delete}</a>',by='<form class="'+T+'" id="schedulerEventRecorderForm"></form>';var W=aK.Component.create({NAME:ax,ATTRS:{content:{value:ae},duration:{value:60},dateFormat:{validator:bj,value:"%a, %B %d,"},event:{},eventClass:{valueFn:function(){return aK.SchedulerEvent;}},strings:{value:{},setter:function(A){return aK.merge({"delete":"Delete","description-hint":"e.g., Dinner at Brian's","no-repeat":"No repeat",cancel:"Cancel",description:"Description",edit:"Edit",repeat:"Repeat",save:"Save",when:"When"},A||{});},validator:G},overlay:{validator:G,value:{align:{points:[bt,bt]},visible:false,width:300,zIndex:500}},overlayOffset:{value:[15,-38],validator:a},template:{value:J},toolbar:{setter:function(X){var L=this;var A=L.get(M);return aK.merge({children:[{handler:aK.bind(L._handleSaveEvent,L),label:A[a4]},{handler:aK.bind(L._handleCancelEvent,L),label:A[az]}]},X||{});},validator:G,value:{}}},EXTENDS:aK.SchedulerEvent,prototype:{initializer:function(){var A=this;
A.get(n).addClass(ap);A.publish(af,{defaultFn:A._defCancelEventFn});A.publish(K,{defaultFn:A._defDeleteEventFn});A.publish(y,{defaultFn:A._defEditEventFn});A.publish(aJ,{defaultFn:A._defSaveEventFn});A.after(m,A._afterSchedulerChange);A[h]=new aK.Overlay(A.get(h));A[ac]=new aK.Toolbar(A.get(ac));},_afterSchedulerChange:function(Y){var A=this;var X=Y.newVal;var L=X.get(o);L.delegate(a2,aK.bind(A._onClickSchedulerEvent,A),g+s);},_defCancelEventFn:function(L){var A=this;A.get(n).remove();A.hideOverlay();},_defDeleteEventFn:function(X){var A=this;var L=A.get(ag);L.removeEvent(A.get(bu));A.hideOverlay();L.syncEventsUI();},_defEditEventFn:function(X){var A=this;var L=A.get(ag);A.hideOverlay();L.syncEventsUI();},_defSaveEventFn:function(X){var A=this;var L=A.get(ag);L.addEvent(X.newSchedulerEvent);A.hideOverlay();L.syncEventsUI();},_handleCancelEvent:function(L){var A=this;A.fire(af);L.preventDefault();},_handleSaveEvent:function(L){var A=this;A.fire(A.get(bu)?y:aJ,{newSchedulerEvent:A.getEventCopy()});L.preventDefault();},_onClickDelete:function(){var A=this;A.fire(K,{schedulerEvent:A.get(bu)});},_onClickSchedulerEvent:function(X){var A=this;var L=X.currentTarget.getData(av);if(L){A.set(bu,L);A.showOverlay([X.pageX,X.pageY]);A.get(n).remove();}},_onOverlayVisibleChange:function(Y){var L=this;if(Y.newVal){L.populateForm();if(!L.get(bu)){var X=L[h].get(o);var A=X.one(g+a8);setTimeout(function(){A.selectText();},0);L.deleteNode.hide();}else{L.deleteNode.show();}}else{L.set(bu,null);L.get(n).remove();}},_onSubmitForm:function(L){var A=this;A._handleSaveEvent(L);},_renderOverlay:function(){var L=this;var A=L.get(M);L[h].render();L[ac].render();var X=L[h].get(o);X.addClass(bx);L[h].set(B,L[ac].get(o));L[h].on(aR,aK.bind(L._onOverlayVisibleChange,L));L.deleteNode=aK.Node.create(aw.sub(ab,{"delete":A[aj]}));L[h].footerNode.append(L.deleteNode);L.formNode=aK.Node.create(by);L[h].set(aA,L.formNode);L.deleteNode.on(a2,aK.bind(L._onClickDelete,L));L.formNode.on(bl,aK.bind(L._onSubmitForm,L));},getEventCopy:function(){var A=this;var X=A.get(bu);if(!X){X=new (A.get(aS))({endDate:A.get(aP),scheduler:A.get(ag),startDate:A.get(bm)});X.copyPropagateAttrValues(A,{content:true});}var L=A.serializeForm();X.set(aG,L[aG]);X.set(aN,L[aN]);return X;},getFormattedDate:function(){var X=this;var L=X.get(aH);var bA=(X.get(bu)||X);var bC=bA.get(aP);var bB=bA.get(ag);var A=bA.get(bm);var Y=(bB.get(P).get(aX)?j.toIsoTimeString:j.toUsTimeString);return[bA._formatDate(A,L),Y(A),be,Y(bC)].join(q);},getTemplateData:function(){var L=this;var A=L.get(M);var X=(L.get(bu)||L);return{content:X.get(aG)||A["description-hint"],date:L.getFormattedDate(),endDate:X.get(aP).getTime(),eventRepeat:L.eventRepeatArray,repeat:X.get(aN),startDate:X.get(bm).getTime()};},hideOverlay:function(){var A=this;A[h].hide();},populateForm:function(){var A=this;if(!A.eventRepeatArray){A.eventRepeatArray=[];aK.each(aK.SchedulerEventRepeat,function(L){A.eventRepeatArray.push({description:L[ba],value:L[bn]});});}A.formNode.setContent(A.get(a7).parse(A.getTemplateData()));},serializeForm:function(){var A=this;return aK.QueryString.parse(r(A.formNode.getDOM()));},showOverlay:function(Y,bB){var A=this;var X=A.get(R);if(!A[h].get(br)){A._renderOverlay();}A[h].show();if(!Y){var L=(A.get(bu)||A).get(n);var bA=L.one(g+D);bB=[X[0]+bA.get(bh),X[1]+bA.get(N)/2];Y=bA.getXY();}bB=bB||X;Y[0]+=bB[0];Y[1]+=bB[1];A[h].set("xy",Y);}}});aK.SchedulerEventRecorder=W;},"@VERSION@",{skinnable:true,requires:["aui-base","aui-color-util","aui-datatype","aui-template","aui-toolbar","io-form","querystring","overlay"]});