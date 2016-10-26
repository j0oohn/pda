import {Menu} from "./interface/Menu"
import {Settings, Strings} from "./Settings"
import {utils} from "./Utils"

export class Initializer {
	static exec(): void {
		// if (this.initialized) {
		// 	return;
		// }
		// this.initialized = true;
		this.initSidebars();
	}

	private static initSidebars(): void {
		this.initSidebarFA();
		this.initSidebarPDA();
		this.initSidebarLBA();
	}

	private static initSidebarFA(): void {
		let menuList: Menu[] = [];

		let temp = new Menu(Strings.RECOGNITION);
		let input = <HTMLInputElement> utils.create("input");
		input.type = "text";
		input.placeholder = Strings.TEST_CASE;
		temp.add(input);
		menuList.push(temp);

		Settings.machines[Settings.Machine.FA].sidebar = menuList;
	}

	private static initSidebarPDA(): void {
		// TODO
		console.log("[INIT] PDA");
	}

	private static initSidebarLBA(): void {
		// TODO
		console.log("[INIT] LBA");
	}

	// static initialized: boolean = false;
}
