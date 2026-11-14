# MeloDI

A small dependency injection container for JavaScript and TypeScript, with no runtime dependencies.

## Install

Install the package from npm:

```sh
npm install @marcelsud/melodi
```

```typescript
import { Container, createContainer, container } from '@marcelsud/melodi';
```

The package exports `Container`, `createContainer` and a shared `container`.

## Register and resolve services

```typescript
import { createContainer } from '@marcelsud/melodi';

class Calculator {
  sum(a: number, b: number): number {
    return a + b;
  }
}

const services = createContainer();
services.set('calculator', () => new Calculator());
const calculator = services.get<Calculator>('calculator');
console.log(calculator.sum(10, 5)); // 15
```

A factory receives the current container and runs on every `get`. To share a single instance, register that instance as a value:

```typescript
const calculator = new Calculator();
services.set('sharedCalculator', calculator);
services.set('taxRate', 0.2);
```

All function values are treated as factories. To resolve a function as a value, wrap it in another function: `services.set('transform', () => myTransform)`.

## Resolve asynchronous factories

```typescript
services.set('greeting', async () => 'Hello');
const greeting = await services.get<Promise<string>>('greeting');
```

MeloDI returns the factory's value directly; callers must await promises themselves. It does not add caching, automatic constructor injection, disposal or cycle detection.

## API and errors

| Export | Behavior |
| --- | --- |
| `new Container()` | Create an independent container. |
| `createContainer()` | Create an independent container. |
| `container` | Shared container for this installed module instance. |
| `set(id, valueOrFactory)` | Register or replace a string key. |
| `get<T>(id)` | Resolve a value or invoke its factory with this container. |

Missing keys and keys holding null or undefined throw `Error("Service <id> not found")`. Other values, including false, zero and empty strings, can be resolved. The generic type argument describes the caller's expected type; it does not validate values at runtime.

## Maintenance

The project has a stable API. Maintenance focuses on reproducible bugs, packaging and compatibility, without expanding into a framework. CI checks the source and packed consumers on Node.js 22, 24 and 26. Other JavaScript runtimes are best effort until explicitly verified.

## Develop and verify

```sh
npm ci
npm run check
```

The check builds the library, runs the unit tests and verifies the packed package from an isolated JavaScript/TypeScript consumer. Publishing requires a separate authenticated release action; CI does not publish automatically.

## License

[MIT](LICENSE).
