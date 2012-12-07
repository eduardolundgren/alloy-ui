AUI.add("aui-scheduler-view-week",function(h){var k=h.Lang,g=k.isFunction,n="",o="&mdash;",p=" ",i=h.DataType.DateMath,j=i.WEEK_LENGTH,b="scheduler-view-week",f="date",m="days",e="firstDayOfWeek",l="locale",q="scheduler",d="viewDate",a="week";var c=h.Component.create({NAME:b,ATTRS:{bodyContent:{value:n},days:{value:7},headerViewConfig:{value:{displayDaysInterval:j}},name:{value:a},navigationDateFormatter:{valueFn:function(){return this._valueNavigationDateFormatter;},validator:g}},EXTENDS:h.SchedulerDayView,prototype:{getAdjustedViewDate:function(u){var r=this;var t=r.get(q);var s=t.get(e);return i.toMidnight(i.getFirstDayOfWeek(u,s));},getNextDate:function(){var r=this;var s=r.get(q);var t=s.get(d);return i.toLastHour(i.add(t,i.WEEK,1));},getPrevDate:function(){var r=this;var s=r.get(q);var t=s.get(d);return i.toMidnight(i.subtract(t,i.WEEK,1));},getToday:function(){var r=this;var s=c.superclass.getToday.apply(this,arguments);return r._firstDayOfWeek(s);},_firstDayOfWeek:function(t){var r=this;var u=r.get(q);var s=u.get(e);return i.getFirstDayOfWeek(t,s);},_valueNavigationDateFormatter:function(u){var t=this;var v=t.get(q);var s=v.get(l);var r=t._firstDayOfWeek(u);var w=h.DataType.Date.format(r,{format:"%B %d",locale:s});var y=i.add(r,i.DAY,t.get(m)-1);var x=h.DataType.Date.format(y,{format:(i.isMonthOverlapWeek(u)?"%B %d":"%d")+", %Y",locale:s});return[w,o,x].join(p);}}});h.SchedulerWeekView=c;},"@VERSION@",{requires:["aui-scheduler-view-day"],skinnable:true});