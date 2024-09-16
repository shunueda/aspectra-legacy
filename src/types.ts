// biome-ignore lint/suspicious/noExplicitAny: TypeScript restriction
export type Args = any[]
export type NoArgs = []
export type Class<T> = new (...args: Args) => T

export type Func<Args extends unknown[], R> = (...args: Args) => R
export type Func0<R> = Func<[], R>
export type Func1<A, R> = Func<[A], R>
export type Func2<A, B, R> = Func<[A, B], R>
export type Func3<A, B, C, R> = Func<[A, B, C], R>
