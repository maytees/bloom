import { describe, expect, test } from "bun:test";
import { signal } from "../reactive/signal";
import { el } from "./el";

describe("el", () => {
	test("creates the right tag", () => {
		const node = el("div");
		expect(node.tagName).toBe("DIV");
	});

	test("sets static attributes", () => {
		const node = el("div", { class: "box" });
		expect(node.getAttribute("class")).toBe("box");
	});

	test("skips undefined and null props", () => {
		const node = el("div", { class: undefined, id: null } as any);
		expect(node.hasAttribute("class")).toBe(false);
		expect(node.hasAttribute("id")).toBe(false);
	});

	test("boolean false removes the attribute", () => {
		const node = el("button", { disabled: false });
		expect(node.hasAttribute("disabled")).toBe(false);
	});

	test("boolean true sets the attribute", () => {
		const node = el("button", { disabled: true });
		expect(node.hasAttribute("disabled")).toBe(true);
	});

	test("sets value as a property, not an attribute", () => {
		const node = el("input", { value: "hi" });
		expect(node.value).toBe("hi");
	});

	test("sets checked as a property", () => {
		const node = el("input", { type: "checkbox", checked: true });
		expect(node.checked).toBe(true);
	});

	test("attaches event listeners", () => {
		let clicks = 0;
		const node = el("button", { onClick: () => clicks++ });
		node.click();
		expect(clicks).toBe(1);
	});

	test("does not set on* props as attributes", () => {
		const node = el("button", { onClick: () => {} });
		expect(node.hasAttribute("onclick")).toBe(false);
	});

	test("function prop is reactive", () => {
		const active = signal(false);
		const node = el("div", { class: () => (active() ? "on" : "off") });
		expect(node.getAttribute("class")).toBe("off");
		active(true);
		expect(node.getAttribute("class")).toBe("on");
	});

	test("each reactive prop updates independently", () => {
		const a = signal("a1");
		const b = signal("b1");
		const node = el("div", { id: () => a(), title: () => b() });
		a("a2");
		expect(node.getAttribute("id")).toBe("a2");
		expect(node.getAttribute("title")).toBe("b1");
	});

	test("reactive value property updates", () => {
		const text = signal("one");
		const node = el("input", { value: () => text() });
		expect(node.value).toBe("one");
		text("two");
		expect(node.value).toBe("two");
	});
});
