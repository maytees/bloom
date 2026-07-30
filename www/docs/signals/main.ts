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
insert(heading, "Signals");

const intro = el("p", { class: "my-4" });
insert(
	intro,
	'A signal is a way to get and set reactive values — similar to <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">useState</code> in React.',
);

const introTwo = el("p", { class: "my-4" });
insert(
	introTwo,
	"Unlike React, there aren't separate values for get and set. You get one function that does both: call it with no arguments to read, with an argument to write.",
);

const basicsCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const basicsCodeText = `const name = signal();

// Set the state
name("Adam");

// Get the state
name();`;
insert(basicsCode, highlight(basicsCodeText));

const typesSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(typesSection, "Types and defaults");

const typesText = el("p", { class: "my-4" });
insert(typesText, "Generics, objects, and default values all work.");

const typesCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const typesCodeText = `type Human = {
	name: string;
	age: number;
};

const human = signal<Human>({
	name: "Maytham",
	age: 19,
});

// Type error!
human("not a human");`;
insert(typesCode, highlight(typesCodeText));

const shorthandSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(shorthandSection, "Shorthand");

const shorthandText = el("p", { class: "my-4" });
insert(shorthandText, "A dollar sign is shorthand for creating a signal.");

const shorthandCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const shorthandCodeText = `const num = $(5);
// same as: const num = signal(5);`;
insert(shorthandCode, highlight(shorthandCodeText));

const note = el("p", {
	class: "border-l-2 border-emerald-700 pl-4 my-5 text-sm",
});
insert(
	note,
	'<b class="block text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-1">Note</b>A signal with no default reads as <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">undefined</code>, matching what JavaScript does with an unpassed argument.',
);

const pager = el("div", {
	class:
		"flex flex-row justify-between border-t border-neutral-200 mt-10 pt-4 text-sm",
});
const prevLink = el("a", {
	href: "/docs",
	class: "underline text-emerald-700",
});
insert(prevLink, "← Docs");
const nextLink = el("a", {
	href: "/docs/effect",
	class: "underline text-emerald-700",
});
insert(nextLink, "Effect →");
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
	basicsCode,
	typesSection,
	typesText,
	typesCode,
	shorthandSection,
	shorthandText,
	shorthandCode,
	note,
	pager,
	footer,
];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
