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
insert(heading, "Dynamic classes");

const intro = el("p", { class: "my-4" });
insert(
	intro,
	'You may know <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">cn()</code> — the clsx + tailwind-merge helper popularized by shadcn/ui — for conditionally setting class names. Bloom has the same idea in <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">dynamicClass()</code>, aliased <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">$dc()</code>, imported from <code class="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em]">"bloom/utils"</code>.',
);

const code = el("pre", {
	class:
		"bg-neutral-100 border-l-2 border-neutral-300 p-4 my-4 text-sm font-mono leading-relaxed overflow-x-auto",
});
const codeText = `import { el, signal } from "bloom";
import { dynamicClass } from "bloom/utils";

const isActive = signal(true);

el("button", {
	class: dynamicClass("btn", {
		active: isActive,             // a bare signal works directly
		disabled: () => !isActive(),  // a derived condition must be wrapped
	}),
});`;
insert(code, highlight(codeText));

const outro = el("p", { class: "my-4" });
insert(
	outro,
	'Every condition follows the same rule as everywhere else: pass a bare signal directly, or wrap a derived condition in a closure. See <a href="/docs/reactivity" class="underline text-emerald-700">Reactive values must stay lazy</a>.',
);

const note = el("p", {
	class: "border-l-2 border-emerald-700 pl-4 my-5 text-sm",
});
insert(
	note,
	'<b class="block text-xs uppercase tracking-wide font-semibold text-emerald-700 mb-1">Note</b>Later this will be built into the Bloom markup language, so conditional classes won\'t need a helper at all.',
);

const pager = el("div", {
	class:
		"flex flex-row justify-start border-t border-neutral-200 mt-10 pt-4 text-sm",
});
const prevLink = el("a", {
	href: "/docs/dom",
	class: "underline text-emerald-700",
});
insert(prevLink, "← DOM");
insert(pager, prevLink);

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

const sections = [nav, heading, intro, code, outro, note, pager, footer];

for (const section of sections) {
	insert(main, section);
}

mount(main, "app");
