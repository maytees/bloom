import { el, insert, mount } from "bloom";
import { highlight } from "../../highlight";

const main = el("main", { class: "max-w-2xl mx-auto px-5 py-10" });

const nav = el("nav", { class: "flex flex-row items-center gap-4" });

const navItems = {
	bloom: "/",
	docs: "/docs",
	playground: "/playground",
	github: "https://github.com/maytees/bloom",
};

for (const [item, href] of Object.entries(navItems)) {
	const navBloom = el("a", {
		href: href,
		class: "underline text-sm text-emerald-700",
		target: item === "github" ? "_blank" : "_self",
	});

	insert(navBloom, item);
	insert(nav, navBloom);
}

const heading = el("h1", { class: "text-2xl font-semibold mt-8" });
insert(heading, "Reactive values must stay lazy");

const intro = el("p", { class: "my-4" });
insert(
	intro,
	'A signal is just a function. Calling <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">count()</code> reads the value right now, synchronously. There\'s no tracking magic on the read itself — tracking only happens when that read occurs inside something that re-runs later, like an <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">effect()</code> (or the effects <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">el()</code> sets up internally for reactive props).',
);

const introTwo = el("p", { class: "my-4" });
insert(
	introTwo,
	"The moment you build an expression around a signal read — a comparison, a ternary, string concatenation — and hand the result to something else, you've frozen it. The read already happened; nothing is left to re-run later.",
);

const code = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const codeText = `const isRed = signal(true);

// BAD: isRed() runs once, immediately. The boolean result is what
// gets passed in. It's now dead and never updates again.
el("p", { class: isRed() ? "red" : "" });

// GOOD: the whole expression is deferred inside a function. Whatever
// consumes it calls this function on its own terms, so isRed() gets
// read fresh every time.
el("p", { class: () => (isRed() ? "red" : "") });`;
insert(code, highlight(codeText));

const bareSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(bareSection, "Bare signals are fine");

const bareText = el("p", { class: "my-4" });
insert(
	bareText,
	'Passing a bare signal directly — no <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">()</code>, no wrapping — works on its own. <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">isRed</code> by itself is already callable, and whatever receives it knows to call it at the right time. The trap only appears once you build an expression from a signal read, like <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">count() > 5</code>. That needs wrapping too.',
);

const reactSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(reactSection, "But in React I don't have to do this");

const reactText = el("p", { class: "my-4" });
insert(
	reactText,
	"React re-renders an entire component whenever state inside it changes, re-reading every value automatically. Bloom instead updates the exact attribute or text node that changed, so it needs a function it can call again later — not a value computed once.",
);

const note = el("p", {
	class: "border-l-2 border-emerald-700 pl-4 my-5 text-sm",
});
insert(
	note,
	'<b class="block text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-1">Important</b>You don\'t get an error when you pass a frozen value — it just silently stops updating. The Bloom markup language will handle this automatically later.',
);

const pager = el("div", {
	class:
		"flex flex-row justify-between border-t border-neutral-200 mt-10 pt-4 text-sm",
});
const prevLink = el("a", {
	href: "/docs/effect",
	class: "underline text-emerald-700",
});
insert(prevLink, "← Effect");
const nextLink = el("a", {
	href: "/docs/dom",
	class: "underline text-emerald-700",
});
insert(nextLink, "DOM →");
insert(pager, prevLink);
insert(pager, nextLink);

const footer = el("footer", {
	class: "border-t border-neutral-200 mt-14 pt-4 text-xs text-neutral-500",
});
const hereAnchor = el("a", {
	href: "https://github.com/maytees/bloom/tree/master/www/",
	target: "_blank",
	class: "underline text-emerald-700",
});
insert(hereAnchor, "here");
insert(footer, "This website is fully made with Bloom. See it ");
insert(footer, hereAnchor);

const sections = [
	nav,
	heading,
	intro,
	introTwo,
	code,
	bareSection,
	bareText,
	reactSection,
	reactText,
	note,
	pager,
	footer,
];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
