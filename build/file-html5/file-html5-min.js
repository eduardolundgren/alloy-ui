/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("file-html5",function(e){var c=e.Lang,d=e.bind,b=e.config.win;var a=function(g){var f=null;if(a.isValidFile(g)){f=g;}else{if(a.isValidFile(g.file)){f=g.file;}else{f=false;}}a.superclass.constructor.apply(this,arguments);if(f&&a.canUpload()){if(!this.get("file")){this._set("file",f);}if(!this.get("name")){this._set("name",f.name||f.fileName);}if(this.get("size")!=(f.size||f.fileSize)){this._set("size",f.size||f.fileSize);}if(!this.get("type")){this._set("type",f.type);}if(f.hasOwnProperty("lastModifiedDate")&&!this.get("dateModified")){this._set("dateModified",f.lastModifiedDate);}}};e.extend(a,e.Base,{initializer:function(f){if(!this.get("id")){this._set("id",e.guid("file"));}},_uploadEventHandler:function(g){var i=this.get("xhr");switch(g.type){case"progress":this.fire("uploadprogress",{originEvent:g,bytesLoaded:g.loaded,bytesTotal:this.get("size"),percentLoaded:Math.min(100,Math.round(10000*g.loaded/this.get("size"))/100)});this._set("bytesUploaded",g.loaded);break;case"load":if(i.status>=200&&i.status<=299){this.fire("uploadcomplete",{originEvent:g,data:g.target.responseText});var h=i.upload,f=this.get("boundEventHandler");h.removeEventListener("progress",f);h.removeEventListener("error",f);h.removeEventListener("abort",f);i.removeEventListener("load",f);i.removeEventListener("error",f);i.removeEventListener("readystatechange",f);this._set("xhr",null);}else{this.fire("uploaderror",{originEvent:g,status:i.status,statusText:i.statusText,source:"http"});}break;case"error":this.fire("uploaderror",{originEvent:g,status:i.status,statusText:i.statusText,source:"io"});break;case"abort":this.fire("uploadcancel",{originEvent:g});break;case"readystatechange":this.fire("readystatechange",{readyState:g.target.readyState,originEvent:g});break;}},startUpload:function(h,i,m){this._set("bytesUploaded",0);this._set("xhr",new XMLHttpRequest());this._set("boundEventHandler",d(this._uploadEventHandler,this));var k=new FormData(),f=m||"Filedata",l=this.get("xhr"),j=this.get("xhr").upload,g=this.get("boundEventHandler");e.each(i,function(o,n){k.append(n,o);});k.append(f,this.get("file"));l.addEventListener("loadstart",g,false);j.addEventListener("progress",g,false);l.addEventListener("load",g,false);l.addEventListener("error",g,false);j.addEventListener("error",g,false);j.addEventListener("abort",g,false);l.addEventListener("abort",g,false);l.addEventListener("loadend",g,false);l.addEventListener("readystatechange",g,false);l.open("POST",h,true);l.withCredentials=this.get("xhrWithCredentials");e.each(this.get("xhrHeaders"),function(o,n){l.setRequestHeader(n,o);});l.send(k);this.fire("uploadstart",{xhr:l});},cancelUpload:function(){this.get("xhr").abort();}},{NAME:"file",TYPE:"html5",ATTRS:{id:{writeOnce:"initOnly",value:null},size:{writeOnce:"initOnly",value:0},name:{writeOnce:"initOnly",value:null},dateCreated:{writeOnce:"initOnly",value:null},dateModified:{writeOnce:"initOnly",value:null},bytesUploaded:{readOnly:true,value:0},type:{writeOnce:"initOnly",value:null},file:{writeOnce:"initOnly",value:null},xhr:{readOnly:true,value:null},xhrHeaders:{value:{}},xhrWithCredentials:{value:true},boundEventHandler:{readOnly:true,value:null}},isValidFile:function(f){return(b&&b.File&&f instanceof File);},canUpload:function(){return(b&&b.FormData&&b.XMLHttpRequest);}});e.FileHTML5=a;},"3.6.0pr1",{requires:["base"]});