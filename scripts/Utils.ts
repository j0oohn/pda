/// <reference path="defs/jQuery.d.ts" />

import {Keyboard} from "./Keyboard"
import {System} from "./System"

export interface Point {
	x: number;
	y: number;
}

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
				// TODO: handle other events
				if (key == "click") {
					result.addEventListener("click", value);
				} else {
					result[key] = value;
				}
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
		if ("which" in event) { // Gecko (Firefox), WebKit (Chrome/Safari), Opera
			return event.which == 3;
		} else if ("button" in event) { // IE, Opera
			return event.button == 2;
		}
		// Unknown browser
		console.log("[WARNING] Right click events will not work properly in this browser.");
		return false;
	}

	export function linePath(x1: number, y1: number, x2: number, y2: number): string {
		return "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
	}

	export function line(canvas: RaphaelPaper, x1: number, y1: number, x2: number, y2: number) {
		var line = canvas.path(this.linePath(x1, y1, x2, y2));
		// TODO: make the stroke color flexible
		line.attr("stroke", "black");
		return line;
	}

	export function toRadians(angle: number): number {
		return angle * Math.PI / 180;
	}

	export function toDegrees(angle: number): number {
		return angle * 180 / Math.PI;
	}

	// Rotates a point around an axis by a given angle.
	export function rotatePoint(point: Point,
								center: Point,
								angle: number): Point {
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let copy = {
			x: point.x,
			y: point.y
		}
		copy.x -= center.x;
		copy.y -= center.y;
		let result = {
			x: copy.x * cos - copy.y * sin,
			y: copy.x * sin + copy.y * cos
		};

		return {
			x: result.x + center.x,
			y: result.y + center.y
		};
	}

	// Checks if two points are equal. If either point is null,
	// returns false.
	export function samePoint(p1: Point, p2: Point) {
		return p1 && p2 && p1.x == p2.x && p1.y == p2.y;
	}

	// Binds a keyboard shortcut to the page.
	export function bindShortcut(keys: string[], callback: () => void, group?: string): void {
		System.addKeyObserver(keys, callback, group);
	}

	// Disables all shortcuts in a given shortcut group.
	export function lockShortcutGroup(group: string): void {
		System.lockShortcutGroup(group);
	}

	// Enables all shortcuts in a given shortcut group.
	export function unlockShortcutGroup(group: string): void {
		System.unlockShortcutGroup(group);
	}

	// Calls a function asynchronously
	export function async(callback: () => void): void {
		setTimeout(callback, 0);
	}

	// Returns a string representation of a keyboard shortcut
	export function printShortcut(keys: string[]): string {
		return keys.join(" ").toLowerCase();
	}
}
