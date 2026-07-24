// These tests are mostly written by Claude
import { describe, expect, test } from "bun:test";
import { effect } from "./effect";
import { signal } from "./signal";

describe("effect", () => {
	test("runs once immediately", () => {
		let runs = 0;
		effect(() => {
			runs++;
		});
		expect(runs).toBe(1);
	}, 1000);

	test("re-runs when a dependency changes", () => {
		const n = signal(1);
		const seen: number[] = [];
		effect(() => {
			seen.push(n());
		}); // [1]
		n(2); // [1, 2]
		n(3); // [1, 2, 3]
		expect(seen).toEqual([1, 2, 3]);
	}, 100);

	test("no-op write does not re-run", () => {
		const n = signal(0);
		let runs = 0;
		effect(() => {
			n();
			runs++;
		}); // runs = 1
		n(0); // same value
		expect(runs).toBe(1);
	}, 100);

	test("tracks multiple signals", () => {
		const a = signal(1);
		const b = signal(2);
		let runs = 0;
		effect(() => {
			a();
			b();
			runs++;
		}); // runs = 1
		a(10); // runs = 2
		b(20); // runs = 3
		expect(runs).toBe(3);
	}, 100);

	test("dynamic dependencies", () => {
		const useA = signal(true);
		const a = signal("a");
		const b = signal("b");
		let runs = 0;
		effect(() => {
			runs++;
			useA() ? a() : b();
		}); // reads useA + a

		useA(false); // now reads useA + b -> re-runs
		const after = runs;
		a("a2"); // a no longer a dep -> must NOT re-run
		expect(runs).toBe(after);
		b("b2"); // b IS a dep now -> re-runs
		expect(runs).toBe(after + 1);
	}, 100);

	test("disposal stops re-runs", () => {
		const n = signal(0);
		let runs = 0;
		const { dispose } = effect(() => {
			n();
			runs++;
		}); // runs = 1
		dispose();
		n(1);
		expect(runs).toBe(1);
	}, 100);

	test("multiple effects on one signal all re-run", () => {
		const n = signal(0);
		let a = 0;
		let b = 0;
		effect(() => {
			n();
			a++;
		});
		effect(() => {
			n();
			b++;
		});
		n(1);
		expect(a).toBe(2);
		expect(b).toBe(2);
	}, 100);
});
