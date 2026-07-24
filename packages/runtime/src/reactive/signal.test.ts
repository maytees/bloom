import { describe, expect, test } from "bun:test";
import { $, signal } from "./signal";

describe("signal", () => {
	test("simple signal", () => {
		const name = signal();
		expect(name()).toBeUndefined();
	});

	test("$ alias for a signal", () => {
		const num = $(5);
		expect(num()).toBe(5);
	});

	test("signal with default value", () => {
		const name = signal("Maytham");
		expect(name()).toBe("Maytham");
	});

	test("no default value is undefined", () => {
		const n = signal();
		expect(n()).toBeUndefined();
	});

	test("update default value", () => {
		const n = signal<number | null>(0);
		n(5);
		expect(n()).toBe(5);
	});

	test("holds objects", () => {
		const obj = { a: 1 };
		const s = signal(obj);
		expect(s()).toBe(obj);
		s({ a: 2 });
		expect(s()).toEqual({ a: 2 });
	});

	test("two signals are independent", () => {
		const a = signal("a");
		const b = signal("b");
		a("a2");
		expect(b()).toBe("b");
	});

	test("is a function", () => {
		const n = signal(0);
		expect(typeof n).toBe("function");
	});

	test("can set to undefined and null", () => {
		const n = signal<number | null>(0);
		n(null);
		expect(n()).toBeNull();
	});

	test("updates multiple times", () => {
		const n = signal(0);
		n(1);
		n(2);
		n(3);
		expect(n()).toBe(3);
	});

	test("holds functions as values", () => {
		const fn = () => 42;
		const s = signal(fn as any);
		expect(s()).toBe(fn);
	});

	test("can hold object with generic type and default value", () => {
		type Human = { name: string; age: number };
		const human = signal<Human>({ name: "Maytham", age: 19 });

		expect(human()).toEqual({
			name: "Maytham",
			age: 19,
		});

		human({
			name: "Joseph M.",
			age: 19,
		});

		expect(human()).toEqual({
			name: "Joseph M.",
			age: 19,
		});
	});

	test("setting signal returns the new set value", () => {
		const name = $("Maytham");
		expect(name("Adam")).toBe("Adam");
	});
});
