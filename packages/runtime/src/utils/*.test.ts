import { describe, expect, test } from "bun:test";
import { el } from "../dom/el";
import { signal } from "../reactive/signal";
import { dynamicClass } from "./dynamicClasses";

describe("dynamicClass", () => {
	test("with computed condition", () => {
		const name = signal("John Doe");
		const node = el("p", {
			class: dynamicClass("some base", {
				"conditional classes": () => name() === "Jane Doe",
			}),
		});
		expect(node.getAttribute("class")).toBe("some base");
		name("Jane Doe");
		expect(node.getAttribute("class")).toBe("some base conditional classes");
	});

	test("no dynamic arg returns base as-is", () => {
		expect(dynamicClass("base")()).toBe("base");
	});

	test("no base, only dynamic has no leading space", () => {
		const active = signal(true);
		expect(dynamicClass(undefined, { foo: active })()).toBe("foo");
	});

	test("multiple true conditions appended in entry order", () => {
		const result = dynamicClass("base", {
			a: () => true,
			b: () => true,
			c: () => true,
		})();
		expect(result).toBe("base a b c");
	});

	test("all false conditions only shows base", () => {
		const result = dynamicClass("base", {
			a: () => false,
			b: () => false,
		})();
		expect(result).toBe("base");
	});

	test("toggle back and forth updates class each time", () => {
		const active = signal(true);
		const node = el("p", {
			class: dynamicClass("base", { active: active }),
		});
		expect(node.getAttribute("class")).toBe("base active");
		active(false);
		expect(node.getAttribute("class")).toBe("base");
		active(true);
		expect(node.getAttribute("class")).toBe("base active");
	});

	test("independent classNames only update for their own signal", () => {
		const a = signal(true);
		const b = signal(false);
		const node = el("p", {
			class: dynamicClass("base", { a: a, b: b }),
		});
		expect(node.getAttribute("class")).toBe("base a");
		a(false);
		expect(node.getAttribute("class")).toBe("base");
		b(true);
		expect(node.getAttribute("class")).toBe("base b");
	});

	test("trims whitespace in class name keys", () => {
		const result = dynamicClass("base", { " padded name ": () => true })();
		expect(result).toBe("base padded name");
	});

	test("empty base string behaves like undefined base", () => {
		const withEmpty = dynamicClass("", { foo: () => true })();
		const withUndefined = dynamicClass(undefined, { foo: () => true })();
		expect(withEmpty).toBe(withUndefined);
		expect(withEmpty).toBe("foo");
	});
});
