
# Melody Dependency Injection (melody-di)

A simple dependency injection Container for Javascript/Typescript.


- ☑️ Easy to use
- ☑️ Maintainable
- ☑️ Portable

---

## 📜 How to install

You can use NPM or Yarn to install it

```bash
npm install --save melody-di
```

or

```bash
yarn add melody-di
```

## 🔥 Usage

### Adding and getting a dependency

Creating a container and adding dependencies is pretty straightforward.

First, create the container:

```typescript
import { Container } from 'melody-di'
const container = new Container()
```

After that add some dependency into the container:

```typescript

class CalculatorService {
  sum(a: number, b: number): number {
    return a + b;
  }
}

container.set('calculator_service', () => {
  return new CalculatorService()
})
```

Then, get it somewhere else:

```typescript
const calculatorService = container.get<CalculatorService>('calculator_service')
console.log(calculatorService.sum(10, 5)) // 15
```

### Adding a plain value into the container

You can add a static value into the container, such as a number, a string, or even an object:

```typescript
container.set('some_config', 'SUPER_SECRET_INFORMATION')
container.set('some_important_ttl', 5000)
container.set('some_config_map', {
  something: 'QWERTYUIOPASDFGHJKL'   
})

// Directly instantiating the object
container.set('calculator_service', new CalculatorService())
```

## 🟢 Running the tests

To run the tets:

```bash
  npm t
```

or

```bash
  yarn test
```


## 🚀 About the author

I am a passionate Principal Software Engineer. Amongst my favorite topics are Clean Architecture, Domain-Driven Design and Event-Driven Architecture. 

You can find me out on:

- <a href="https://www.linkedin.com/in/marcelsud/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
- <a href="https://twitter.com/marcelsud" target="_blank"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>


## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

