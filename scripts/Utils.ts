import {System} from "./System"

export namespace utils {
	export function select(selector: string): Element {
		return document.querySelector(selector);
	}

	export function id(selector: string): Element {
		return select("#" + selector);
	}

	export function create(tag: string, props?: Object): Element {
		let result = document.createElement(tag);
		if (props) {
			this.foreach(props, function(key, value) {
				result[key] = value;
			});
		}
		return result;
	}

	export function foreach(obj: Object, callback): void {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (callback(i, obj[i]) === false) {
					break;
				}
			}
		}
	}

	export function isRightClick(event: any): boolean {
		if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome), Opera
			return event.which == 3;
		} else if ("button" in event) { // IE, Opera
			return event.button == 2;
		}
		// Unknown browser
		console.log("[WARNING] Right click events will not work properly in this browser.");
		return false;
	}

	export function linePath(x1, y1, x2, y2) {
		return "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
	}

	export function line(canvas, x1, y1, x2, y2) {
		var line = canvas.path(this.linePath(x1, y1, x2, y2));
		// TODO: make the stroke color flexible
		line.attr("stroke", "black");
		return line;
	}

	export function toRadians(angle) {
		return angle * Math.PI / 180;
	}

	export function bindShortcut(keys: string[], callback: () => void): void {
		System.addKeyObserver(keys, callback);
	}
}