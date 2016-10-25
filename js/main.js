var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)};define("interface/Renderer",["require","exports"],function(t,e){"use strict";var i=function(){function t(){}return t.prototype.bind=function(t){this.node=t,this.onBind()},t.prototype.render=function(){this.node&&this.onRender()},t.prototype.onBind=function(){},t}();e.Renderer=i}),define("languages/English",["require","exports"],function(t,e){"use strict";var i;!function(t){t.strings={SELECT_MACHINE:"Machine Selection",FA:"Finite Automaton",PDA:"Pushdown Automaton",LBA:"Linearly Bounded Automaton",FILE_MENUBAR:"File Manipulation",SAVE:"Save",OPEN:"Open"}}(i=e.english||(e.english={}))}),define("Utils",["require","exports"],function(t,e){"use strict";var i;!function(t){function e(t){return document.querySelector(t)}function i(t){return e("#"+t)}function n(t){return document.createElement(t)}function r(t,e){for(var i in t)t.hasOwnProperty(i)&&e(i,t[i])}function s(t){return"which"in t?3==t.which:"button"in t?2==t.button:(console.log("[WARNING] Right click events will not work properly in this browser."),!1)}t.select=e,t.id=i,t.create=n,t.foreach=r,t.isRightClick=s}(i=e.utils||(e.utils={}))}),define("interface/Menu",["require","exports","interface/Renderer","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(t){function e(e){t.call(this),this.body=null,this.title=e,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.clear=function(){this.children=[]},e.prototype.onRender=function(){var t=this.node,e=r.utils.create("div");e.classList.add("menu");var i=r.utils.create("div");i.classList.add("title"),i.innerHTML=this.title,e.appendChild(i);var s=r.utils.create("div");s.classList.add("content");for(var a=0,o=this.children;a<o.length;a++){var c=o[a];s.appendChild(c)}e.appendChild(s),t.appendChild(e),i.addEventListener("click",function(){$(s).is(":animated")||$(s).slideToggle(n.Settings.slideInterval)}),this.body=e},e.prototype.html=function(){return this.body},e}(i.Renderer);e.Menu=s}),define("Initializer",["require","exports","interface/Menu","Settings","Utils"],function(t,e,i,n,r){"use strict";var s=function(){function t(){}return t.exec=function(){this.initialized||(this.initialized=!0,this.initSidebars())},t.initSidebars=function(){this.initSidebarFA(),this.initSidebarPDA(),this.initSidebarLBA()},t.initSidebarFA=function(){var t=[],e=new i.Menu("Recognition"),s=r.utils.create("input");s.type="text",s.placeholder="test case",e.add(s),t.push(e),n.Settings.machines[n.Settings.Machine.FA].sidebar=t},t.initSidebarPDA=function(){console.log("[INIT] PDA")},t.initSidebarLBA=function(){console.log("[INIT] LBA")},t.initialized=!1,t}();e.Initializer=s}),define("Settings",["require","exports","languages/English","Initializer"],function(t,e,i,n){"use strict";var r;!function(t){t.sidebarID="sidebar",t.mainbarID="mainbar",t.slideInterval=300,t.machineSelRows=3,t.machineSelColumns=1,t.stateLabelFontFamily="sans-serif",t.stateLabelFontSize=20,t.stateRadius=32,t.stateRingRadius=27,t.stateDragTolerance=50,t.stateFillColor="white",t.stateStrokeColor="black",function(t){t[t.FA=0]="FA",t[t.PDA=1]="PDA",t[t.LBA=2]="LBA"}(t.Machine||(t.Machine={}));var e=t.Machine;t.language=i.english,t.currentMachine=e.FA,t.machines={},t.machines[e.FA]={name:t.language.strings.FA,sidebar:[]},t.machines[e.PDA]={name:t.language.strings.PDA,sidebar:[]},t.machines[e.LBA]={name:t.language.strings.LBA,sidebar:[]}}(r=e.Settings||(e.Settings={})),e.Strings=r.language.strings,n.Initializer.exec()}),define("interface/State",["require","exports","Settings"],function(t,e,i){"use strict";var n=function(){function t(){this.body=null,this.ring=null,this.name="",this.initial=!1,this.final=!1}return t.prototype.setPosition=function(t,e){this.x=t,this.y=e},t.prototype.setName=function(t){this.name=t},t.prototype.setInitial=function(t){this.initial=t},t.prototype.isInitial=function(){return this.initial},t.prototype.setFinal=function(t){this.final=t},t.prototype.isFinal=function(){return this.final},t.prototype.render=function(t){this.body?this.body.attr({cx:this.x,cy:this.y}):(this.body=t.circle(this.x,this.y,i.Settings.stateRadius),this.body.attr("fill",i.Settings.stateFillColor),this.body.attr("stroke",i.Settings.stateStrokeColor),t.text(this.x,this.y,this.name).attr({"font-family":i.Settings.stateLabelFontFamily,"font-size":i.Settings.stateLabelFontSize})),this.final?this.ring?this.ring.attr({cx:this.x,cy:this.y}):(this.ring=t.circle(this.x,this.y,i.Settings.stateRingRadius),this.ring.attr("stroke",i.Settings.stateStrokeColor)):this.ring&&(this.ring.remove(),this.ring=null)},t.prototype.node=function(){return this.body},t.prototype.html=function(){return this.body?this.body.node:null},t.prototype.drag=function(t){var e,i=this,n=function(t,e){i.body.attr({cx:t,cy:e}),i.ring&&i.ring.attr({cx:t,cy:e}),i.setPosition(t,e)},r=function(t,i,n){return this.ox=this.attr("cx"),this.oy=this.attr("cy"),e=0,null},s=function(t,i,r,s,a){var o=this.attr("cx")-this.ox,c=this.attr("cy")-this.oy,l=o*o+c*c;return l>e&&(e=l),n(this.ox+t,this.oy+i),null},a=function(i){var r=this.attr("cx")-this.ox,s=this.attr("cy")-this.oy;n(this.ox,this.oy);var a=t.call(this,e,i);return a&&n(this.ox+r,this.oy+s),null};this.body.drag(s,r,a)},t}();e.State=n}),define("interface/Mainbar",["require","exports","interface/Renderer","interface/State","Settings","Utils"],function(t,e,i,n,r,s){"use strict";var a=function(t){function e(){t.call(this),this.canvas=null;var e=this;$(window).resize(function(){e.resizeCanvas()})}return __extends(e,t),e.prototype.resizeCanvas=function(){var t=this.canvas;if(t){var e=$(this.node);t.setSize(50,50);var i=e.width(),n=e.height()-10;t.setSize(i,n)}},e.prototype.onRender=function(){this.canvas=Raphael(this.node,50,50),this.resizeCanvas();var t=[new n.State,new n.State,new n.State];t[0].setPosition(120,120),t[0].setFinal(!0),t[1].setPosition(300,80),t[2].setPosition(340,320);for(var e=this.canvas,i=function(t){t.render(e),t.drag(function(i,n){return!s.utils.isRightClick(n)&&(!(i<=r.Settings.stateDragTolerance)||(t.setFinal(!t.isFinal()),t.render(e),!1))}),t.node().mousedown(function(e){if(s.utils.isRightClick(e))return console.log("Initial state changed."),t.setInitial(!t.isInitial()),e.preventDefault(),!1})},a=0,o=t;a<o.length;a++){var c=o[a];i(c)}$(this.node).contextmenu(function(t){return t.preventDefault(),!1})},e}(i.Renderer);e.Mainbar=a}),define("interface/Table",["require","exports","interface/Renderer","Utils"],function(t,e,i,n){"use strict";var r=function(t){function e(e,i){t.call(this),this.numRows=e,this.numColumns=i,this.children=[]}return __extends(e,t),e.prototype.add=function(t){this.children.push(t)},e.prototype.html=function(){for(var t=n.utils.create("table"),e=0,i=0;i<this.numRows;i++){for(var r=n.utils.create("tr"),s=0;s<this.numColumns;s++){var a=n.utils.create("td");e<this.children.length&&a.appendChild(this.children[e]),r.appendChild(a),e++}t.appendChild(r)}return t},e.prototype.onRender=function(){this.node.appendChild(this.html())},e}(i.Renderer);e.Table=r}),define("interface/Sidebar",["require","exports","interface/Menu","interface/Renderer","Settings","Settings","interface/Table","Utils"],function(t,e,i,n,r,s,a,o){"use strict";var c=function(t){function e(){t.call(this),this.fileManipulation=new i.Menu(s.Strings.FILE_MENUBAR),this.machineSelection=new i.Menu(s.Strings.SELECT_MACHINE),this.otherMenus=[],this.build()}return __extends(e,t),e.prototype.onBind=function(){this.fileManipulation.bind(this.node),this.machineSelection.bind(this.node);for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.bind(this.node)}},e.prototype.onRender=function(){this.fileManipulation.render(),this.machineSelection.render();for(var t=0,e=this.otherMenus;t<e.length;t++){var i=e[t];i.render()}},e.prototype.build=function(){this.buildFileManipulation(),this.buildMachineSelection()},e.prototype.loadMachine=function(t){for(var e=0,i=this.otherMenus;e<i.length;e++){var n=i[e];$(n.html()).remove()}this.otherMenus=r.Settings.machines[t].sidebar;for(var s=0,a=this.otherMenus;s<a.length;s++){var n=a[s];n.bind(this.node),n.render()}},e.prototype.buildFileManipulation=function(){var t=o.utils.create("input");t.classList.add("file_manip_btn"),t.type="button",t.value=s.Strings.SAVE,t.addEventListener("click",function(){var t="Hello, world!",e=new Blob([t],{type:"text/plain; charset=utf-8"});saveAs(e,"file.txt")}),this.fileManipulation.add(t);var e=o.utils.create("input");e.classList.add("file_manip_btn"),e.type="button",e.value=s.Strings.OPEN,e.addEventListener("click",function(){alert("Not yet implemented")}),this.fileManipulation.add(e)},e.prototype.buildMachineSelection=function(){var t=new a.Table(r.Settings.machineSelRows,r.Settings.machineSelColumns),e={},i=this;o.utils.foreach(r.Settings.machines,function(n,s){var a=o.utils.create("input");a.classList.add("machine_selection_btn"),a.type="button",a.value=s.name,a.disabled=n==r.Settings.currentMachine,a.addEventListener("click",function(){e[r.Settings.currentMachine].disabled=!1,e[n].disabled=!0,r.Settings.currentMachine=n,i.loadMachine(n)}),t.add(a),e[n]=a}),this.machineSelection.add(t.html()),this.loadMachine(r.Settings.currentMachine)},e}(n.Renderer);e.Sidebar=c}),define("interface/UI",["require","exports","Settings","Utils"],function(t,e,i,n){"use strict";var r=function(){function t(){for(var t=[],e=0;e<arguments.length;e++)t[e-0]=arguments[e];this.bindSidebar(t[0]),this.bindMain(t[1])}return t.prototype.render=function(){this.sidebarRenderer&&this.sidebarRenderer.render(),this.mainRenderer&&this.mainRenderer.render(),console.log("Interface ready.")},t.prototype.bindSidebar=function(t){t&&t.bind(n.utils.id(i.Settings.sidebarID)),this.sidebarRenderer=t},t.prototype.bindMain=function(t){t&&t.bind(n.utils.id(i.Settings.mainbarID)),this.mainRenderer=t},t}();e.UI=r}),define("main",["require","exports","interface/Mainbar","interface/Sidebar","interface/UI"],function(t,e,i,n,r){"use strict";$(document).ready(function(){var t=new r.UI(new n.Sidebar,new i.Mainbar);t.render()})});
