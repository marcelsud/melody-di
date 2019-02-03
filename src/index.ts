type Store = Map<string, Callable>;
export type Callable = (container: Container) => any

export interface ProviderInterface {
    register(c: Container)
}

export class Container {
    constructor(private store: Store = new Map()) {}

    register(provider: ProviderInterface) {
        provider.register(this)
    }

    set(id: string, callback: Callable | any): void {
        this.store.set(id, callback)
    }    

    async get<T>(id: string): Promise<T> {
        if (!this.store.has(id)) {
            throw new Error(`Service ${id} not found`)
        }

        let service = this.store.get(id)

        if (service === undefined) {
            throw new Error(`Service ${id} not found`)
        }

        if (typeof service === "function") {
            return service(this)
        }

        return service
    }
}
