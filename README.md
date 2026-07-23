# Bloom

A simple frontend library.

## Ethos

Bloom is a signals-based component language that compiles to TypeScript — building UIs without the < and >. A project for learning how frameworks work.

## Current State

Currently, there is no Bloom markup language, no `effect`, no `computed` (memoization), etc. There is only a `signal` (state)

## Docs

### Signals

A signal is a way to get and set reactive values; this is similar to `useState` in React.

Unlike react, you don't have a seperate values for get and set; instead, you get one function that does both:

```typescript
const name = signal();

// Set the state
name("Adam");

// Get the state
name();
```

Generics, objects, and default values also work:

```typescript
type Human = {
	name: string;
	age: number;
};

const human = signal<Human>({
	name: "Maytham",
	age: 19,
});

// Type error!
human("not a human");
```

You can also use a dollar sign `$` as a shorthand for creating a signal:

```typescript
const num = $(5);
// ^^^ same as cosnt num = signal(5);
```

## Examples

See the `/examples` folder to see what the Bloom markup (similar to jsx) should look like.
