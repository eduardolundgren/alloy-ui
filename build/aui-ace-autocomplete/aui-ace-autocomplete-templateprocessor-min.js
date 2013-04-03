AUI.add("aui-ace-autocomplete-templateprocessor",function(b){var e=b.Lang,h=b.Object,d=b.AceEditor.AutoCompleteBase,a=0,c=1,g=".",i="host",f="",k="aui-ace-autocomplete-templateprocessor";var j=b.Component.create({NAME:k,NS:k,ATTRS:{directives:{validator:e.isArray},host:{validator:e.isObject},variables:{validator:e.isObject}},EXTENDS:b.Base,prototype:{getResults:function(m,r,q){var s=this;var p=m.type;if(p===a){var o=s.get("directives");var n=m.content.toLowerCase();if(n.length){var t=s.get(i);o=t._filterResults(n,o);}r(o);}else{if(p===c){var l=s._getVariableMatches(m.content);r(l);}}},getSuggestion:function(p,q){var m=this;var l=q||f;if(q){var o=m.get(i).get("fillMode");var r=p.type;var s;var n;if(o===d.FILL_MODE_INSERT){if(r===a){if(p.content&&q.indexOf(p.content)===0){l=q.substring(p.content.length);}}else{if(r===c){s=p.content.split(g);n=s[s.length-1];if(n&&q.indexOf(n)===0){l=q.substring(n.length);}}}}else{if(r===c){s=p.content.split(g);s[s.length-1]=q;l=s.join(g);}}}return l;},_getVariableMatches:function(p){var r=this;var s=p.split(g);var l=r.get("variables");var q=s[s.length-1];s.length-=1;var m;if(s.length>0){for(var n=0;n<s.length;n++){m=s[n];if(e.isObject(l)){l=l[m];}}}var o=[];q=q.toLowerCase();if(e.isObject(l)){var t=r.get(i);o=t._filterResults(q,h.keys(l));}return o;},_setRegexValue:function(m){var l=b.AttributeCore.INVALID_VALUE;if(e.isString(m)){l=new RegExp(m);}else{if(m instanceof RegExp){l=m;}}return l;}}});b.AceEditor.TemplateProcessor=j;},"@VERSION@",{requires:["aui-ace-autocomplete-base"]});