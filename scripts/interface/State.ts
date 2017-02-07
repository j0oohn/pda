/// <reference path="../defs/raphael.d.ts" />

import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {utils} from "../Utils"

export class State {
	constructor() {
		this.radius = Settings.stateRadius;
	}

	public setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public getPosition(): {x: number, y: number} {
		return {
			x: this.x,
			y: this.y
		};
	}

	public setName(name: string): void {
		this.name = name;
	}

	public setInitial(flag: boolean): void {
		this.initial = flag;
	}

	public isInitial(): boolean {
		return this.initial;
	}

	public setFinal(flag: boolean): void {
		this.final = flag;
	}

	public isFinal(): boolean {
		return this.final;
	}

	public highlight(): void {
		this.highlighted = true;
	}

	public dim(): void {
		this.highlighted = false;
	}

	private arrowParams(canvas?: RaphaelPaper): any[] {
		var result: any[] = (canvas) ? [canvas] : [];
		let length = 40;
		return result.concat([this.x - this.radius - length, this.y,
							  this.x - this.radius, this.y]);
	}

	private fillColor(): string {
		return this.highlighted ? Settings.stateHighlightFillColor
								: Settings.stateFillColor;
	}

	private strokeColor(): string {
		return this.highlighted ? Settings.stateHighlightStrokeColor
								: Settings.stateStrokeColor;
	}

	private strokeWidth(): number {
		return this.highlighted ? Settings.stateHighlightStrokeWidth
								: Settings.stateStrokeWidth;
	}

	private ringStrokeWidth(): number {
		return this.highlighted ? Settings.stateHighlightRingStrokeWidth
								: Settings.stateRingStrokeWidth;
	}

	private renderBody(canvas: RaphaelPaper): void {
		if (!this.body) {
			this.body = canvas.circle(this.x, this.y, this.radius);
			canvas.text(this.x, this.y, this.name).attr({
				"font-family": Settings.stateLabelFontFamily,
				"font-size": Settings.stateLabelFontSize
			});
		} else {
			this.body.attr({
				cx: this.x,
				cy: this.y
			});
		}

		this.body.attr("fill", this.fillColor());
		this.body.attr("stroke", this.strokeColor());
		this.body.attr("stroke-width", this.strokeWidth());
	}

	private renderInitialMark(canvas: RaphaelPaper): void {
		if (this.initial) {
			if (!this.arrow) {
				this.arrow = utils.line.apply(utils, this.arrowParams(canvas));
			} else {
				this.arrow.attr("path", utils.linePath.apply(utils, this.arrowParams()));
			}
		} else if (this.arrow) {
			this.arrow.remove();
			this.arrow = null;
		}
	}

	private renderFinalMark(canvas: RaphaelPaper): void {
		if (this.final) {
			if (!this.ring) {
				this.ring = canvas.circle(this.x, this.y, Settings.stateRingRadius);
			} else {
				this.ring.attr({
					cx: this.x,
					cy: this.y
				});
			}

			this.ring.attr("stroke", this.strokeColor());
			this.ring.attr("stroke-width", this.ringStrokeWidth());
		} else if (this.ring) {
			this.ring.remove();
			this.ring = null;
		}
	}

	public render(canvas: RaphaelPaper): void {
		this.renderBody(canvas);
		this.renderInitialMark(canvas);
		this.renderFinalMark(canvas);
	}

	public node(): RaphaelElement {
		return this.body;
	}

	public html(): SVGElement {
		if (this.body) {
			return this.body.node;
		}
		return null;
	}

	public drag(callback: (distSquared: number, event: any) => boolean): void {
		// TODO: find a new home for all these functions
		let self = this;
		let setPosition = function(x, y) {
			self.body.attr({
				cx: x,
				cy: y
			});

			if (self.ring) {
				self.ring.attr({
					cx: x,
					cy: y
				});
			}

			self.setPosition(x, y);
		};

		let maxTravelDistance;
		let begin = function(x, y, event) {
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			maxTravelDistance = 0;
			return null;
		};

		let move = function(dx, dy, x, y, event) {
			let trueDx = this.attr("cx") - this.ox;
			let trueDy = this.attr("cy") - this.oy;
			let distanceSquared = trueDx * trueDx + trueDy * trueDy;
			if (distanceSquared > maxTravelDistance) {
				maxTravelDistance = distanceSquared;
			}
			setPosition(this.ox + dx, this.oy + dy);
			return null;
		};

		let end = function(event) {
			let dx = this.attr("cx") - this.ox;
			let dy = this.attr("cy") - this.oy;
			setPosition(this.ox, this.oy);

			let accepted = callback.call(this, maxTravelDistance, event);
			if (accepted) {
				setPosition(this.ox + dx, this.oy + dy);
			}
			return null;
		};

		this.body.drag(move, begin, end);
	}

	private body: RaphaelElement = null;
	private ring: RaphaelElement = null;
	private arrow: RaphaelElement = null;
	private x: number;
	private y: number;
	private radius: number;
	private name: string = "";
	private initial: boolean = false;
	private final: boolean = false;
	private highlighted: boolean = false;
}