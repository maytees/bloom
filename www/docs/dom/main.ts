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
insert(heading, "DOM");

const intro = el("p", { class: "my-4" });
insert(intro, "Creating elements and putting them on the page.");

const note = el("p", {
	class: "border-l-2 border-emerald-700 pl-4 my-5 text-sm",
});
insert(
	note,
	'<b class="block text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-1">Note</b><code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">mount()</code> and <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">insert()</code> are early implementations, built mainly to exercise <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">el()</code>. Their APIs will grow.',
);

const creatingSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(creatingSection, "Creating elements");

const creatingCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const creatingCodeText = `import { el, signal, insert, mount } from "bloom";

const someLabel = signal("label");

const someParagraph = el("p", {
	class: "text-2xl",
	onClick: () => someAction,
	"aria-label": someLabel, // signals pass without (), or wrap in a closure
});

insert(someParagraph, "This is paragraph text");

mount(someParagraph, "mountId");`;
insert(creatingCode, highlight(creatingCodeText));

const typesText = el("p", { class: "my-4" });
insert(
	typesText,
	'Tag names and props are fully type-safe thanks to Preact\'s DOM type definitions. The one difference is <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">className</code> becomes <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">class</code>, matching real HTML.',
);

const lazyRefText = el("p", { class: "my-4" });
insert(
	lazyRefText,
	'See <a href="/docs/reactivity" class="underline text-emerald-700">Reactive values must stay lazy</a> for why <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">"aria-label": someLabel</code> works as-is, but a derived condition wouldn\'t.',
);

const propsSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(propsSection, "How props are handled");

const propsList = el("ul", {
	class: "list-disc pl-5 my-4 flex flex-col gap-2",
});
const propsItems = [
	'A key starting with <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">on</code> becomes an event listener, attached once.',
	"A function value becomes a reactive binding, wrapped in its own effect, so only that one attribute updates when its signals change.",
	"Anything else is set a single time.",
];
for (const item of propsItems) {
	const li = el("li");
	insert(li, item);
	insert(propsList, li);
}

const pager = el("div", {
	class:
		"flex flex-row justify-between border-t border-neutral-200 mt-10 pt-4 text-sm",
});
const prevLink = el("a", {
	href: "/docs/reactivity",
	class: "underline text-emerald-700",
});
insert(prevLink, "← Staying lazy");
const nextLink = el("a", {
	href: "/docs/classes",
	class: "underline text-emerald-700",
});
insert(nextLink, "Dynamic classes →");
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
	note,
	creatingSection,
	creatingCode,
	typesText,
	lazyRefText,
	propsSection,
	propsList,
	pager,
	footer,
];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
