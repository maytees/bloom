import { effect, el, insert, mount, signal } from "bloom";
import { $c } from "bloom/utils";
import { shuffleString } from "./util";

type Example = {
	init: (el: HTMLElement) => void;
};

const counter: Example = {
	init() {
		const counter = document.getElementById(
			"count",
		) as HTMLParagraphElement | null;
		const incBtn = document.getElementById("inc") as HTMLButtonElement | null;
		const decBtn = document.getElementById("dec") as HTMLButtonElement | null;
		const disposeBtn = document.getElementById(
			"dispose",
		) as HTMLButtonElement | null;

		const count = signal<number>(0);
		const isDisposed = signal(false);

		function checkDisposed() {
			if (isDisposed())
				alert(`Effect's are disposed! Actual count:	${count()}`);
		}

		incBtn?.addEventListener("click", () => {
			count(count() + 1);
			checkDisposed();
		});

		decBtn?.addEventListener("click", () => {
			count(count() - 1);
			checkDisposed();
		});

		const { dispose: disposeCount } = effect(() => {
			if (!counter) {
				console.error("Counter p tag is null!");
				return;
			}
			counter.innerHTML = `Count is: ${count()}`;
		});

		disposeBtn?.addEventListener("click", () => {
			disposeCount();
			isDisposed(true);
			alert(
				"Disposed effects! Counter will no longer update when buttons are clicked.",
			);
		});
	},
};

const todo: Example = {
	init(el) {
		el.textContent = "TODO: create todo example";
	},
};

const elExample: Example = {
	init(sectionElement) {
		const isRed = signal(true);
		const ariaLabel = signal<string>("this is an aria label");

		const someElement = el("p", {
			"aria-label": () => ariaLabel(),
			// class: () => (isRed() ? "isRed" : ""),
			class: $c("base", {
				isRed: isRed,
				"another case": () => isRed() === false,
				"another thing": () => isRed(),
			}),
			onClick: () => {
				console.log(`${isRed()} was read`);
				isRed(!isRed());
			},
		});
		insert(someElement, "This paragraph is made by Bloom!");

		const ariaLabelButton = el("button");
		insert(ariaLabelButton, "Change aria label");

		ariaLabelButton.addEventListener("click", () => {
			isRed(!isRed());
			ariaLabel(shuffleString(ariaLabel()));
		});

		mount(someElement, sectionElement.id);
		mount(ariaLabelButton, sectionElement.id);
	},
};

const examples: Record<string, Example> = { counter, todo, elExample };

function showTab(name: string) {
	document.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
		panel.style.display = panel.dataset.panel === name ? "block" : "none";
	});
}

document.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((btn) => {
	// biome-ignore lint/style/noNonNullAssertion: playground
	btn.addEventListener("click", () => showTab(btn.dataset.tab!));
});

document.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
	// biome-ignore lint/style/noNonNullAssertion: playground
	const name = panel.dataset.panel!;
	if (!examples[name]) {
		throw new Error("Examples is undefined");
	}
	examples[name].init(panel);
});

showTab("counter");
