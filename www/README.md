# Bloom Website

**Note: Bun has issues with segfaults, if the dev server crashes for no reason, just start it up again. This should probably be fixed with their new Rust rewrite.**

First, run the tailwind server im watch mode:

```bash
# from project root
bun site:css
```

Then start the dev server:

```bash
# from project root
bun site:dev
```

Building:

```bash
# from project root
bun site:build
```

Output will be in project root's `dist` folder.
