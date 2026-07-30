import { el, insert, mount } from "bloom";

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
insert(heading, "Documentation");

const subheading = el("p", { class: "text-neutral-500 text-sm mt-1" });
insert(
	subheading,
	"There is no Bloom markup language yet. These docs cover the runtime, which is what actually works today.",
);

const docsList = el("ul", { class: "list-disc pl-5 my-4 flex flex-col gap-2" });

const docsLinks: [string, string, string][] = [
	["Signals", "/docs/signals", "reactive values"],
	["Effect", "/docs/effect", "side effects that re-run automatically"],
	["Staying lazy", "/docs/reactivity", "the one rule to remember"],
	["DOM", "/docs/dom", "creating and mounting elements"],
	["Dynamic classes", "/docs/classes", "conditional class names"],
];

for (const [label, href, description] of docsLinks) {
	const item = el("li");
	insert(
		item,
		`<a href="${href}" class="underline text-emerald-700">${label}</a> — ${description}`,
	);
	insert(docsList, item);
}

const separator = el("div", {
	class: "w-full bg-neutral-200 h-px rounded-full my-8",
});

const playgroundSection = el("h2", { class: "text-xl font-semibold" });
insert(playgroundSection, "Playground vs examples");

const playgroundText = el("p", { class: "my-4" });
insert(
	playgroundText,
	'<a href="/playground" class="underline text-emerald-700">The playground</a> holds interactive demos of the reactivity engine — current progress. The <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">/examples</code> folder in the repo holds Bloom markup samples, which are concept only and do not run yet.',
);

const pager = el("div", {
	class:
		"flex flex-row justify-end border-t border-neutral-200 mt-10 pt-4 text-sm",
});
const nextLink = el("a", {
	href: "/docs/signals",
	class: "underline text-emerald-700",
});
insert(nextLink, "Signals →");
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
	subheading,
	docsList,
	separator,
	playgroundSection,
	playgroundText,
	pager,
	footer,
];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
