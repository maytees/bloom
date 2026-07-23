# Bloom for Zed

Syntax highlighting for `.bloom` files.

## Install

1. Clone this repo.
2. Open Zed.
3. `cmd-shift-x` to open Extensions.
4. Click **Install Dev Extension**.
5. Pick the `bloom/editors/zed/` folder.

Open a `.bloom` file. Done.

## Notes

- Zed builds the grammar from `../tree-sitter-bloom` at the commit pinned in `extension.toml`. Keep both folders side by side.
- TypeScript inside `.bloom` is highlighted by Zed's built-in TypeScript grammar.
- Changed the grammar? Run `./sync.sh` in the parent folder, then hit **Rebuild** on the extension in Zed.
