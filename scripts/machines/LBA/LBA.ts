import {Queue} from "../../datastructures/Queue"
import {UnorderedSet} from "../../datastructures/UnorderedSet"
import {utils} from "../../Utils"

type State = string;
type Index = number;
type Alphabet = {[i: string]: number};

enum Direction {
	LEFT, RIGHT
}

interface InternalTransitionInformation {
	state: Index,
	tapeSymbol: string,
	direction: Direction
}

export interface TransitionInformation {
	state: State,
	tapeSymbol: string,
	direction: Direction
}

export class LBA {
	// Adds a state to this LBA, marking it as the initial state
	// if there are no other states in this LBA.
	public addState(name: State): Index {
		this.stateList.push(name);
		// Cannot use this.numStates() here because
		// removed states are kept in the list
		let index = this.realNumStates() - 1;
		this.transitions[index] = {};
		if (this.initialState == -1) {
			this.initialState = index;
			this.reset();
		}
		return index;
	}

	// Removes a state from this LBA.
	public removeState(index: Index): void {
		let self = this;
		utils.foreach(this.transitions, function(originIndex, transitions) {
			let origin = parseInt(originIndex);
			utils.foreach(transitions, function(input) {
				if (transitions[input].state == index) {
					self.uncheckedRemoveTransition(origin, input);
				}

				if (origin == index) {
					self.uncheckedRemoveTransition(index, input);
				}
			});
		});

		delete this.transitions[index];

		if (this.initialState == index) {
			this.unsetInitialState();
		}

		this.finalStates.erase(index);

		this.stateList[index] = undefined;
		this.numRemovedStates++;
	}

	// Renames a state of this LBA.
	public renameState(index: Index, newName: State): void {
		this.stateList[index] = newName;
	}

	// Adds a transition to this LBA.
	public addTransition(source: Index, target: Index, data: string[]): void {
		let transitions = this.transitions[source];
		let input = data[0];
		let write = data[1];
		let direction = this.plainTextToDirection(data[2]);

		transitions[input] = {
			state: target,
			tapeSymbol: write,
			direction: direction
		};

		if (this.isInputSymbol(input)) {
			this.addInputSymbol(input);
		}

		if (this.isInputSymbol(write)) {
			this.addInputSymbol(write);
		}

		this.addTapeSymbol(input);
		this.addTapeSymbol(write);
	}

	// Removes a transition from this LBA.
	public removeTransition(source: Index, target: Index, data: string[]): void {
		let transitions = this.transitions[source];
		let input = data[0];
		let write = data[1];
		let direction = this.plainTextToDirection(data[2]);

		if (transitions.hasOwnProperty(input)) {
			let properties = transitions[input];
			let matches = (properties.state == target);
			matches = matches && (properties.tapeSymbol == write);
			matches = matches && (properties.direction == direction);

			if (matches) {
				this.uncheckedRemoveTransition(source, input);
			}
		}
	}

	private uncheckedRemoveTransition(source: Index, input: string): void {
		let transitions = this.transitions[source];
		let tapeSymbol = transitions[input].tapeSymbol;
		delete transitions[input];

		if (this.isInputSymbol(input)) {
			this.removeInputSymbol(input);
		}

		if (this.isInputSymbol(tapeSymbol)) {
			this.removeInputSymbol(tapeSymbol);
		}

		this.removeTapeSymbol(input);
		this.removeTapeSymbol(tapeSymbol);
	}

	// Sets the initial state of this LBA.
	public setInitialState(index: Index): void {
		if (index < this.realNumStates()) {
			this.initialState = index;
		}
	}

	// Unsets the initial state of this LBA.
	public unsetInitialState(): void {
		this.initialState = -1;
	}

	// Returns the name of the initial state.
	public getInitialState(): State|undefined {
		return this.stateList[this.initialState];
	}

	// Marks a state as final.
	public addAcceptingState(index: Index): void {
		this.finalStates.insert(index);
	}

	// Marks a state as non-final.
	public removeAcceptingState(index: Index): void {
		this.finalStates.erase(index);
	}

	// Returns all accepting states
	public getAcceptingStates(): State[] {
		let result: State[] = [];
		let self = this;
		this.finalStates.forEach(function(index) {
			result.push(self.stateList[index]!);
		});
		return result;
	}

	// Returns the current state of this LBA.
	public getCurrentState(): State|undefined {
		if (this.currentState === null) {
			return undefined;
		}

		return this.stateList[this.currentState];
	}

	// Returns a list containing all the states of this LBA.
	public getStates(): State[] {
		return (<State[]> this.stateList).filter(function(value) {
			return value !== undefined;
		});
	}

	// Executes a callback function for every transition of this LBA.
	public transitionIteration(callback: (source: State,
		data: TransitionInformation, input: string) => void): void {

		for (let index in this.transitions) {
			if (this.transitions.hasOwnProperty(index)) {
				let sourceState = this.stateList[index]!;
				let stateTransitions = this.transitions[index];

				for (let input in stateTransitions) {
					if (stateTransitions.hasOwnProperty(input)) {
						let internalInfo = stateTransitions[input];
						let info: TransitionInformation = {
							state: this.stateList[internalInfo.state]!,
							tapeSymbol: internalInfo.tapeSymbol,
							direction: internalInfo.direction
						};
						callback(sourceState, info, input);
					}
				}
			}
		}
	}

	// Returns the input alphabet of this LBA.
	public getInputAlphabet(): string[] {
		let result: string[] = [];
		for (let member in this.inputAlphabet) {
			if (this.inputAlphabet.hasOwnProperty(member)) {
				result.push(member);
			}
		}
		return result;
	}

	// Returns the tape alphabet of this LBA.
	public getTapeAlphabet(): string[] {
		let result: string[] = [];
		for (let member in this.tapeAlphabet) {
			if (this.tapeAlphabet.hasOwnProperty(member)) {
				result.push(member);
			}
		}
		return result;
	}

	public setTapeContent(input: string[]): void {
		this.tape = input;
		this.headPosition = 0;
		this.calculationSteps = 0;
		this.inputLength = input.length;
		this.accepting = false;
	}

	public getTapeContent(): string[] {
		return this.tape.slice();
	}

	public getHeadPosition(): number {
		return this.headPosition;
	}

	// Reads a character from the tape, triggering state changes to this LBA.
	public read(): void {
		if (this.error()) {
			return;
		}

		let error = true;
		let input = this.tape[this.headPosition];

		if (this.transitions.hasOwnProperty(this.currentState + "")) {
			let transitions = this.transitions[this.currentState!];
			if (transitions.hasOwnProperty(input)) {
				let info = transitions[input];
				this.currentState = info.state;
				this.tape[this.headPosition] = info.tapeSymbol;
				this.headPosition += this.directionToOffset(info.direction);
				this.calculationSteps++;
				error = false;
			}
		}

		if (this.exhausted()) {
			error = true;
		}

		if (error) {
			if (this.accepts()) {
				// continues to accept if it's currently accepting
				this.accepting = true;
			}

			// goes to the error state
			this.currentState = null;
		}
	}

	public halted(): boolean {
		// TODO
		return this.error();
	}

	// Resets this LBA, making it return to its initial state and
	// return its head to its initial position.
	public reset(): void {
		if (this.initialState == -1) {
			this.currentState = null;
		} else {
			this.currentState = this.initialState;
		}

		this.headPosition = 0;
		this.calculationSteps = 0;
		this.accepting = false;
	}

	// Clears this LBA, making it effectively equal to new LBA().
	public clear(): void {
		this.stateList = [];
		this.inputAlphabet = {};
		this.tapeAlphabet = {};
		this.transitions = {};
		this.unsetInitialState();
		this.finalStates.clear();
		this.numRemovedStates = 0;
		this.currentState = null;
		this.tape = [];
		this.headPosition = 0;
		this.calculationSteps = 0;
		this.accepting = false;
	}

	// Checks if this LBA accepts in its current state.
	public accepts(): boolean {
		if (this.accepting) {
			return true;
		}

		if (this.currentState === null) {
			return false;
		}

		let result = this.finalStates.contains(this.currentState);
		result = result && this.headPosition >= this.tape.length;
		return result;
	}

	// Checks if this LBA is in an error state, i.e. isn't in any state.
	public error(): boolean {
		return this.currentState === null;
	}

	// Returns the number of states of this LBA.
	public numStates(): number {
		return this.stateList.length - this.numRemovedStates;
	}

	public exhausted(): boolean {
		if (this.accepts()) {
			return false;
		}

		let q = this.numStates();
		let n = this.inputLength;
		let g = Object.keys(this.tapeAlphabet).length;
		return this.calculationSteps > q * n * Math.pow(g, n);
	}

	private isInputSymbol(symbol: string): boolean {
		return /[a-z]/.test(symbol);
	}

	private plainTextToDirection(input: string): Direction {
		return (input == "<") ? Direction.LEFT : Direction.RIGHT;
	}

	private directionToOffset(direction: Direction): number {
		return (direction == Direction.LEFT) ? -1 : 1;
	}

	private addSymbol(location: string, symbol: string): void {
		if (!this[location].hasOwnProperty(symbol)) {
			this[location][symbol] = 0;
		}
		this[location][symbol]++;
	}

	private addInputSymbol(symbol: string): void {
		this.addSymbol("inputAlphabet", symbol);
	}

	private addTapeSymbol(symbol: string): void {
		this.addSymbol("tapeAlphabet", symbol);
	}

	public removeSymbol(location: string, symbol: string): void {
		this[location][symbol]--;
		if (this[location][symbol] == 0) {
			delete this[location][symbol];
		}
	}

	private removeInputSymbol(symbol: string): void {
		this.removeSymbol("inputAlphabet", symbol);
	}

	private removeTapeSymbol(symbol: string): void {
		this.removeSymbol("tapeAlphabet", symbol);
	}

	// Returns the number of states that are being stored inside
	// this LBA (which counts removed states)
	private realNumStates(): number {
		return this.stateList.length;
	}

	private stateList: (State|undefined)[] = []; // Q
	private inputAlphabet: Alphabet = {}; // sigma
	private tapeAlphabet: Alphabet = {}; // gamma
	private transitions: {
		[index: number]: {
			[input: string]: InternalTransitionInformation
		}
	} = {}; // delta (Q x gamma -> Q x gamma x {left, right})
	private initialState: Index = -1; // q0
	private finalStates = new UnorderedSet<Index>(); // F

	private numRemovedStates: number = 0;

	// Instantaneous configuration-related attributes
	private currentState: Index|null = null;
	private tape: string[] = [];
	private headPosition: number = 0;

	// Used to halt this LBA when a loop is detected
	private calculationSteps: number = 0;
	private inputLength: number = 0;

	private accepting: boolean = false;
}
