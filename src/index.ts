type Store = Map<string, Callable>;
export type Callable = (container: Container) => any

export interface ProviderInterface {
    register(c: Container): void
}

export class Container {
    constructor(private store: Store = new Map()) {}

    register(provider: ProviderInterface) {
        provider.register(this)
    }

    set(id: string, callback: Callable | any): void {
        this.store.set(id, callback)
    }    

    get<T>(id: string): T {
        if (!this.store.has(id)) {
            throw new Error(`Service ${id} not found`)
        }

        let entry = this.store.get(id)

        if (entry === undefined || entry === null) {
            throw new Error(`Service ${id} not found`)
        }

        if (typeof entry === "function") {
            return entry(this)
        }

        return entry
    }
}
