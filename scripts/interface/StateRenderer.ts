import {Edge} from "./Edge"
import {Settings, Strings} from "../Settings"
import {State} from "./State"
import {Point, utils} from "../Utils"

export class StateRenderer {
	constructor(canvas:  RaphaelPaper, node: Element) {
		this.canvas = canvas;
		this.node = node;
	}

	public render(): void {
		let state = new State();
		state.setPosition(100, 100);
		this.stateList.push(state);

		// let a = new State();
		// a.setPosition(140, 230);
		// this.stateList.push(a);

		// let b = new State();
		// b.setPosition(70, 250);
		// this.stateList.push(b);

		// let c = new State();
		// c.setPosition(384, 70);
		// this.stateList.push(c);

		// let s = new State();
		// s.setPosition(300, 100);
		// s.setFinal(true);
		// this.stateList.push(s);

		// let edge = new Edge();
		// edge.setOrigin(state);
		// edge.setTarget(s);
		// edge.render(this.canvas);
		// this.edgeList.push(edge);

		// this.selectState(state);

		// TODO: separate left click/right click dragging handlers
		for (let state of this.stateList) {
			state.render(this.canvas);
			this.bindStateEvents(state);
		}

		this.bindShortcuts();

		let self = this;
		$(this.node).dblclick(function(e) {
			let state = new State();
			state.setPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			self.stateList.push(state);
			self.selectState(state);
			self.bindStateEvents(state);
		});

		$(this.node).contextmenu(function(e) {
			e.preventDefault();
			return false;
		});

		$(this.node).mousemove(function(e) {
			if (self.edgeMode) {
				self.adjustEdge(this, e);
			}
		});
	}

	private selectState(state: State) {
		if (this.highlightedState) {
			this.highlightedState.dim();
			this.highlightedState.render(this.canvas);
		}
		state.highlight();
		this.highlightedState = state;
		state.render(this.canvas);
	}

	private bindStateEvents(state: State) {
		// TODO: separate left click/right click dragging handlers
		let canvas = this.canvas;
		let self = this;
		state.drag(function() {
			self.updateEdges();
		}, function(distanceSquared, event) {
			if (distanceSquared <= Settings.stateDragTolerance) {
				if (self.edgeMode) {
					self.finishEdge(state);
				} else if (utils.isRightClick(event)) {
					self.beginEdge(state);
				} else if (state == self.highlightedState) {
					state.dim();
					self.highlightedState = null;
					state.render(canvas);
				} else {
					self.selectState(state);
				}
				return false;
			}
			return true;
		});
	}

	private beginEdge(state: State): void {
		this.edgeMode = true;
		this.currentEdge = new Edge();
		this.currentEdge.setOrigin(state);
	}

	private finishEdge(state: State): void {
		this.edgeMode = false;
		this.currentEdge.setTarget(state);
		this.currentEdge.render(this.canvas);
		this.edgeList.push(this.currentEdge);
		this.currentEdge = null;
	}

	private adjustEdge(elem: HTMLElement, e): void {
		let target = {
			x: e.pageX - elem.offsetLeft,
			y: e.pageY - elem.offsetTop
		};
		this.currentEdge.setVirtualTarget(target);
		this.currentEdge.render(this.canvas);
	}

	private updateEdges(): void {
		for (let edge of this.edgeList) {
			edge.render(this.canvas);
		}
	}

	private clearSelection(): void {
		this.highlightedState = null;
		if (this.edgeMode) {
			this.edgeMode = false;
			this.currentEdge.remove();
			this.currentEdge = null;
		}
	}

	private bindShortcuts(): void {
		let canvas = this.canvas;
		let self = this;
		utils.bindShortcut(Settings.shortcuts.toggleInitial, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				if (highlightedState == self.initialState) {
					highlightedState.setInitial(false);
					self.initialState = null;
				} else {
					if (self.initialState) {
						self.initialState.setInitial(false);
						self.initialState.render(canvas);
					}

					highlightedState.setInitial(true);
					self.initialState = highlightedState;
				}

				highlightedState.render(canvas);
			}
		});

		utils.bindShortcut(Settings.shortcuts.toggleFinal, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				highlightedState.setFinal(!highlightedState.isFinal());
				highlightedState.render(canvas);
			}
		});

		utils.bindShortcut(Settings.shortcuts.dimState, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				highlightedState.dim();
				highlightedState.render(canvas);
				self.highlightedState = null;
			}
		});

		utils.bindShortcut(Settings.shortcuts.deleteState, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				for (let i = 0; i < self.edgeList.length; i++) {
					let edge = self.edgeList[i];
					let origin = edge.getOrigin();
					let target = edge.getTarget();
					if (origin == highlightedState || target == highlightedState) {
						edge.remove();
						self.edgeList.splice(i, 1);
						i--;
					}
				}
				highlightedState.remove();

				let states = self.stateList;
				for (let i = 0; i < states.length; i++) {
					if (states[i] == highlightedState) {
						states.splice(i, 1);
						break;
					}
				}

				self.clearSelection();
			}
		});

		utils.bindShortcut(Settings.shortcuts.clearMachine, function() {
			let confirmation = confirm(Strings.CLEAR_CONFIRMATION);
			if (confirmation) {
				self.clearSelection();

				for (let edge of self.edgeList) {
					edge.remove();
				}
				self.edgeList = [];

				for (let state of self.stateList) {
					state.remove();
				}
				self.stateList = [];
			}
		});

		// TODO: try to reduce the redundancy
		utils.bindShortcut(Settings.shortcuts.left, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().x < highlighted.getPosition().x;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dy = Math.abs(position.y - reference.y);
				let targetPosition = currBest.getPosition();
				let targetDy = Math.abs(targetPosition.y - reference.y);

				let threshold = self.selectionThreshold();
				if (dy < threshold) {
					return targetDy >= threshold || position.x > targetPosition.x;
				}

				return dy < targetDy;
			});
		});

		utils.bindShortcut(Settings.shortcuts.right, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().x > highlighted.getPosition().x;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dy = Math.abs(position.y - reference.y);
				let targetPosition = currBest.getPosition();
				let targetDy = Math.abs(targetPosition.y - reference.y);

				let threshold = self.selectionThreshold();
				if (dy < threshold) {
					return targetDy >= threshold || position.x < targetPosition.x;
				}

				return dy < targetDy;
			});
		});

		utils.bindShortcut(Settings.shortcuts.up, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().y < highlighted.getPosition().y;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dx = Math.abs(position.x - reference.x);
				let targetPosition = currBest.getPosition();
				let targetDx = Math.abs(targetPosition.x - reference.x);

				let threshold = self.selectionThreshold();
				if (dx < threshold) {
					return targetDx >= threshold || position.y > targetPosition.y;
				}

				return dx < targetDx;
			});
		});

		utils.bindShortcut(Settings.shortcuts.down, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().y > highlighted.getPosition().y;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dx = Math.abs(position.x - reference.x);
				let targetPosition = currBest.getPosition();
				let targetDx = Math.abs(targetPosition.x - reference.x);

				let threshold = self.selectionThreshold();
				if (dx < self.selectionThreshold()) {
					return targetDx >= threshold || position.y < targetPosition.y;
				}

				return dx < targetDx;
			});
		});

		utils.bindShortcut(Settings.shortcuts.undo, function() {
			// TODO
			alert("TODO: undo");
		});
	}

	private selectionThreshold(): number {
		return 2 * Settings.stateRadius;
	}

	private moveStateSelection(isViable: (attempt: State, highlighted: State) => boolean,
				isBetterCandidate: (attempt: State, currBest: State,
									highlighted: State) => boolean): void {
		let highlightedState = this.highlightedState;
		if (highlightedState) {
			let target: State = null;
			for (let state of this.stateList) {
				if (isViable(state, highlightedState)) {
					if (isBetterCandidate(state, target, highlightedState)) {
						target = state;
					}
				}
			}

			if (target) {
				this.selectState(target);
			}
		}
	}

	private canvas: RaphaelPaper = null;
	private node: Element = null;
	private stateList: State[] = [];
	// TODO: find a better data structure than a simple array
	private edgeList: Edge[] = [];
	private highlightedState: State = null;
	private initialState: State = null;
	private edgeMode: boolean = false;
	private currentEdge: Edge = null;
}
