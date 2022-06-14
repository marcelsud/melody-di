import { Container } from "../src/index";

enum Transformers {
  UPPER_CASE = 1,
}

class UpperCaseTransformer {
  transform(a: string) {
    return a.toUpperCase();
  }
}

class Transformer {
  constructor(private upperCase: UpperCaseTransformer) {}
  transform(subject: string, type: Transformers) {
    if (type === Transformers.UPPER_CASE) {
      return this.upperCase.transform(subject);
    }
    throw new Error("Invalid transformer");
  }
}

let container: Container;

beforeEach(() => {
  container = new Container();
  container.set("upper_case_transformer", () => {
    return new UpperCaseTransformer();
  });

  container.set("async_transformer", async (c: Container) => {
    const upperCaseTransformer = await c.get<Promise<UpperCaseTransformer>>(
      "upper_case_transformer"
    );
    return new Transformer(upperCaseTransformer);
  });

  container.set("transformer", (c: Container) => {
    const upperCaseTransformer = c.get<UpperCaseTransformer>(
      "upper_case_transformer"
    );
    return new Transformer(upperCaseTransformer);
  });
});

describe("All the tests needed and more", () => {
  it("it should add a parameter properly", () => {
    container.set("dummy_secret_key", "something");
    let value = container.get("dummy_secret_key");
    expect(value == "something");
  });

  it("it should add a simple service properly", async () => {
    const transformer = container.get<UpperCaseTransformer>(
      "upper_case_transformer"
    );
    expect(transformer.transform("test")).toBe("TEST");
  });


  it("it should add a simple service that depends on another one properly", async () => {
    const transformer = container.get<Transformer>("transformer");
    expect(transformer.transform("test", Transformers.UPPER_CASE)).toBe("TEST");
  });

  it("it should add a simple service that depends on another one properly and retrieve it from a promise", async () => {
    const transformer = await container.get<Promise<Transformer>>("async_transformer");
    expect(transformer.transform("test", Transformers.UPPER_CASE)).toBe("TEST");
  });
});
