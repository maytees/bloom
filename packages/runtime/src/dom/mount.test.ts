// import { describe, expect, test } from "bun:test";
// import { signal } from "../reactive/signal";
// import { el } from "./el";
// import { mount } from "./mount";

// describe("mount", () => {
// 	test("appends the component's root to the container", () => {
// 		const container = el("div");
// 		mount(() => el("p", { id: "root" }), container);
// 		expect(container.children.length).toBe(1);
// 		expect(container.firstElementChild?.id).toBe("root");
// 	});

// 	test("component function runs exactly once", () => {
// 		const n = signal(0);
// 		let runs = 0;
// 		const container = el("div");
// 		mount(() => {
// 			runs++;
// 			const p = el("p");
// 			insert(p, () => n());
// 			return p;
// 		}, container);

// 		expect(runs).toBe(1);
// 		n(1);
// 		n(2);
// 		expect(runs).toBe(1); // no re-render, ever
// 		expect(container.textContent).toBe("2");
// 	});

// 	test("mounted component is reactive", () => {
// 		const name = signal("world");
// 		const container = el("div");
// 		mount(() => {
// 			const p = el("p");
// 			insert(p, () => `hello ${name()}`);
// 			return p;
// 		}, container);

// 		expect(container.textContent).toBe("hello world");
// 		name("bloom");
// 		expect(container.textContent).toBe("hello bloom");
// 	});
// });
