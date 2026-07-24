# Playground/examples

Use this folder to test and mess around with Bloom on an html page.

## How to use

First, you need to bun install dependencies in project root; this will install bloom runtime from `packages/runtime` into this playground folder.

```bash
bun install
```

Then, serve with bun via:

```bash
bun playground
```

## Adding your own examples

To add an example, first create a tab in the html file's `<nav>`:

```html
<nav>
	<button data-tab="counter">counter</button>
	<!-- some more examples -->
	<button data-tab="my-example">my example</button>
</nav>
```

Then, create a section for the tab, ensure `data-panel` is the same as the nav button's `data-tab`:

```html
<section data-panel="my-example">
	<!-- your example's html -->
</section>
```

In `playground.ts`, examples are put in a `init(el: HTMLElement)` based on the `Example` type, this is where your example's code goes. For example:

```typescript
// playground.ts
const myCounter: Example = {
	init() {
		const counter = document.getElementById(
			"count",
		) as HTMLParagraphElement | null;
		const incBtn = document.getElementById("inc") as HTMLButtonElement | null;
		const decBtn = document.getElementById("dec") as HTMLButtonElement | null;

		const count = signal<number>(0);

		incBtn?.addEventListener("click", () => {
			count(count() + 1);
		});

		decBtn?.addEventListener("click", () => {
			count(count() - 1);
		});

		const { dispose: disposeCount } = effect(() => {
			if (!counter) {
				console.error("Counter p tag is null!");
				return;
			}
			counter.innerHTML = `Count is: ${count()}`;
		});
	},
};
```

To add the example onto the tabs, simply add it to the examples object. The key is a string of the tab value (e.g `my-example`), and the value is the `Example` object:

```typescript
// playground.ts (after all example objects are declared)
const examples: Record<string, Example> = {
	counter,
	"my-example": myExampleObject
};
```

To see how to use Bloom, see [the project's readme](https://github.com/maytees/bloom/tree/master#readme)
