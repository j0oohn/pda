var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)};define("Keyboard",["require","exports"],function(t,e){"use strict";var i;!function(t){t.keys={A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,ENTER:13,SHIFT:16,SPACE:32,ESC:27,DELETE:46,LEFT:37,UP:38,RIGHT:39,DOWN:40,"+":61,"-":173}}(i=e.Keyboard||(e.Keyboard={}))}),define("lists/MachineList",["require","exports"],function(t,e){"use strict";!function(t){t[t.FA=0]="FA",t[t.PDA=1]="PDA",t[t.LBA=2]="LBA"}(e.Machine||(e.Machine={}));e.Machine}),define("interface/Renderer",["require","exports"],function(t,e){"use strict";var i=function(){function t(){}return t.prototype.bind=function(t){this.node=t,this.onBind()},t.prototype.render=function(){this.node&&this.onRender()},t.prototype.onBind=function(){},t}();e.Renderer=i}),define("languages/Portuguese",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={LANGUAGE_NAME:"Português",SELECT_LANGUAGE:"Idioma do Sistema",CHANGE_LANGUAGE:'Mudar o idioma para "%"?',FILE_MENUBAR:"Manipulação de Arquivos",SAVE:"Salvar",OPEN:"Abrir",SELECT_MACHINE:"Seleção de Máquina",CLEAR_MACHINE:"Limpar",CLEAR_CONFIRMATION:"Deseja realmente limpar o autômato?",FA:"Autômato Finito",PDA:"Autômato de Pilha",LBA:"Autômato Linearmente Limitado",RECOGNITION:"Reconhecimento",TEST_CASE:"caso de teste"}}(i=e.portuguese||(e.portuguese={}))}),define("languages/English",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={LANGUAGE_NAME:"English",SELECT_LANGUAGE:"System Language",CHANGE_LANGUAGE:'Change the language to "%"?',FILE_MENUBAR:"File Manipulation",SAVE:"Save",OPEN:"Open",SELECT_MACHINE:"Machine Selection",CLEAR_MACHINE:"Clear",CLEAR_CONFIRMATION:"Do you really want to reset this automaton?",FA:"Finite Automaton",PDA:"Pushdown Automaton",LBA:"Linearly Bounded Automaton",RECOGNITION:"Recognition",TEST_CASE:"test case"}}(i=e.english||(e.english={}))}),define("lists/LanguageList",["require","exports","languages/Portuguese","languages/English"],function(t,e,i,n){"use strict";function r(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}r(i),r(n)}),define("datastructures/Queue",["require","exports"],function(t,e){"use strict";var i=function(){function t(){this.data=[],this.pointer=0}return t.prototype.push=function(t){this.data.push(t)},t.prototype.front=function(){return this.data[this.pointer]},t.prototype.pop=function(){var t=this.front();return this.pointer++,this.pointer>=this.size()/2&&(this.data=this.data.slice(this.pointer),this.pointer=0),t},t.prototype.clear=function(){this.data=[],this.pointer=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.data.length-this.pointer},t}();e.Queue=i}),define("datastructures/UnorderedSet",["require","exports"],function(t,e){"use strict";var i=function(){function t(){this.data={},this.count=0}return t.prototype.insert=function(t){this.contains(t)||this.count++,this.data[t]=!0},t.prototype.erase=function(t){this.contains(t)&&this.count--,delete this.data[t]},t.prototype.contains=function(t){return!!this.data[t]},t.prototype.clear=function(){this.data={},this.count=0},t.prototype.empty=function(){return 0==this.size()},t.prototype.size=function(){return this.count},t.prototype.forEach=function(t){for(var e in this.data)if(this.data.hasOwnProperty(e)&&t(parseFloat(e))===!1)break},t.prototype.asList=function(){var t=[];return this.forEach(function(e){t.push(e)}),t},t}();e.UnorderedSet=i}),define("machines/FA",["require","exports","datastructures/Queue","datastructures/UnorderedSet"],function(t,e,i,n){"use strict";var r=function(){function t(){this.stateList=[],this.transitions={},this.epsilonTransitions={},this.initialState=-1,this.finalStates=new n.UnorderedSet,this.currentStates=new n.UnorderedSet}return t.prototype.addState=function(t){this.stateList.push(t);var e=this.numStates()-1;return this.transitions[e]={},this.epsilonTransitions[e]=new n.UnorderedSet,-1==this.initialState&&(this.initialState=e,this.reset()),e},t.prototype.removeState=function(){},t.prototype.addTransition=function(t,e,i){var r=this.transitions[t];""==i?this.epsilonTransitions[t].insert(e):(r.hasOwnProperty(i)||(r[i]=new n.UnorderedSet),r[i].insert(e))},t.prototype.removeTransition=function(t,e,i){var n=this.transitions[t];""==i?this.epsilonTransitions[t].erase(e):n.hasOwnProperty(i)&&n[i].erase(e)},t.prototype.setInitialState=function(t){t<this.numStates()&&(this.initialState=t)},t.prototype.unsetInitialState=function(){this.initialState=-1},t.prototype.getInitialState=function(){return this.initialState},t.prototype.addAcceptingState=function(t){this.finalStates.insert(t)},t.prototype.removeAcceptingState=function(t){this.finalStates.erase(t)},t.prototype.getAcceptingStates=function(){return this.finalStates.asList()},t.prototype.getStates=function(){var t=[],e=this;return this.currentStates.forEach(function(i){t.push(e.stateList[i])}),t},t.prototype.alphabet=function(){var t=[];return t},t.prototype.read=function(t){var e=new n.UnorderedSet,i=this;this.currentStates.forEach(function(n){var r=i.transition(n,t);r&&r.forEach(function(t){e.insert(t)})}),this.expandSpontaneous(e),this.currentStates=e},t.prototype.reset=function(){this.currentStates.clear(),this.currentStates.insert(this.initialState),this.expandSpontaneous(this.currentStates)},t.prototype.accepts=function(){var t=!1,e=this;return this.finalStates.forEach(function(i){return e.currentStates.contains(i)?(t=!0,!1):void 0}),t},t.prototype.error=function(){return 0==this.currentStates.size()},t.prototype.numStates=function(){return this.stateList.length},t.prototype.transition=function(t,e){return this.transitions[t][e]},t.prototype.expandSpontaneous=function(t){var e=new i.Queue;for(t.forEach(function(t){e.push(t)});!e.empty();){var n=e.pop(),r=this.epsilonTransitions[n];r.forEach(function(i){t.contains(i)||(t.insert(i),e.push(i))})}},t}();e.FA=r}),define("Utils",["require","exports","System"],function(t,e,i){"use strict";var n;!function(t){function e(t){return document.querySelector(t)}function n(t){return e("#"+t)}function r(t,e){var i=document.createElement(t);return e&&this.foreach(e,function(t,e){i[t]=e}),i}function s(t,e){for(var i in t)if(t.hasOwnProperty(i)&&e(i,t[i])===!1)break}function a(t){return"which"in t?3==t.which:"button"in t?2==t.button:(console.log("[WARNING] Right click events will not work properly in this browser."),!1)}function o(t,e,i,n){return"M"+t+" "+e+" L"+i+" "+n}function h(t,e,i,n,r){var s=t.path(this.linePath(e,i,n,r));return s.attr("stroke","black"),s}function u(t){return t*Math.PI/180}function c(t,e,i){var n=Math.sin(i),r=Math.cos(i),s={x:t.x,y:t.y};s.x-=e.x,s.y-=e.y;var a={x:s.x*r-s.y*n,y:s.x*n+s.y*r};return{x:a.x+e.x,y:a.y+e.y}}function l(t,e){i.System.addKeyObserver(t,e)}t.select=e,t.id=n,t.create=r,t.foreach=s,t.isRightClick=a,t.linePath=o,t.line=h,t.toRadians=u,t.rotatePoint=c,t.bindShortcut=l}(n=e.utils||(e.utils={}))}),define("initializers/initFA",["require","exports","interface/Menu","Settings","Utils"],function(t,e,i,n,r){"use strict";var s;!function(t){function e(){var t=[],e=new i.Menu(n.Strings.RECOGNITION),s=r.utils.create("input",{type:"text",placeholder:n.Strings.TEST_CASE});e.add(s),t.push(e),n.Settings.machines[n.Settings.Machine.FA].sidebar=t}t.init=e}(s=e.initFA||(e.initFA={}))}),define("initializers/initPDA",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(){console.log("[INIT] PDA")}t.init=e}(i=e.initPDA||(e.initPDA={}))}),define("initializers/initLBA",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(){console.log("[INIT] LBA")}t.init=e}(i=e.initLBA||(e.initLBA={}))}),define("lists/InitializerList",["require","exports","initializers/initFA","initializers/initPDA","initializers/initLBA"],function(t,e,i,n,r){"use strict";function s(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}s(i),s(n),s(r)}),define("Initializer",["require","exports","lists/InitializerList","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){}return t.exec=function(){this.initSidebars()},t.initSidebars=function(){n.utils.foreach(i,function(t,e){e.init()})},t}();e.Initializer=r}),define("Settings",["require","exports","lists/LanguageList","lists/MachineList","Initializer","Utils"],function(t,e,i,n,r,s){"use strict";var a;!function(t){function a(){var e={};for(var i in t.Machine)t.Machine.hasOwnProperty(i)&&!isNaN(parseInt(i))&&(e[i]={name:t.language.strings[t.Machine[i]],sidebar:[]});s.utils.foreach(e,function(e,i){t.machines[e]=i}),h=!1,r.Initializer.exec()}function o(i){t.language=i,e.Strings=t.language.strings,a()}t.sidebarID="sidebar",t.mainbarID="mainbar",t.slideInterval=300,t.machineSelRows=3,t.machineSelColumns=1,t.stateLabelFontFamily="sans-serif",t.stateLabelFontSize=20,t.stateRadius=32,t.stateRingRadius=27,t.stateDragTolerance=50,t.stateFillColor="white",t.stateStrokeColor="black",t.stateStrokeWidth=1,t.stateRingStrokeWidth=1,t.stateInitialMarkLength=40,t.stateInitialMarkHeadLength=15,t.stateInitialMarkAngle=s.utils.toRadians(25),t.stateHighlightFillColor="#FFD574",t.stateHighlightStrokeColor="red",t.stateHighlightStrokeWidth=3,t.stateHighlightRingStrokeWidth=2,t.edgeArrowLength=30,t.edgeArrowAngle=s.utils.toRadians(30),t.shortcuts={save:["ctrl","S"],open:["ctrl","O"],toggleInitial:["I"],toggleFinal:["F"],dimState:["ESC"],deleteState:["DELETE"],clearMachine:["C"],undo:["ctrl","Z"]},t.languages=i,t.Machine=n.Machine,t.language=i.english,t.currentMachine=t.Machine.FA,t.machines={};var h=!0;t.update=a,t.changeLanguage=o}(a=e.Settings||(e.Settings={})),e.Strings=a.language.strings,a.update()}),define("interface/Menu",["require","exports","interface/Renderer","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(t){function e(e){t.call(this),this.body=null,this.toggled=!1,this.title=e,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.clear=function(){this.children=[]},e.prototype.onRender=function(){var t=this.node,e=r.utils.create("div");e.classList.add("menu");var i=r.utils.create("div");i.classList.add("title"),i.innerHTML=this.title,e.appendChild(i);var s=r.utils.create("div");s.classList.add("content");for(var a=0,o=this.children;a<o.length;a++){var h=o[a];s.appendChild(h)}e.appendChild(s),t.appendChild(e),i.addEventListener("click",function(){$(s).is(":animated")||$(s).slideToggle(n.Settings.slideInterval)}),this.body=e,this.toggled&&this.internalToggle()},e.prototype.toggle=function(){this.toggled=!this.toggled,this.body&&this.internalToggle()},e.prototype.html=function(){return this.body},e.prototype.internalToggle=function(){var t=this.body.querySelector(".content");$(t).toggle()},e}(i.Renderer);e.Menu=s}),define("interface/Table",["require","exports","interface/Renderer","Utils"],function(t,e,i,n){"use strict";var r=function(t){function e(e,i){t.call(this),this.numRows=e,this.numColumns=i,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.html=function(){for(var t=n.utils.create("table"),e=0,i=0;i<this.numRows;i++){for(var r=n.utils.create("tr"),s=0;s<this.numColumns;s++){var a=n.utils.create("td");e<this.children.length&&a.appendChild(this.children[e]),r.appendChild(a),e++}t.appendChild(r)}return t},e.prototype.onRender=function(){this.node.appendChild(this.html())},e}(i.Renderer);e.Table=r}),define("interface/Sidebar",["require","exports","interface/Menu","interface/Renderer","Settings","Settings","System","interface/Table","Utils"],function(t,e,i,n,r,s,a,o,h){"use strict";var u=function(t){function e(){t.call(this),this.build()}return __extends(e,t),e.prototype.build=function(){this.languageSelection=new i.Menu(s.Strings.SELECT_LANGUAGE),this.fileManipulation=new i.Menu(s.Strings.FILE_MENUBAR),this.machineSelection=new i.Menu(s.Strings.SELECT_MACHINE),this.otherMenus=[],this.buildLanguageSelection(),this.buildFileManipulation(),this.buildMachineSelection(),this.node&&this.onBind()},e.prototype.onBind=function(){this.languageSelection.bind(this.node),this.fileManipulation.bind(this.node),this.machineSelection.bind(this.node);for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.bind(this.node)}},e.prototype.onRender=function(){this.languageSelection.render(),this.fileManipulation.render(),this.machineSelection.render(),this.renderDynamicMenus()},e.prototype.renderDynamicMenus=function(){for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.render()}},e.prototype.loadMachine=function(t){for(var e=0,i=this.otherMenus;e<i.length;e++){var n=i[e];$(n.html()).remove()}this.otherMenus=r.Settings.machines[t].sidebar;for(var s=0,a=this.otherMenus;s<a.length;s++){var n=a[s];n.bind(this.node)}},e.prototype.buildLanguageSelection=function(){var t=h.utils.create("select"),e=r.Settings.languages,i={},n=0;h.utils.foreach(e,function(e,s){var a=h.utils.create("option");a.value=n.toString(),a.innerHTML=s.strings.LANGUAGE_NAME,t.appendChild(a),i[n]=e,s==r.Settings.language&&(t.selectedIndex=n),n++}),this.languageSelection.clear(),this.languageSelection.add(t),this.languageSelection.toggle(),t.addEventListener("change",function(){var t=this.options[this.selectedIndex],n=t.value,r=t.innerHTML,o=confirm(s.Strings.CHANGE_LANGUAGE.replace("%",r));o&&a.System.changeLanguage(e[i[n]])})},e.prototype.buildFileManipulation=function(){this.fileManipulation.clear();var t=h.utils.create("input");t.classList.add("file_manip_btn"),t.type="button",t.value=s.Strings.SAVE,t.addEventListener("click",function(){var t="Hello, world!",e=new Blob([t],{type:"text/plain; charset=utf-8"});saveAs(e,"file.txt")}),h.utils.bindShortcut(r.Settings.shortcuts.save,function(){t.click()}),this.fileManipulation.add(t);var e=h.utils.create("input");e.classList.add("file_manip_btn"),e.type="button",e.value=s.Strings.OPEN,e.addEventListener("click",function(){alert("Not yet implemented")}),h.utils.bindShortcut(r.Settings.shortcuts.open,function(){e.click()}),this.fileManipulation.add(e)},e.prototype.buildMachineSelection=function(){var t=new o.Table(r.Settings.machineSelRows,r.Settings.machineSelColumns),e={},i=this;h.utils.foreach(r.Settings.machines,function(n,s){var a=h.utils.create("input");a.classList.add("machine_selection_btn"),a.type="button",a.value=s.name,a.disabled=n==r.Settings.currentMachine,a.addEventListener("click",function(){e[r.Settings.currentMachine].disabled=!1,e[n].disabled=!0,e[n].blur(),r.Settings.currentMachine=n,i.loadMachine(n),i.renderDynamicMenus()}),t.add(a),e[n]=a}),h.utils.bindShortcut(["M"],function(){for(var t=document.querySelectorAll(".machine_selection_btn"),e=0;e<t.length;e++){var i=t[e];if(!i.disabled){i.focus();break}}}),this.machineSelection.clear(),this.machineSelection.add(t.html()),this.loadMachine(r.Settings.currentMachine)},e}(n.Renderer);e.Sidebar=u}),define("System",["require","exports","Keyboard","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(){function t(){}return t.changeLanguage=function(t){n.Settings.changeLanguage(t),this.reload()},t.reload=function(){r.utils.id(n.Settings.sidebarID).innerHTML="",this.sidebar.build(),this.sidebar.render()},t.bindSidebar=function(t){this.sidebar=t},t.keyEvent=function(t){for(var e=!1,i=0,n=this.keyboardObservers;i<n.length;i++){var r=n[i],s=r.keys;this.shortcutMatches(t,s)&&(r.callback(),e=!0)}return e?(t.preventDefault(),!1):!0},t.addKeyObserver=function(t,e){this.keyboardObservers.push({keys:t,callback:e})},t.shortcutMatches=function(t,e){function n(t){return t+"Key"}for(var r=["alt","ctrl","shift"],s=[],a=0,o=e;a<o.length;a++){var h=o[a];if(r.indexOf(h)>=0){if(s.push(h),!t[n(h)])return!1}else if(t.keyCode!=i.Keyboard.keys[h])return!1}for(var u=0,c=r;u<c.length;u++){var l=c[u];if(-1==s.indexOf(l)&&t[n(l)])return!1}return!0},t.keyboardObservers=[],t}();e.System=s}),define("interface/State",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){this.body=null,this.ring=null,this.arrowParts=[],this.name="",this.initial=!1,this.final=!1,this.highlighted=!1,this.initialMarkOffsets=[],this.radius=i.Settings.stateRadius}return t.prototype.setPosition=function(t,e){this.x=t,this.y=e},t.prototype.getPosition=function(){return{x:this.x,y:this.y}},t.prototype.setName=function(t){this.name=t},t.prototype.setInitial=function(t){this.initial=t},t.prototype.isInitial=function(){return this.initial},t.prototype.setFinal=function(t){this.final=t},t.prototype.isFinal=function(){return this.final},t.prototype.highlight=function(){this.highlighted=!0},t.prototype.dim=function(){this.highlighted=!1},t.prototype.remove=function(){this.body&&(this.body.remove(),this.body=null),this.ring&&(this.ring.remove(),this.ring=null);for(var t=0,e=this.arrowParts;t<e.length;t++){var i=e[t];i.remove()}this.arrowParts=[]},t.prototype.fillColor=function(){return this.highlighted?i.Settings.stateHighlightFillColor:i.Settings.stateFillColor},t.prototype.strokeColor=function(){return this.highlighted?i.Settings.stateHighlightStrokeColor:i.Settings.stateStrokeColor},t.prototype.strokeWidth=function(){return this.highlighted?i.Settings.stateHighlightStrokeWidth:i.Settings.stateStrokeWidth},t.prototype.ringStrokeWidth=function(){return this.highlighted?i.Settings.stateHighlightRingStrokeWidth:i.Settings.stateRingStrokeWidth},t.prototype.renderBody=function(t){this.body?this.body.attr({cx:this.x,cy:this.y}):(this.body=t.circle(this.x,this.y,this.radius),t.text(this.x,this.y,this.name).attr({"font-family":i.Settings.stateLabelFontFamily,"font-size":i.Settings.stateLabelFontSize})),this.body.attr("fill",this.fillColor()),this.body.attr("stroke",this.strokeColor()),this.body.attr("stroke-width",this.strokeWidth())},t.prototype.updateInitialMarkOffsets=function(){if(this.initialMarkOffsets.length)return this.initialMarkOffsets;var t=i.Settings.stateInitialMarkLength,e=this.x-this.radius,r=this.y,s=i.Settings.stateInitialMarkHeadLength,a=i.Settings.stateInitialMarkAngle,o=1-s/t,h={x:e-t+o*t,y:r},u={x:e,y:r},c=n.utils.rotatePoint(h,u,a),l=n.utils.rotatePoint(h,u,-a);this.initialMarkOffsets=[{x:c.x-e,y:c.y-r},{x:l.x-e,y:l.y-r}]},t.prototype.renderInitialMark=function(t){if(this.initial){var e=i.Settings.stateInitialMarkLength,r=this.x-this.radius,s=this.y;if(this.arrowParts.length){var a=this.arrowParts,o=a[0],h=a[1],u=a[2];o.attr("path",n.utils.linePath(r-e,s,r,s)),this.updateInitialMarkOffsets();var c=this.initialMarkOffsets[0],l=this.initialMarkOffsets[1];h.attr("path",n.utils.linePath(c.x+r,c.y+s,r,s)),u.attr("path",n.utils.linePath(l.x+r,l.y+s,r,s))}else{var o=n.utils.line(t,r-e,s,r,s);this.updateInitialMarkOffsets();var c=this.initialMarkOffsets[0],l=this.initialMarkOffsets[1],h=n.utils.line(t,c.x+r,c.y+s,r,s),u=n.utils.line(t,l.x+r,l.y+s,r,s),a=this.arrowParts;a.push(o),a.push(h),a.push(u)}}else for(var a=this.arrowParts;a.length;)a[a.length-1].remove(),a.pop()},t.prototype.renderFinalMark=function(t){this.final?(this.ring?this.ring.attr({cx:this.x,cy:this.y}):this.ring=t.circle(this.x,this.y,i.Settings.stateRingRadius),this.ring.attr("stroke",this.strokeColor()),this.ring.attr("stroke-width",this.ringStrokeWidth())):this.ring&&(this.ring.remove(),this.ring=null)},t.prototype.setVisualPosition=function(t,e){this.body.attr({cx:t,cy:e}),this.ring&&this.ring.attr({cx:t,cy:e}),this.initial&&this.renderInitialMark(),this.setPosition(t,e)},t.prototype.render=function(t){this.renderBody(t),this.renderInitialMark(t),this.renderFinalMark(t)},t.prototype.node=function(){return this.body},t.prototype.html=function(){return this.body?this.body.node:null},t.prototype.drag=function(t,e){var i=function(){return this.ox=this.attr("cx"),this.oy=this.attr("cy"),null},n=this,r=function(e,i,r,s,a){return n.setVisualPosition(this.ox+e,this.oy+i),t.call(this,a),null},s=function(i){var r=this.attr("cx")-this.ox,s=this.attr("cy")-this.oy,a=r*r+s*s,o=e.call(this,a,i);return o||(n.setVisualPosition(this.ox,this.oy),t.call(this,i)),null};this.body.drag(r,i,s)},t}();e.State=r}),define("interface/Edge",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){this.origin=null,this.target=null,this.virtualTarget=null,this.body=null,this.head=[]}return t.prototype.setOrigin=function(t){this.origin=t},t.prototype.getOrigin=function(){return this.origin},t.prototype.setTarget=function(t){this.target=t},t.prototype.getTarget=function(){return this.target},t.prototype.setVirtualTarget=function(t){this.virtualTarget=t},t.prototype.render=function(t){this.renderBody(t),this.renderHead(t)},t.prototype.remove=function(){this.body&&(this.body.remove(),this.body=null);for(var t=0,e=this.head;t<e.length;t++){var i=e[t];i.remove()}this.head=[]},t.prototype.renderBody=function(t){var e,r=this.origin.getPosition();if(this.target)e=this.target.getPosition();else if(this.virtualTarget){e={x:this.virtualTarget.x,y:this.virtualTarget.y};var s=e.x-r.x,a=e.y-r.y;e.x=r.x+.98*s,e.y=r.y+.98*a}else e=r;var o=e.x-r.x,h=e.y-r.y,u=Math.atan2(h,o),c=Math.sin(u),l=Math.cos(u),d=i.Settings.stateRadius*l,f=i.Settings.stateRadius*c;r.x+=d,r.y+=f,this.target&&(e.x-=d,e.y-=f),this.body?this.body.attr("path",n.utils.linePath(r.x,r.y,e.x,e.y)):this.body=n.utils.line(t,r.x,r.y,e.x,e.y)},t.prototype.renderHead=function(t){if(this.target){var e=this.origin.getPosition(),r=this.target.getPosition(),s=r.x-e.x,a=r.y-e.y,o=Math.atan2(a,s),h=Math.sin(o),u=Math.cos(o),c=i.Settings.stateRadius*u,l=i.Settings.stateRadius*h;r.x-=c,r.y-=l,s-=c,a-=l;var d=i.Settings.edgeArrowLength,f=i.Settings.edgeArrowAngle,g=Math.sqrt(s*s+a*a),p=1-d/g,y={x:e.x+p*s,y:e.y+p*a},S=n.utils.rotatePoint(y,r,f),v=n.utils.rotatePoint(y,r,-f);this.head.length?(this.head[0].attr("path",n.utils.linePath(S.x,S.y,r.x,r.y)),this.head[1].attr("path",n.utils.linePath(v.x,v.y,r.x,r.y))):(this.head.push(n.utils.line(t,S.x,S.y,r.x,r.y)),this.head.push(n.utils.line(t,v.x,v.y,r.x,r.y)))}},t}();e.Edge=r}),define("interface/StateRenderer",["require","exports","interface/Edge","Settings","interface/State","Utils"],function(t,e,i,n,r,s){"use strict";var a=function(){function t(t,e){this.canvas=null,this.node=null,this.stateList=[],this.edgeList=[],this.highlightedState=null,this.edgeMode=!1,this.currentEdge=null,this.canvas=t,this.node=e}return t.prototype.render=function(){var t=new r.State;t.setPosition(100,100),t.setInitial(!0),this.stateList.push(t);for(var e=0,i=this.stateList;e<i.length;e++){var n=i[e];n.render(this.canvas),this.bindStateEvents(n)}this.bindShortcuts();var s=this;$(this.node).dblclick(function(t){var e=new r.State;e.setPosition(t.pageX-this.offsetLeft,t.pageY-this.offsetTop),s.stateList.push(e),s.selectState(e),s.bindStateEvents(e)}),$(this.node).contextmenu(function(t){return t.preventDefault(),!1}),$(this.node).mousemove(function(t){s.edgeMode&&s.adjustEdge(this,t)})},t.prototype.selectState=function(t){this.highlightedState&&(this.highlightedState.dim(),this.highlightedState.render(this.canvas)),t.highlight(),this.highlightedState=t,t.render(this.canvas)},t.prototype.bindStateEvents=function(t){var e=this.canvas,i=this;t.drag(function(){i.updateEdges()},function(r,a){return r<=n.Settings.stateDragTolerance?(i.edgeMode?i.finishEdge(t):s.utils.isRightClick(a)?i.beginEdge(t):t==i.highlightedState?(t.dim(),i.highlightedState=null,t.render(e)):i.selectState(t),!1):!0})},t.prototype.beginEdge=function(t){this.edgeMode=!0,this.currentEdge=new i.Edge,this.currentEdge.setOrigin(t)},t.prototype.finishEdge=function(t){this.edgeMode=!1,this.currentEdge.setTarget(t),this.currentEdge.render(this.canvas),this.edgeList.push(this.currentEdge),this.currentEdge=null},t.prototype.adjustEdge=function(t,e){var i={x:e.pageX-t.offsetLeft,y:e.pageY-t.offsetTop};this.currentEdge.setVirtualTarget(i),this.currentEdge.render(this.canvas)},t.prototype.updateEdges=function(){for(var t=0,e=this.edgeList;t<e.length;t++){var i=e[t];i.render(this.canvas)}},t.prototype.clearSelection=function(){this.highlightedState=null,this.edgeMode&&(this.edgeMode=!1,this.currentEdge.remove(),this.currentEdge=null)},t.prototype.bindShortcuts=function(){var t=this.canvas,e=this;s.utils.bindShortcut(n.Settings.shortcuts.toggleInitial,function(){var i=e.highlightedState;i&&(i.setInitial(!i.isInitial()),i.render(t))}),s.utils.bindShortcut(n.Settings.shortcuts.toggleFinal,function(){var i=e.highlightedState;i&&(i.setFinal(!i.isFinal()),i.render(t))}),s.utils.bindShortcut(n.Settings.shortcuts.dimState,function(){var i=e.highlightedState;i&&(i.dim(),i.render(t),e.highlightedState=null)}),s.utils.bindShortcut(n.Settings.shortcuts.deleteState,function(){var t=e.highlightedState;if(t){for(var i=0;i<e.edgeList.length;i++){var n=e.edgeList[i],r=n.getOrigin(),s=n.getTarget();(r==t||s==t)&&(n.remove(),e.edgeList.splice(i,1),i--)}t.remove();for(var a=e.stateList,i=0;i<a.length;i++)if(a[i]==t){a.splice(i,1);break}e.clearSelection()}}),s.utils.bindShortcut(n.Settings.shortcuts.clearMachine,function(){var t=confirm(n.Strings.CLEAR_CONFIRMATION);if(t){e.clearSelection();for(var i=0,r=e.edgeList;i<r.length;i++){var s=r[i];s.remove()}e.edgeList=[];for(var a=0,o=e.stateList;a<o.length;a++){var h=o[a];h.remove()}e.stateList=[]}}),s.utils.bindShortcut(n.Settings.shortcuts.undo,function(){alert("TODO: undo")})},t}();e.StateRenderer=a}),define("interface/Mainbar",["require","exports","interface/Renderer","interface/StateRenderer"],function(t,e,i,n){"use strict";var r=function(t){function e(){t.call(this),this.canvas=null,this.stateRenderer=null;var e=this;$(window).resize(function(){e.resizeCanvas()})}return __extends(e,t),e.prototype.resizeCanvas=function(){var t=this.canvas;if(t){var e=$(this.node);t.setSize(50,50);var i=e.width(),n=e.height()-10;t.setSize(i,n)}},e.prototype.onBind=function(){this.canvas=Raphael(this.node,0,0),this.resizeCanvas(),this.stateRenderer=new n.StateRenderer(this.canvas,this.node)},e.prototype.onRender=function(){this.stateRenderer.render()},e}(i.Renderer);e.Mainbar=r}),define("interface/UI",["require","exports","interface/Mainbar","Settings","interface/Sidebar","System","Utils"],function(t,e,i,n,r,s,a){"use strict";var o=function(){function t(){var t=new r.Sidebar,e=new i.Mainbar;this.bindSidebar(t),this.bindMain(e),s.System.bindSidebar(t)}return t.prototype.render=function(){this.sidebarRenderer.render(),this.mainRenderer.render(),console.log("Interface ready.")},t.prototype.bindSidebar=function(t){t.bind(a.utils.id(n.Settings.sidebarID)),this.sidebarRenderer=t},t.prototype.bindMain=function(t){t.bind(a.utils.id(n.Settings.mainbarID)),this.mainRenderer=t},t}();e.UI=o}),define("main",["require","exports","System","interface/UI"],function(t,e,i,n){"use strict";$(document).ready(function(){var t=new n.UI;t.render(),document.body.addEventListener("keydown",function(t){return i.System.keyEvent(t)})})});