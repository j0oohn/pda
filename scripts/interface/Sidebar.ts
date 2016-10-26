/// <reference path="../defs/filesaver.d.ts" />

import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Strings} from "../Settings"
import {System} from "../System"
import {Table} from "./Table"
import {utils} from "../Utils"

export class Sidebar extends Renderer {
	constructor() {
		super();
		this.build();
	}

	public build(): void {
		this.languageSelection = new Menu(Strings.SELECT_LANGUAGE);
		this.fileManipulation = new Menu(Strings.FILE_MENUBAR);
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);
		this.otherMenus = [];

		this.buildLanguageSelection();
		this.buildFileManipulation();
		this.buildMachineSelection();

		if (this.node) {
			this.onBind();
		}
	}

	protected onBind(): void {
		this.languageSelection.bind(this.node);
		this.fileManipulation.bind(this.node);
		this.machineSelection.bind(this.node);
		for (let menu of this.otherMenus) {
			menu.bind(this.node);
		}
	}

	protected onRender(): void {
		this.languageSelection.render();
		this.fileManipulation.render();
		this.machineSelection.render();
		for (let menu of this.otherMenus) {
			menu.render();
		}
	}

	private loadMachine(machine: Settings.Machine): void {
		for (let menu of this.otherMenus) {
			$(menu.html()).remove();
		}

		this.otherMenus = Settings.machines[machine].sidebar;
		for (let menu of this.otherMenus) {
			menu.bind(this.node);
		}
	}

	private buildLanguageSelection(): void {
		let select = <HTMLSelectElement> utils.create("select");
		let languages = Settings.languages;
		let i = 0;
		let selectedIndex = -1;
		utils.foreach(languages, function(name, obj) {
			let option = <HTMLOptionElement> utils.create("option");
			option.value = name;
			option.innerHTML = name;
			select.appendChild(option);
			if (obj == Settings.language) {
				selectedIndex = i;
			}
			i++;
		});
		select.selectedIndex = selectedIndex;
		this.languageSelection.clear();
		this.languageSelection.add(select);
		this.languageSelection.toggle();

		select.addEventListener("change", function(e) {
			let name = this.options[this.selectedIndex].value;
			let confirmation = confirm(Strings.CHANGE_LANGUAGE.replace("%", name));
			if (confirmation) {
				System.changeLanguage(languages[name]);
			}
		});
	}

	private buildFileManipulation(): void {
		this.fileManipulation.clear();
		let save = <HTMLInputElement> utils.create("input");
		save.classList.add("file_manip_btn");
		save.type = "button";
		save.value = Strings.SAVE;
		save.addEventListener("click", function() {
			// TODO
		    let content = "Hello, world!";
		    let blob = new Blob([content], {type: "text/plain; charset=utf-8"});
		    saveAs(blob, "file.txt");
		});
		utils.bindShortcut(Settings.shortcuts.save, function() {
			save.click();
		});
		this.fileManipulation.add(save);

		let open = <HTMLInputElement> utils.create("input");
		open.classList.add("file_manip_btn");
		open.type = "button";
		open.value = Strings.OPEN;
		open.addEventListener("click", function() {
			// TODO
			alert("Not yet implemented");
		});
		utils.bindShortcut(Settings.shortcuts.open, function() {
			open.click();
		});
		this.fileManipulation.add(open);
	}

	private buildMachineSelection(): void {
		let table = new Table(Settings.machineSelRows, Settings.machineSelColumns);
		let machineButtonMapping = {};
		let self = this;
		utils.foreach(Settings.machines, function(type, props) {
			let button = <HTMLInputElement> utils.create("input");
			button.classList.add("machine_selection_btn");
			button.type = "button";
			button.value = props.name;
			button.disabled = (type == Settings.currentMachine);
			button.addEventListener("click", function() {
				machineButtonMapping[Settings.currentMachine].disabled = false;
				machineButtonMapping[type].disabled = true;
				Settings.currentMachine = type;
				self.loadMachine(type);
			});
			table.add(button);
			machineButtonMapping[type] = button;
		});

		this.machineSelection.clear();
		this.machineSelection.add(table.html());
		this.loadMachine(Settings.currentMachine);
	}

	private languageSelection: Menu;
	private fileManipulation: Menu;
	private machineSelection: Menu;
	private otherMenus: Menu[];
}
