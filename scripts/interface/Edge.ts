import {Settings} from "../Settings"
import {State} from "./State"
import {Point, utils} from "../Utils"

export class Edge {
	public setOrigin(origin: State): void {
		this.origin = origin;
	}

	public getOrigin(): State {
		return this.origin;
	}

	public setTarget(target: State): void {
		this.target = target;
	}

	public getTarget(): State {
		return this.target;
	}

	public setVirtualTarget(target: Point): void {
		this.virtualTarget = target;
	}

	public addText(text: string): void {
		this.textList.push(text);
	}

	public getTextList(): string[] {
		return this.textList;
	}

	public addData(data: string[]): void {
		this.dataList.push(data);
	}

	public getDataList(): string[][] {
		return this.dataList;
	}

	public setCurveFlag(flag: boolean): void {
		this.forcedRender = this.forcedRender || (this.curved != flag);
		this.curved = flag;
	}

	public isCurved(): boolean {
		return this.curved;
	}

	public removed(): boolean {
		return this.deleted;
	}

	public addClickHandler(callback: () => void): void {
		let self = this;
		for (let elem of this.body) {
			elem.click(function(e) {
				// Only call the callback if this edge is visible
				// (in particular, this disables events for removed edges).
				// TODO: currently removed this restriction, is it necessary?
				// if (self.body.length > 0) {
					callback.call(self);
				// }
			});
		}
	}

	public remove(): void {
		for (let elem of this.body) {
			elem.remove();
		}
		this.body = [];

		for (let elem of this.head) {
			elem.remove();
		}
		this.head = [];

		if (this.textContainer) {
			this.textContainer.remove();
			this.textContainer = null;
		}

		this.deleted = true;
	}

	public setCustomColor(color: string): void {
		this.color = color;
	}

	public removeCustomColor(): void {
		this.color = this.defaultColor;
	}

	public render(canvas: RaphaelPaper): void {
		let preservedOrigin = this.origin
						   && utils.samePoint(this.prevOriginPosition,
											  this.origin.getPosition());
		let preservedTarget = this.target
						   && utils.samePoint(this.prevTargetPosition,
											  this.target.getPosition());

		// Don't re-render this edge if neither the origin nor the target
		// states have moved since we last rendered this edge, unless
		// the forced re-render is active.
		if (!preservedOrigin || !preservedTarget || this.forcedRender) {
			this.renderBody(canvas);
			this.renderHead(canvas);

			if (this.origin) {
				this.prevOriginPosition = this.origin.getPosition();
			}

			if (this.target) {
				this.prevTargetPosition = this.target.getPosition();
			}

			this.forcedRender = false;
		}

		for (let elem of this.body) {
			elem.attr("stroke", this.strokeColor());
		}

		for (let elem of this.head) {
			elem.attr("stroke", this.strokeColor());
		}

		// Only re-renders this edge's text if this edge is
		// complete (i.e it already has a target state)
		if (this.target) {
			this.renderText(canvas);
		}
	}

	private strokeColor(): string {
		return this.color;
	}

	private stateCenterOffsets(dx: number, dy: number): Point {
		let angle = Math.atan2(dy, dx);
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let offsetX = Settings.stateRadius * cos;
		let offsetY = Settings.stateRadius * sin;
		return {
			x: offsetX,
			y: offsetY
		};
	}

	private renderBody(canvas: RaphaelPaper): void {
		let origin = this.origin.getPosition();
		let target: typeof origin;
		if (!this.target) {
			if (this.virtualTarget) {
				target = {
					x: this.virtualTarget.x,
					y: this.virtualTarget.y
				};
				let dx = target.x - origin.x;
				let dy = target.y - origin.y;
				// The offsets are necessary to ensure that mouse events are
				// still correctly fired, since not using them makes the edge
				// appear directly below the cursor.
				target.x = origin.x + dx * 0.98;
				target.y = origin.y + dy * 0.98;
			} else {
				target = origin;
			}
		} else {
			target = this.target.getPosition();
		}

		let dx = target.x - origin.x;
		let dy = target.y - origin.y;
		let radius = Settings.stateRadius;
		let offsets = this.stateCenterOffsets(dx, dy);
		// Makes the edge start at the border of the state rather than
		// at its center, unless the virtual target is inside the state.
		// That condition makes it easier to create loops.
		if (dx * dx + dy * dy > radius * radius) {
			origin.x += offsets.x;
			origin.y += offsets.y;
		}

		if (this.target) {
			// Adjusts the edge so that it points to the border of the state
			// rather than its center.
			target.x -= offsets.x;
			target.y -= offsets.y;
		}

		// TODO: handle cases where two connected states are very close to each other
		if (this.origin == this.target) {
			this.loop(canvas);
		} else if (this.isCurved()) {
			this.curve(canvas, origin, target);
		} else {
			this.normal(canvas, origin, target);
		}
	}

	// Adjusts the length of the this.body array so that it is equal to
	// a given value. Returns a flag indicating if any change was made
	// to this.body.
	private adjustBodyLength(canvas: RaphaelPaper, length: number): boolean {
		if (this.body.length == length) {
			return false;
		}

		while (this.body.length > length) {
			this.body[this.body.length - 1].remove();
			this.body.pop();
		}

		while (this.body.length < length) {
			this.body.push(utils.line(canvas, 0, 0, 0, 0));
		}

		return true;
	}

	// Renders a loop-style body.
	private loop(canvas: RaphaelPaper): void {
		let radius = Settings.stateRadius;
		let pos = this.origin.getPosition();
		if (this.adjustBodyLength(canvas, 4)) {
			for (let elem of this.body) {
				elem.attr("stroke-width", Settings.edgeArrowThickness);
			}
		}

		this.body[0].attr("path", utils.linePath(
			pos.x + radius, pos.y,
			pos.x + 2 * radius, pos.y
		));
		this.body[1].attr("path", utils.linePath(
			pos.x + 2 * radius, pos.y,
			pos.x + 2 * radius, pos.y - 2 * radius
		));
		this.body[2].attr("path", utils.linePath(
			pos.x + 2 * radius, pos.y - 2 * radius,
			pos.x, pos.y - 2 * radius
		));
		this.body[3].attr("path", utils.linePath(
			pos.x, pos.y - 2 * radius,
			pos.x, pos.y - radius
		));
	}

	// Renders a curved body.
	private curve(canvas: RaphaelPaper, origin: Point, target: Point): void {
		let dx = target.x - origin.x;
		let dy = target.y - origin.y;

		let hypot = Math.sqrt(dx * dx + dy * dy);

		// A normalized vector that is perpendicular to the
		// line joining the origin and the target.
		let perpVector: Point = {
			x: dy / hypot,
			y: -dx / hypot
		};

		let distance = 30;
		let offsets = {
			x: distance * perpVector.x,
			y: distance * perpVector.y
		};

		if (this.adjustBodyLength(canvas, 3)) {
			for (let elem of this.body) {
				elem.attr("stroke-width", Settings.edgeArrowThickness);
			}
		}

		this.body[0].attr("path", utils.linePath(
			origin.x, origin.y,
			origin.x + offsets.x + dx * 0.125, origin.y + offsets.y + dy * 0.125
		));

		this.body[1].attr("path", utils.linePath(
			origin.x + offsets.x + dx * 0.125, origin.y + offsets.y + dy * 0.125,
			origin.x + offsets.x + dx * 0.875, origin.y + offsets.y + dy * 0.875
		));

		this.body[2].attr("path", utils.linePath(
			origin.x + offsets.x + dx * 0.875, origin.y + offsets.y + dy * 0.875,
			target.x, target.y
		));
	}

	// Renders a normal body (i.e a straight line)
	private normal(canvas: RaphaelPaper, origin: Point, target: Point): void {
		if (this.adjustBodyLength(canvas, 1)) {
			for (let elem of this.body) {
				elem.attr("stroke-width", Settings.edgeArrowThickness);
			}
		}
		this.body[0].attr("path", utils.linePath(
			origin.x, origin.y,
			target.x, target.y
		));
	}

	private renderHead(canvas: RaphaelPaper): void {
		if (!this.target) {
			// Don't render the head of the arrow if there's no target
			// TODO: change this behavior?
			return;
		}

		let origin: Point;
		let target: Point;
		let dx: number;
		let dy: number;

		if (this.origin == this.target) {
			// Loop case
			let pos = this.origin.getPosition();
			let radius = Settings.stateRadius;
			origin = {
				x: pos.x,
				y: pos.y - 2 * radius
			};
			target = {
				x: pos.x,
				y: pos.y - radius
			};

			dx = 0;
			dy = radius;
		} else if (this.isCurved()) {
			let path = this.body[2].attr("path");
			origin = {
				x: path[0][1],
				y: path[0][2],
			};
			target = {
				x: path[1][1],
				y: path[1][2]
			};

			dx = target.x - origin.x;
			dy = target.y - origin.y;
		} else {
			// Non-loop case
			origin = this.origin.getPosition();
			target = this.target.getPosition();

			dx = target.x - origin.x;
			dy = target.y - origin.y;
			let offsets = this.stateCenterOffsets(dx, dy);
			target.x -= offsets.x;
			target.y -= offsets.y;
			dx -= offsets.x;
			dy -= offsets.y;
		}

		// Arrow head
		let arrowLength = Settings.edgeArrowLength;
		let alpha = Settings.edgeArrowAngle;
		let edgeLength = Math.sqrt(dx * dx + dy * dy);
		let u = 1 - arrowLength / edgeLength;
		let ref = {
			x: origin.x + u * dx,
			y: origin.y + u * dy
		};


		// The reference points of the arrow head
		let p1 = utils.rotatePoint(ref, target, alpha);
		let p2 = utils.rotatePoint(ref, target, -alpha);

		if (!this.head.length) {
			this.head.push(utils.line(canvas, 0, 0, 0, 0));
			this.head.push(utils.line(canvas, 0, 0, 0, 0));

			for (let elem of this.head) {
				elem.attr("stroke-width", Settings.edgeArrowThickness);
			}
		}

		this.head[0].attr("path", utils.linePath(
			p1.x, p1.y,
			target.x, target.y
		));

		this.head[1].attr("path", utils.linePath(
			p2.x, p2.y,
			target.x, target.y
		));
	}

	private preparedText(): string {
		return this.textList.join("\n");
	}

	private renderText(canvas: RaphaelPaper): void {
		// We can assume that there's a target state, since
		// otherwise we wouldn't be rendering the text.
		let origin = this.origin.getPosition();
		let target = this.target.getPosition();
		let x: number;
		let y: number;

		if (this.origin == this.target) {
			// Loop case
			let radius = Settings.stateRadius;
			x = origin.x + radius;
			y = origin.y - 2 * radius;
		} else if (this.isCurved()) {
			// Curved case
			let path = this.body[1].attr("path");
			let x1 = path[0][1];
			let y1 = path[0][2];
			let x2 = path[1][1];
			let y2 = path[1][2];
			x = (x1 + x2) / 2;
			y = (y1 + y2) / 2;
		} else {
			// Normal case
			x = (origin.x + target.x) / 2;
			y = (origin.y + target.y) / 2;
		}

		if (!this.textContainer) {
			this.textContainer = canvas.text(x, y, this.preparedText());
			this.textContainer.attr("font-family", Settings.edgeTextFontFamily);
			this.textContainer.attr("font-size", Settings.edgeTextFontSize);
			this.textContainer.attr("stroke", Settings.edgeTextFontColor);
			this.textContainer.attr("fill", Settings.edgeTextFontColor);
		} else {
			this.textContainer.attr("x", x);
			this.textContainer.attr("y", y);
			this.textContainer.attr("text", this.preparedText());
			this.textContainer.transform("");
		}

		let angleRad = Math.atan2(target.y - origin.y, target.x - origin.x);
		let angle = utils.toDegrees(angleRad);

		if (angle < -90 || angle > 90) {
			angle = (angle + 180) % 360;
		}

		this.textContainer.rotate(angle);

		y -= Settings.edgeTextFontSize * .6;
		y -= Settings.edgeTextFontSize * (this.textList.length - 1) * .7;
		this.textContainer.attr("y", y);
	}

	// The state that this edge comes from
	private origin: State = null;

	// The state that this edge points to
	private target: State = null;

	// The position where the origin state was when we last rendered
	// this edge. Used to optimize rendering when both the origin and
	// the target didn't move since the previous rendering.
	private prevOriginPosition: Point = null;

	// The position where the target state was when we last rendered
	// this edge. See prevOriginPosition for more context.
	private prevTargetPosition: Point = null;

	// If this edge is not yet completed, it might point to
	// a position in space rather than a state
	private virtualTarget: Point = null;

	// A list of texts written in this edge
	private textList: string[] = [];

	// A list of data lists used by the controllers to
	// precisely define this transition
	private dataList: string[][] = [];

	// Is this a curved edge?
	private curved: boolean = false;

	// Should this edge be re-rendered regardless if its position changed?
	private forcedRender: boolean = false;

	// Was this edge previously removed?
	private deleted: boolean = false;

	// The color-related properties of this edge.
	private defaultColor = Settings.edgeStrokeColor;
	private color: string = this.defaultColor;

	private body: RaphaelElement[] = [];
	private head: RaphaelElement[] = [];
	private textContainer: RaphaelElement = null;
}
