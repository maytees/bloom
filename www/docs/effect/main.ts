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
insert(heading, "Effect");

const intro = el("p", { class: "my-4" });
insert(
	intro,
	"An effect is a callback that runs immediately and automatically re-runs whenever any signal it reads changes.",
);

const basicsCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const basicsCodeText = `const number = signal(5);

effect(() => {
	console.log(number(), " <-- Number just changed because I called it here!");
});

number(10); // triggers the console.log to run again`;
insert(basicsCode, highlight(basicsCodeText));

const introTwo = el("p", { class: "my-4" });
insert(
	introTwo,
	"Notice there's no dependency array. Bloom detects which signals are called inside the effect and adds them automatically. Dependencies are rediscovered on every run, so an effect that stops reading a signal also stops re-running for it.",
);

const disposeSection = el("h2", { class: "text-xl font-semibold mt-8" });
insert(disposeSection, "Disposing");

const disposeText = el("p", { class: "my-4" });
insert(
	disposeText,
	'An effect returns a <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">dispose</code> function that shuts it off.',
);

const disposeCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const disposeCodeText = `const name = signal("Jeff");

const { dispose: disposeNameEffect } = effect(() => {
	console.log(name(), " is a new name");
});

disposeNameEffect();`;
insert(disposeCode, highlight(disposeCodeText));

const note = el("p", {
	class: "border-l-2 border-emerald-700 pl-4 my-5 text-sm",
});
insert(
	note,
	'<b class="block text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-1">Important</b>Disposing only shuts off the effect — it does not change the signal. In a counter app, disposing the effect that updates the count text still lets the signal increment; it just stops running the effect body.',
);

const pager = el("div", {
	class:
		"flex flex-row justify-between border-t border-neutral-200 mt-10 pt-4 text-sm",
});
const prevLink = el("a", {
	href: "/docs/signals",
	class: "underline text-emerald-700",
});
insert(prevLink, "← Signals");
const nextLink = el("a", {
	href: "/docs/reactivity",
	class: "underline text-emerald-700",
});
insert(nextLink, "Staying lazy →");
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
	basicsCode,
	introTwo,
	disposeSection,
	disposeText,
	disposeCode,
	note,
	pager,
	footer,
];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
