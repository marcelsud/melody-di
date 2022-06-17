type Store = Map<string, Callable>;
type Callable = (container: Container) => any;

export class Container {
  constructor(private store: Store = new Map()) {}

  set(id: string, callback: Callable | any): void {
    this.store.set(id, callback);
  }

  get<T>(id: string): T {
    if (!this.store.has(id)) {
      throw new Error(`Service ${id} not found`);
    }

    let entry = this.store.get(id);

    if (entry === undefined || entry === null) {
      throw new Error(`Service ${id} not found`);
    }

    if (typeof entry === "function") {
      return entry(this);
    }

    return entry;
  }
}

export const container = new Container();

export function createContainer() {
  return new Container();
}
