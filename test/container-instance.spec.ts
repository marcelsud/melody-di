import { Container } from "../src/index";

const container = new Container();

const dateTimeParser = (timestamp: string): Date => {
  return new Date(Date.parse(timestamp));
};

const toUpperCase = (a: string): string => {
  return a.toUpperCase();
};

const toLowerCase = (a: string): string => {
  return a.toLowerCase();
};

beforeEach(() => {
  container.set("date_time_parser", () => dateTimeParser);
  container.set("upper_case_transformer", () => toUpperCase);
  container.set("lower_case_transformer", () => toLowerCase);
});

describe("All the tests needed and more", () => {
  it("it should add a parameter properly", () => {
    container.set("dummy_secret_key", "something");
    let value = container.get("dummy_secret_key");
    expect(value == "something");
  });

  it("it should add a simple service properly", async () => {
    const toUpperCase = container.get<Function>("upper_case_transformer");
    expect(toUpperCase("test")).toBe("TEST");

    const toLowerCase = container.get<Function>("lower_case_transformer");
    expect(toLowerCase("TEST")).toBe("test");
  });

  it("should work properly when using the container creation function", () => {
    const parse = container.get<Function>("date_time_parser");
    const date = parse("2022-06-15");
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toEqual("2022-06-15T00:00:00.000Z");
  });
});
