/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.5.0
build: nightly
*/
YUI.add("dom-create",function(a){var c=/<([a-z]+)/i,d=a.DOM,i=a.Features.add,g=a.Features.test,f={},e=function(m,k){var n=a.config.doc.createElement("div"),l=true;n.innerHTML=m;if(!n.firstChild||n.firstChild.tagName!==k.toUpperCase()){l=false;}return l;},j=/(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,b="<table>",h="</table>";a.mix(a.DOM,{_fragClones:{},_create:function(l,m,k){k=k||"div";var n=d._fragClones[k];if(n){n=n.cloneNode(false);}else{n=d._fragClones[k]=m.createElement(k);}n.innerHTML=l;return n;},create:function(p,s){if(typeof p==="string"){p=a.Lang.trim(p);}s=s||a.config.doc;var o=c.exec(p),q=d._create,l=f,r=null,n,t,k;if(p!=undefined){if(o&&o[1]){n=l[o[1].toLowerCase()];if(typeof n==="function"){q=n;}else{t=n;}}k=q(p,s,t).childNodes;if(k.length===1){r=k[0].parentNode.removeChild(k[0]);}else{if(k[0]&&k[0].className==="yui3-big-dummy"){if(k.length===2){r=k[0].nextSibling;}else{k[0].parentNode.removeChild(k[0]);r=d._nl2frag(k,s);}}else{r=d._nl2frag(k,s);}}}return r;},_nl2frag:function(l,o){var m=null,n,k;if(l&&(l.push||l.item)&&l[0]){o=o||l[0].ownerDocument;m=o.createDocumentFragment();if(l.item){l=a.Array(l,0,true);}for(n=0,k=l.length;n<k;n++){m.appendChild(l[n]);}}return m;},addHTML:function(r,q,m){var k=r.parentNode,o=0,p,l=q,n;if(q!=undefined){if(q.nodeType){n=q;}else{if(typeof q=="string"||typeof q=="number"){l=n=d.create(q);}else{if(q[0]&&q[0].nodeType){n=a.config.doc.createDocumentFragment();while((p=q[o++])){n.appendChild(p);}}}}}if(m){if(m.nodeType){m.parentNode.insertBefore(n,m);}else{switch(m){case"replace":while(r.firstChild){r.removeChild(r.firstChild);}if(n){r.appendChild(n);}break;case"before":k.insertBefore(n,r);break;case"after":if(r.nextSibling){k.insertBefore(n,r.nextSibling);}else{k.appendChild(n);}break;default:r.appendChild(n);}}}else{if(n){r.appendChild(n);}}return l;}});i("innerhtml","table",{test:function(){var k=a.config.doc.createElement("table");try{k.innerHTML="<tbody></tbody>";}catch(l){return false;}return(k.firstChild&&k.firstChild.nodeName==="TBODY");}});i("innerhtml-div","tr",{test:function(){return e("<tr></tr>","tr");}});i("innerhtml-div","script",{test:function(){return e("<script><\/script>","script");}});if(!g("innerhtml","table")){f.tbody=function(l,m){var n=d.create(b+l+h,m),k=n.children.tags("tbody")[0];if(n.children.length>1&&k&&!j.test(l)){k.parentNode.removeChild(k);}return n;};}if(!g("innerhtml-div","script")){f.script=function(k,l){var m=l.createElement("div");m.innerHTML="-"+k;m.removeChild(m.firstChild);return m;};f.link=f.style=f.script;}if(!g("innerhtml-div","tr")){a.mix(f,{option:function(k,l){return d.create('<select><option class="yui3-big-dummy" selected></option>'+k+"</select>",l);},tr:function(k,l){return d.create("<tbody>"+k+"</tbody>",l);},td:function(k,l){return d.create("<tr>"+k+"</tr>",l);},col:function(k,l){return d.create("<colgroup>"+k+"</colgroup>",l);},tbody:"table"});a.mix(f,{legend:"fieldset",th:f.td,thead:f.tbody,tfoot:f.tbody,caption:f.tbody,colgroup:f.tbody,optgroup:f.option});}d.creators=f;},"3.5.0",{requires:["dom-core"]});