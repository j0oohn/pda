var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)};define("Keyboard",["require","exports"],function(t,e){"use strict";var i;!function(t){t.keys={A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,ENTER:13,SHIFT:16,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,"+":61,"-":173}}(i=e.Keyboard||(e.Keyboard={}))}),define("interface/Renderer",["require","exports"],function(t,e){"use strict";var i=function(){function t(){}return t.prototype.bind=function(t){this.node=t,this.onBind()},t.prototype.render=function(){this.node&&this.onRender()},t.prototype.onBind=function(){},t}();e.Renderer=i}),define("languages/English",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={SELECT_LANGUAGE:"System Language",CHANGE_LANGUAGE:'Change the language to "%"?',FILE_MENUBAR:"File Manipulation",SAVE:"Save",OPEN:"Open",SELECT_MACHINE:"Machine Selection",FA:"Finite Automaton",PDA:"Pushdown Automaton",LBA:"Linearly Bounded Automaton",RECOGNITION:"Recognition",TEST_CASE:"test case"}}(i=e.english||(e.english={}))}),define("languages/Portuguese",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={SELECT_LANGUAGE:"Idioma do Sistema",CHANGE_LANGUAGE:'Mudar o idioma para "%"?',FILE_MENUBAR:"Manipulação de Arquivos",SAVE:"Salvar",OPEN:"Abrir",SELECT_MACHINE:"Seleção de Máquina",FA:"Autômato Finito",PDA:"Autômato de Pilha",LBA:"Autômato Linearmente Limitado",RECOGNITION:"Reconhecimento",TEST_CASE:"caso de teste"}}(i=e.portuguese||(e.portuguese={}))}),define("Utils",["require","exports","System"],function(t,e,i){"use strict";var n;!function(t){function e(t){return document.querySelector(t)}function n(t){return e("#"+t)}function r(t){return document.createElement(t)}function s(t,e){for(var i in t)t.hasOwnProperty(i)&&e(i,t[i])}function a(t){return"which"in t?3==t.which:"button"in t?2==t.button:(console.log("[WARNING] Right click events will not work properly in this browser."),!1)}function o(t,e,i,n){return"M"+t+" "+e+" L"+i+" "+n}function u(t,e,i,n,r){var s=t.path(this.linePath(e,i,n,r));return s.attr("stroke","black"),s}function c(t){return t*Math.PI/180}function l(t,e){i.System.addKeyObserver(t,e)}t.select=e,t.id=n,t.create=r,t.foreach=s,t.isRightClick=a,t.linePath=o,t.line=u,t.toRadians=c,t.bindShortcut=l}(n=e.utils||(e.utils={}))}),define("Initializer",["require","exports","interface/Menu","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(){function t(){}return t.exec=function(){this.initSidebars()},t.initSidebars=function(){this.initSidebarFA(),this.initSidebarPDA(),this.initSidebarLBA()},t.initSidebarFA=function(){var t=[],e=new i.Menu(n.Strings.RECOGNITION),s=r.utils.create("input");s.type="text",s.placeholder=n.Strings.TEST_CASE,e.add(s),t.push(e),n.Settings.machines[n.Settings.Machine.FA].sidebar=t},t.initSidebarPDA=function(){console.log("[INIT] PDA")},t.initSidebarLBA=function(){console.log("[INIT] LBA")},t}();e.Initializer=s}),define("Settings",["require","exports","languages/English","languages/Portuguese","Initializer","Utils"],function(t,e,i,n,r,s){"use strict";var a;!function(t){function a(){var e={};e[u.FA]={name:t.language.strings.FA,sidebar:[]},e[u.PDA]={name:t.language.strings.PDA,sidebar:[]},e[u.LBA]={name:t.language.strings.LBA,sidebar:[]},s.utils.foreach(e,function(e,i){t.machines[e]=i}),c=!1,r.Initializer.exec()}function o(i){t.language=i,e.Strings=t.language.strings,a()}t.sidebarID="sidebar",t.mainbarID="mainbar",t.slideInterval=300,t.machineSelRows=3,t.machineSelColumns=1,t.stateLabelFontFamily="sans-serif",t.stateLabelFontSize=20,t.stateRadius=32,t.stateRingRadius=27,t.stateDragTolerance=50,t.stateFillColor="white",t.stateStrokeColor="black",t.edgeArrowLength=30,t.edgeArrowAngle=30,t.shortcuts={save:["ctrl","S"],open:["ctrl","O"]},t.languages={English:i.english,Português:n.portuguese},function(t){t[t.FA=0]="FA",t[t.PDA=1]="PDA",t[t.LBA=2]="LBA"}(t.Machine||(t.Machine={}));var u=t.Machine;t.language=i.english,t.currentMachine=u.FA,t.machines={};var c=!0;t.update=a,t.changeLanguage=o}(a=e.Settings||(e.Settings={})),e.Strings=a.language.strings,a.update()}),define("interface/Menu",["require","exports","interface/Renderer","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(t){function e(e){t.call(this),this.body=null,this.toggled=!1,this.title=e,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.clear=function(){this.children=[]},e.prototype.onRender=function(){var t=this.node,e=r.utils.create("div");e.classList.add("menu");var i=r.utils.create("div");i.classList.add("title"),i.innerHTML=this.title,e.appendChild(i);var s=r.utils.create("div");s.classList.add("content");for(var a=0,o=this.children;a<o.length;a++){var u=o[a];s.appendChild(u)}e.appendChild(s),t.appendChild(e),i.addEventListener("click",function(){$(s).is(":animated")||$(s).slideToggle(n.Settings.slideInterval)}),this.body=e,this.toggled&&this.internalToggle()},e.prototype.toggle=function(){this.toggled=!this.toggled,this.body&&this.internalToggle()},e.prototype.html=function(){return this.body},e.prototype.internalToggle=function(){var t=this.body.querySelector(".content");$(t).toggle()},e}(i.Renderer);e.Menu=s}),define("interface/Table",["require","exports","interface/Renderer","Utils"],function(t,e,i,n){"use strict";var r=function(t){function e(e,i){t.call(this),this.numRows=e,this.numColumns=i,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.html=function(){for(var t=n.utils.create("table"),e=0,i=0;i<this.numRows;i++){for(var r=n.utils.create("tr"),s=0;s<this.numColumns;s++){var a=n.utils.create("td");e<this.children.length&&a.appendChild(this.children[e]),r.appendChild(a),e++}t.appendChild(r)}return t},e.prototype.onRender=function(){this.node.appendChild(this.html())},e}(i.Renderer);e.Table=r}),define("interface/Sidebar",["require","exports","interface/Menu","interface/Renderer","Settings","Settings","System","interface/Table","Utils"],function(t,e,i,n,r,s,a,o,u){"use strict";var c=function(t){function e(){t.call(this),this.build()}return __extends(e,t),e.prototype.build=function(){this.languageSelection=new i.Menu(s.Strings.SELECT_LANGUAGE),this.fileManipulation=new i.Menu(s.Strings.FILE_MENUBAR),this.machineSelection=new i.Menu(s.Strings.SELECT_MACHINE),this.otherMenus=[],this.buildLanguageSelection(),this.buildFileManipulation(),this.buildMachineSelection(),this.node&&this.onBind()},e.prototype.onBind=function(){this.languageSelection.bind(this.node),this.fileManipulation.bind(this.node),this.machineSelection.bind(this.node);for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.bind(this.node)}},e.prototype.onRender=function(){this.languageSelection.render(),this.fileManipulation.render(),this.machineSelection.render();for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.render()}},e.prototype.loadMachine=function(t){for(var e=0,i=this.otherMenus;e<i.length;e++){var n=i[e];$(n.html()).remove()}this.otherMenus=r.Settings.machines[t].sidebar;for(var s=0,a=this.otherMenus;s<a.length;s++){var n=a[s];n.bind(this.node)}},e.prototype.buildLanguageSelection=function(){var t=u.utils.create("select"),e=r.Settings.languages,i=0,n=-1;u.utils.foreach(e,function(e,s){var a=u.utils.create("option");a.value=e,a.innerHTML=e,t.appendChild(a),s==r.Settings.language&&(n=i),i++}),t.selectedIndex=n,this.languageSelection.clear(),this.languageSelection.add(t),this.languageSelection.toggle(),t.addEventListener("change",function(){var t=this.options[this.selectedIndex].value,i=confirm(s.Strings.CHANGE_LANGUAGE.replace("%",t));i&&a.System.changeLanguage(e[t])})},e.prototype.buildFileManipulation=function(){this.fileManipulation.clear();var t=u.utils.create("input");t.classList.add("file_manip_btn"),t.type="button",t.value=s.Strings.SAVE,t.addEventListener("click",function(){var t="Hello, world!",e=new Blob([t],{type:"text/plain; charset=utf-8"});saveAs(e,"file.txt")}),u.utils.bindShortcut(r.Settings.shortcuts.save,function(){t.click()}),this.fileManipulation.add(t);var e=u.utils.create("input");e.classList.add("file_manip_btn"),e.type="button",e.value=s.Strings.OPEN,e.addEventListener("click",function(){alert("Not yet implemented")}),u.utils.bindShortcut(r.Settings.shortcuts.open,function(){e.click()}),this.fileManipulation.add(e)},e.prototype.buildMachineSelection=function(){var t=new o.Table(r.Settings.machineSelRows,r.Settings.machineSelColumns),e={},i=this;u.utils.foreach(r.Settings.machines,function(n,s){var a=u.utils.create("input");a.classList.add("machine_selection_btn"),a.type="button",a.value=s.name,a.disabled=n==r.Settings.currentMachine,a.addEventListener("click",function(){e[r.Settings.currentMachine].disabled=!1,e[n].disabled=!0,e[n].blur(),r.Settings.currentMachine=n,i.loadMachine(n)}),t.add(a),e[n]=a}),u.utils.bindShortcut(["M"],function(){for(var t=document.querySelectorAll(".machine_selection_btn"),e=0;e<t.length;e++){var i=t[e];if(!i.disabled){i.focus();break}}}),this.machineSelection.clear(),this.machineSelection.add(t.html()),this.loadMachine(r.Settings.currentMachine)},e}(n.Renderer);e.Sidebar=c}),define("System",["require","exports","Keyboard","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(){function t(){}return t.changeLanguage=function(t){n.Settings.changeLanguage(t),this.reload()},t.reload=function(){r.utils.id(n.Settings.sidebarID).innerHTML="",this.sidebar.build(),this.sidebar.render()},t.bindSidebar=function(t){this.sidebar=t},t.keyEvent=function(t){for(var e=!1,i=0,n=this.keyboardObservers;i<n.length;i++){var r=n[i],s=r.keys;this.shortcutMatches(t,s)&&(r.callback(),e=!0)}return e?(t.preventDefault(),!1):!0},t.addKeyObserver=function(t,e){this.keyboardObservers.push({keys:t,callback:e})},t.shortcutMatches=function(t,e){function n(t){return t+"Key"}for(var r=["alt","ctrl","shift"],s=[],a=0,o=e;a<o.length;a++){var u=o[a];if(r.indexOf(u)>=0){if(s.push(u),!t[n(u)])return!1}else if(t.keyCode!=i.Keyboard.keys[u])return!1}for(var c=0,l=r;c<l.length;c++){var d=l[c];if(-1==s.indexOf(d)&&t[n(d)])return!1}return!0},t.keyboardObservers=[],t}();e.System=s}),define("interface/State",["require","exports","Settings"],function(t,e,i){"use strict";var n=function(){function t(){this.body=null,this.ring=null,this.name="",this.initial=!1,this.final=!1}return t.prototype.setPosition=function(t,e){this.x=t,this.y=e},t.prototype.getPosition=function(){return{x:this.x,y:this.y}},t.prototype.setName=function(t){this.name=t},t.prototype.setInitial=function(t){this.initial=t},t.prototype.isInitial=function(){return this.initial},t.prototype.setFinal=function(t){this.final=t},t.prototype.isFinal=function(){return this.final},t.prototype.render=function(t){this.body?this.body.attr({cx:this.x,cy:this.y}):(this.body=t.circle(this.x,this.y,i.Settings.stateRadius),this.body.attr("fill",i.Settings.stateFillColor),this.body.attr("stroke",i.Settings.stateStrokeColor),t.text(this.x,this.y,this.name).attr({"font-family":i.Settings.stateLabelFontFamily,"font-size":i.Settings.stateLabelFontSize})),this.final?this.ring?this.ring.attr({cx:this.x,cy:this.y}):(this.ring=t.circle(this.x,this.y,i.Settings.stateRingRadius),this.ring.attr("stroke",i.Settings.stateStrokeColor)):this.ring&&(this.ring.remove(),this.ring=null)},t.prototype.node=function(){return this.body},t.prototype.html=function(){return this.body?this.body.node:null},t.prototype.drag=function(t){var e,i=this,n=function(t,e){i.body.attr({cx:t,cy:e}),i.ring&&i.ring.attr({cx:t,cy:e}),i.setPosition(t,e)},r=function(){return this.ox=this.attr("cx"),this.oy=this.attr("cy"),e=0,null},s=function(t,i){var r=this.attr("cx")-this.ox,s=this.attr("cy")-this.oy,a=r*r+s*s;return a>e&&(e=a),n(this.ox+t,this.oy+i),null},a=function(i){var r=this.attr("cx")-this.ox,s=this.attr("cy")-this.oy;n(this.ox,this.oy);var a=t.call(this,e,i);return a&&n(this.ox+r,this.oy+s),null};this.body.drag(s,r,a)},t}();e.State=n}),define("interface/Mainbar",["require","exports","interface/Renderer","interface/State","Settings","Utils"],function(t,e,i,n,r,s){"use strict";function a(t,e,i){var n=Math.sin(i),r=Math.cos(i),s={x:t.x,y:t.y};s.x-=e.x,s.y-=e.y;var a={x:s.x*r-s.y*n,y:s.x*n+s.y*r};return{x:a.x+e.x,y:a.y+e.y}}var o=function(t){function e(){t.call(this),this.canvas=null,this.edgeMode=!1,this.currentEdge={origin:null,target:null,body:null};var e=this;$(window).resize(function(){e.resizeCanvas()})}return __extends(e,t),e.prototype.resizeCanvas=function(){var t=this.canvas;if(t){var e=$(this.node);t.setSize(50,50);var i=e.width(),n=e.height()-10;t.setSize(i,n)}},e.prototype.beginEdge=function(t){console.log("[ENTER EDGE MODE]"),this.edgeMode=!0;var e=t.getPosition(),i=this.currentEdge;i.origin=t,i.body=s.utils.line(this.canvas,e.x,e.y,e.x,e.y)},e.prototype.finishEdge=function(t){console.log("[BUILD EDGE]"),this.edgeMode=!1;var e=this.currentEdge,i=e.origin.getPosition(),n=t.getPosition();e.target=t;var o=n.x-i.x,u=n.y-i.y,c=Math.atan2(u,o),l=Math.sin(c),d=Math.cos(c),h=r.Settings.stateRadius*d,g=r.Settings.stateRadius*l;n.x-=h,n.y-=g,o-=h,u-=g,e.body.attr("path",s.utils.linePath(i.x,i.y,n.x,n.y));var f=r.Settings.edgeArrowLength,p=s.utils.toRadians(r.Settings.edgeArrowAngle),y=Math.sqrt(o*o+u*u),S=1-f/y,b={x:i.x+S*o,y:i.y+S*u},v=a(b,n,p);s.utils.line(this.canvas,v.x,v.y,n.x,n.y);var m=a(b,n,-p);s.utils.line(this.canvas,m.x,m.y,n.x,n.y)},e.prototype.adjustEdge=function(t,e){var i=this.currentEdge,n=i.origin.getPosition(),r={x:e.pageX-t.offsetLeft,y:e.pageY-t.offsetTop},a=r.x-n.x,o=r.y-n.y,u=n.x+.98*a,c=n.y+.98*o;i.body.attr("path",s.utils.linePath(n.x,n.y,u,c))},e.prototype.onRender=function(){this.canvas=Raphael(this.node,50,50),this.resizeCanvas();var t=[new n.State,new n.State,new n.State];t[0].setPosition(120,120),t[0].setFinal(!0),t[1].setPosition(300,80),t[2].setPosition(340,320);for(var e=this.canvas,i=this,a=function(t){t.render(e),t.drag(function(n,a){return n<=r.Settings.stateDragTolerance?(i.edgeMode?i.finishEdge(t):s.utils.isRightClick(a)?i.beginEdge(t):(t.setFinal(!t.isFinal()),t.render(e)),!1):!0}),t.node().mousedown(function(e){return s.utils.isRightClick(e)?(console.log("Initial state changed."),t.setInitial(!t.isInitial()),e.preventDefault(),!1):void 0})},o=0,u=t;o<u.length;o++){var c=u[o];a(c)}$(this.node).contextmenu(function(t){return t.preventDefault(),!1}),$(this.node).mousemove(function(t){i.edgeMode&&i.adjustEdge(this,t)})},e}(i.Renderer);e.Mainbar=o}),define("interface/UI",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){for(var t=[],e=0;e<arguments.length;e++)t[e-0]=arguments[e];this.bindSidebar(t[0]),this.bindMain(t[1])}return t.prototype.render=function(){this.sidebarRenderer&&this.sidebarRenderer.render(),this.mainRenderer&&this.mainRenderer.render(),console.log("Interface ready.")},t.prototype.bindSidebar=function(t){t&&t.bind(n.utils.id(i.Settings.sidebarID)),this.sidebarRenderer=t},t.prototype.bindMain=function(t){t&&t.bind(n.utils.id(i.Settings.mainbarID)),this.mainRenderer=t},t}();e.UI=r}),define("main",["require","exports","interface/Mainbar","interface/Sidebar","System","interface/UI"],function(t,e,i,n,r,s){"use strict";$(document).ready(function(){var t=new n.Sidebar,e=new i.Mainbar,a=new s.UI(t,e);a.render(),r.System.bindSidebar(t),document.body.addEventListener("keydown",function(t){return r.System.keyEvent(t)})})});