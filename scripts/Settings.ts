import * as lang from "./lists/LanguageList"
import * as automata from "./lists/MachineList"
import * as controllers from "./lists/ControllerList"

// import {Regex} from "./misc/Regex"
import {Controller} from "./controllers/Controller"
import {FA} from "./machines/FA"
import {Initializer} from "./Initializer"
import {Renderer} from "./interface/Renderer"
import {AutomatonRenderer} from "./interface/AutomatonRenderer"
import {utils} from "./Utils"

interface MachineTraits {
	name: string;
	sidebar: any[];
	controller: Controller;
}

// TODO: make it more flexible to add/remove machine types. See how
// the internationalization was implemented for reference.
export namespace Settings {
	export const sidebarID = "sidebar";
	export const mainbarID = "mainbar";

	export const disabledButtonClass = "disabled";

	export const menuSlideInterval = 300;
	export const promptSlideInterval = 200;
	export const machineSelRows = 3;
	export const machineSelColumns = 1;

	export const stateRadius = 32;
	export const stateRingRadius = 27;
	export const stateDragTolerance = 50;
	export const stateFillColor = "white";
	export const stateStrokeColor = "black";
	export const stateStrokeWidth = 1;
	export const stateRingStrokeWidth = 1;

	export const stateLabelFontFamily = "arial";
	export const stateLabelFontSize = 20;
	export const stateLabelFontColor = "black";

	export const stateInitialMarkLength = 40;
	export const stateInitialMarkHeadLength = 15;
	export const stateInitialMarkAngle = utils.toRadians(20);
	export const stateInitialMarkColor = "blue";
	export const stateInitialMarkThickness = 2;

	export const stateHighlightFillColor = "#FFD574";
	export const stateHighlightStrokeColor = "red";
	export const stateHighlightStrokeWidth = 3;
	export const stateHighlightRingStrokeWidth = 2;

	export const edgeArrowLength = 30;
	export const edgeArrowAngle = utils.toRadians(30);

	export const edgeTextFontFamily = "arial";
	export const edgeTextFontSize = 20;
	export const edgeTextFontColor = "black";

	export const shortcuts = {
		save: ["ctrl", "S"],
		open: ["ctrl", "O"],
		toggleInitial: ["I"],
		toggleFinal: ["F"],
		dimState: ["ESC"],
		deleteState: ["DELETE"],
		clearMachine: ["C"],
		left: ["LEFT"],
		right: ["RIGHT"],
		up: ["UP"],
		down: ["DOWN"],
		undo: ["ctrl", "Z"],
	};

	export const languages = lang;

	export const Machine = automata.Machine;

	// TODO: maybe using a cookie to get the default language is a good idea
	export var language = lang.english;

	// The current machine being operated on. Defaults to the first machine
	// of the Machine enum (unless changed, that means FA)
	export var currentMachine = 0;

	export var machines: {[m: number]: MachineTraits} = {};

	export var controllerMap: {[m: number]: Controller} = {};

	export var automatonRenderer: AutomatonRenderer = null;

	export function controller(): Controller {
		return this.machines[this.currentMachine].controller;
	}

	let firstUpdate = true;
	// TODO: check if we only need to instantiate the controllers once or
	// if it's needed everytime (like with the sidebar)
	export function update(): void {
		if (firstUpdate) {
			for (let index in Machine) {
				if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
					controllerMap[index] = new controllers[Machine[index] + "Controller"]();
				}
			}
		}

		let machineList: typeof machines = {};
		for (let index in Machine) {
			if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
				machineList[index] = {
					name: language.strings[Machine[index]],
					sidebar: [],
					controller: controllerMap[index]
				};
			}
		}

		utils.foreach(machineList, function(key, value) {
			machines[key] = value;
			// if (firstUpdate) {
			// 	machines[key] = value;
			// } else {
			// 	machines[key].name = value.name;
			// }
		});

		firstUpdate = false;
		Initializer.exec();
	}

	export function changeLanguage(newLanguage): void {
		language = newLanguage;
		Strings = language.strings;
		update();
	}
}

export var Strings = Settings.language.strings;

Settings.update();
// Initializer.exec();
