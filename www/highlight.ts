// Tiny syntax highlighter for the code blocks on this site. Made with AI.

const KEYWORDS = new Set([
	"const",
	"let",
	"var",
	"function",
	"return",
	"if",
	"else",
	"for",
	"of",
	"in",
	"import",
	"export",
	"from",
	"default",
	"new",
	"typeof",
	"class",
	"extends",
	"type",
	"interface",
	"true",
	"false",
	"null",
	"undefined",
	"void",
	"this",
	"async",
	"await",
]);

const TOKEN_RE =
	/(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)/g;

function escapeHtml(text: string): string {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlight(code: string): string {
	let result = "";
	let lastIndex = 0;

	for (const match of code.matchAll(TOKEN_RE)) {
		const [full, comment, string, number, word] = match;
		const index = match.index ?? 0;

		result += escapeHtml(code.slice(lastIndex, index));

		if (comment) {
			result += `<span class="text-neutral-400 italic">${escapeHtml(comment)}</span>`;
		} else if (string) {
			result += `<span class="text-emerald-700">${escapeHtml(string)}</span>`;
		} else if (number) {
			result += `<span class="text-orange-700">${escapeHtml(number)}</span>`;
		} else if (word && KEYWORDS.has(word)) {
			result += `<span class="text-purple-700">${escapeHtml(word)}</span>`;
		} else {
			result += escapeHtml(full);
		}

		lastIndex = index + full.length;
	}

	result += escapeHtml(code.slice(lastIndex));
	return result;
}
