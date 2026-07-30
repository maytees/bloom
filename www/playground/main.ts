import { effect, el, insert, mount, signal } from "bloom";
import { highlight } from "../highlight";

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
insert(heading, "Playground");

const subheading = el("p", { class: "text-neutral-500 text-sm mt-1" });
insert(
	subheading,
	"Interactive demos of the reactivity engine. Current progress, not concept.",
);

// COUNTER DEMO
const counterBox = el("div", {
	class: "p-5 border border-neutral-200 w-full h-150 mt-8 flex flex-col gap-4",
});
const counterTitle = el("h2", {
	class: "font-semibold",
});
insert(counterTitle, "Counter");
insert(counterBox, counterTitle);

const counterSubtitle = el("p", {
	class: "text-neutral-500 text-sm",
});
insert(counterSubtitle, "signal, effect, insert, el");
insert(counterBox, counterSubtitle);

const countSpan = el("span", {
	class: "text-2xl font-bold",
});

const count = signal(0);
effect(() => {
	insert(countSpan, String(count()));
});
insert(counterBox, countSpan);

const incDecContainer = el("div", {
	class: "flex flex-row gap-2",
});

const plus = el("button", {
	class:
		"border size-8 flex items-center justify-center hover:scale-102 active:scale-105 hover:cursor-pointer",
	onClick: () => count(count() + 1),
});
insert(plus, "+");
insert(incDecContainer, plus);

const minus = el("button", {
	class:
		"border size-8 flex items-center justify-center hover:scale-102 active:scale-105 hover:cursor-pointer",
	onClick: () => count(count() - 1),
});
insert(minus, "-");
insert(incDecContainer, minus);

insert(counterBox, incDecContainer);

const counterCode = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const counterCodeText = `const counterBox = el("div", {
	class: "p-5 border border-neutral-200 w-full h-96 mt-8 flex flex-col gap-4",
});
const counterTitle = el("h2", {
	class: "font-semibold",
});
insert(counterTitle, "Counter");
insert(counterBox, counterTitle);

const counterSubtitle = el("p", {
	class: "text-neutral-500 text-sm",
});
insert(counterSubtitle, "signal, effect, insert, el");
insert(counterBox, counterSubtitle);

const countSpan = el("span", {
	class: "text-2xl font-bold",
});

const count = signal(0);
effect(() => {
	insert(countSpan, String(count()));
});
insert(counterBox, countSpan);

const incDecContainer = el("div", {
	class: "flex flex-row gap-2",
});

const plus = el("button", {
	class:
		"border size-8 flex items-center justify-center hover:scale-102 active:scale-105 hover:cursor-pointer",
	onClick: () => count(count() + 1),
});
insert(plus, "+");
insert(incDecContainer, plus);

const minus = el("button", {
	class:
		"border size-8 flex items-center justify-center hover:scale-102 active:scale-105 hover:cursor-pointer",
	onClick: () => count(count() - 1),
});
insert(minus, "-");
insert(incDecContainer, minus);

insert(counterBox, incDecContainer);`;
insert(counterCode, highlight(counterCodeText));
insert(counterBox, counterCode);

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

const sections = [nav, heading, subheading, counterBox, footer];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
