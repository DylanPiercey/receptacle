namespace Receptacle {
    export interface Options {
        id?: string;
        max?: number;
        items?: any[];
    }

    export interface SetOptions<X> {
        ttl?: number;
        refresh?: boolean;
        meta?: X;
    }
}

class Receptacle<T, X = undefined> {
    constructor(options?: Receptacle.Options);
    public id: string;
    public max: number;
    public items: T[];
    public size: number;
    public has(key: string): boolean;
    public get(key: string): T;
    public meta(key: string): X;
    public set(key: string, value: T, options?: Receptacle.SetOptions<X>): void;
    public delete(key: string): void;
    public expire(key: string, ms: number = 0): void;
    public clear(): void;
}

export = Receptacle;
