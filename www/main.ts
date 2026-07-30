import { el, insert, mount } from "bloom";
import { highlight } from "./highlight";

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
insert(heading, "Bloom");

const subheading = el("p", { class: "text-neutral-500 text-sm mt-1" });
insert(
	subheading,
	"A signals-based component language that compiles to TypeScript.",
);

const descParagraph = el("p", { class: "my-4" });
insert(
	descParagraph,
	"Build UIs without the < and >. Fine grained reactivity, no virtual DOM, no re-renders. A project for learning how frameworks work.",
);

const cta = el("div", { class: "flex flex-row gap-4" });

for (const [item, href] of Object.entries({
	"read the docs": "/docs",
	"open the playground": "/playground",
})) {
	const navBloom = el("a", {
		href: href,
		class: "underline text-emerald-700",
	});

	insert(navBloom, item);
	insert(cta, navBloom);
}

const separator = el("div", {
	class: "w-full bg-neutral-200 h-px rounded-full my-8",
});

const todaySection = el("h2", { class: "text-xl font-semibold" });
insert(todaySection, "Today - the runtime");

const todayCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});

const todayCodeText = `import { signal, el, insert } from "bloom";

const count = signal(0);

const label = el("p");
insert(label, () => count());

const button = el("button", {
	onClick: () => count(count() + 1),
});`;

insert(todayCode, highlight(todayCodeText));

const planSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(planSection, "The plan - the markup language");

const planSubheading = el("p", { class: "text-neutral-500 text-sm mt-1" });
insert(
	planSubheading,
	"This doesn't exist yet. It's what the runtime is building toward.",
);

const planCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});

const planCodeText = `component Counter {
	let count = signal(0)

	div(class: "counter") {
		p { "Count: {count()}" }
		button(onClick: () => count(count() + 1)) { "Increment" }
	}
}`;
insert(planCode, highlight(planCodeText));

const ideasSeparator = el("div", {
	class: "w-full bg-neutral-200 h-px rounded-full my-8",
});

const ideasSection = el("h2", { class: "text-xl font-semibold" });
insert(ideasSection, "Three ideas");

const ideasList = el("ul", {
	class: "list-disc pl-5 my-4 flex flex-col gap-2",
});

const ideas: [string, string][] = [
	[
		"Signals.",
		"Reading a value subscribes to it. Dependencies track themselves, so no dependency arrays, no rules of hooks.",
	],
	[
		"No virtual DOM.",
		"Components return real DOM nodes. There's no intermediate tree, so there's nothing to diff.",
	],
	[
		"Runs once.",
		"A component executes a single time. Only the individual bindings re-run.",
	],
];

for (const [label, description] of ideas) {
	const idea = el("li");
	const ideaLabel = el("b", { class: "font-semibold" });
	insert(ideaLabel, label);
	insert(idea, ideaLabel);
	insert(idea, ` ${description}`);
	insert(ideasList, idea);
}

const statusSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(statusSection, "Where it's at");

const statusList = el("ul", {
	class: "list-disc pl-5 my-4 flex flex-col gap-2",
});

const statuses: [string, string][] = [
	["done", "signal, reactive values"],
	["done", "effect, auto-tracked side effects"],
	["wip", "el, insert, mount — the DOM layer"],
	["next", "each, keyed list reconciliation"],
	["next", "the compiler, .bloom to TypeScript"],
];

for (const [status, description] of statuses) {
	const row = el("li");
	const label = el("b", { class: "font-semibold" });
	insert(label, status);
	const text = el("span");
	insert(text, ` — ${description}`);
	insert(row, label);
	insert(row, text);
	insert(statusList, row);
}

const footer = el("footer", {
	class: "border-t border-neutral-200 mt-14 pt-4 text-xs text-neutral-500",
});
const hereAnchor = el("a", {
	href: "https://github.com/maytees/bloom/tree/master/www",
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
	descParagraph,
	cta,
	separator,
	todaySection,
	todayCode,
	planSection,
	planSubheading,
	planCode,
	ideasSeparator,
	ideasSection,
	ideasList,
	statusSection,
	statusList,
	footer,
];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
