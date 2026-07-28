// import { describe, expect, test } from "bun:test";
// import { signal } from "../reactive/signal";
// import { el } from "./el";
// import { insert } from "./insert";

// describe("insert", () => {
// 	test("inserts static text", () => {
// 		const parent = el("p");
// 		insert(parent, () => "hello");
// 		expect(parent.textContent).toBe("hello");
// 	});

// 	test("updates text when a signal changes", () => {
// 		const n = signal(1);
// 		const parent = el("p");
// 		insert(parent, () => `Count: ${n()}`);
// 		expect(parent.textContent).toBe("Count: 1");
// 		n(2);
// 		expect(parent.textContent).toBe("Count: 2");
// 	});

// 	test("coerces numbers", () => {
// 		const parent = el("p");
// 		insert(parent, () => 42);
// 		expect(parent.textContent).toBe("42");
// 	});

// 	test("renders null and undefined as empty", () => {
// 		const v = signal<string | null>("x");
// 		const parent = el("p");
// 		insert(parent, () => v());
// 		expect(parent.textContent).toBe("x");
// 		v(null);
// 		expect(parent.textContent).toBe("");
// 	});

// 	test("does not disturb sibling nodes", () => {
// 		const n = signal(1);
// 		const parent = el("div");
// 		const before = el("span", { id: "before" });
// 		parent.append(before);
// 		insert(parent, () => n());
// 		const after = el("span", { id: "after" });
// 		parent.append(after);

// 		n(2);
// 		expect(parent.firstChild).toBe(before);
// 		expect(parent.lastChild).toBe(after);
// 		expect(parent.textContent).toBe("2");
// 	});

// 	test("reuses the same text node across updates", () => {
// 		const n = signal(1);
// 		const parent = el("p");
// 		insert(parent, () => n());
// 		const node = parent.firstChild;
// 		n(2);
// 		expect(parent.firstChild).toBe(node);
// 	});

// 	test("multiple inserts in one parent stay independent", () => {
// 		const a = signal("a1");
// 		const b = signal("b1");
// 		const parent = el("p");
// 		insert(parent, () => a());
// 		insert(parent, () => b());
// 		expect(parent.textContent).toBe("a1b1");
// 		a("a2");
// 		expect(parent.textContent).toBe("a2b1");
// 	});
// });
