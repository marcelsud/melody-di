# MelodyDI

A simple Dependency Injection Container for Javascript/Typescript

## Installation

```
npm install --save melody-di
```

or 

```
yarn add melody-di
```

## Usage

Creating a container is a matter of creating a Container instance:

ES6/Typescript:

```typescript
import { Container } from 'melody-di'
const container = new Container()

// Some class you want to inject somewhere else
class CalculatorService {
  sum(a: number, b: number): number {
    return a + b;
  }
}

container.set('calculator_service', () => {
  return () => {
    return new CalculatorService()
  }
})


// ... somewhere else
const calculatorService = container.get<CalculatorService>('calculator_service')
console.log(calculatorService.sum(10, 5)) // 15
```

or

```javascript
const Container = require('melody-di').Container;
const container = new Container()
```





