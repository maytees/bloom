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

### Effect

An effect is a callback function that runs immediately and automatically re runs whenever any signal it reads changes.

To use an effect, simply call the effect function from Bloom:

```typescript
const number = signal(5);

effect(() => {
	console.log(number(), " <-- Number just changed because I called it here!");
});

number(10); // will trigger the console.log statement to run
```

Notice how there's no dependency array? Bloom will auto detect which signals are called inside it and automatically add them as a dependency.

> [!IMPORTANT]  
> Calling `dispose` will simply _"shut off"_ the effect, it does not change the signal's behavior in any way. For example, in a counter increment app, when you call dispose on an effect updating a count text block, it will still increment the signal, it just won't run what's inside of the effect. If you're confused, see the counter example in the [playground](https://github.com/maytees/bloom/tree/master/playground)

To dispose of an effect:

```typescript
const name = signal("Jeff");

const { dispose: disposeNameEffect } = effect(() => {
	console.log(name(), " is a new name");
});

disposeNameEffect();
```

## Playground vs Examples

`/playground` - Interactive demo's of Bloom's reactivity engine. So in other words, current progress, not concept.

`/examples` - Bloom markup examples (not implemented yet)

To see the playground, go to the [folder's readme](https://github.com/maytees/bloom/tree/master/playground) to view instructions. These playground examples will most likely be on a website sooner or later.

On the other hand, see the `/examples` folder to see what the Bloom markup (similar to jsx) should look like in the future if things go to plan. As of right now, this is just a concept, it doesn't work.
