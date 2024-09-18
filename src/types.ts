export type Args = unknown[]
export type NoArgs = []
// biome-ignore lint/suspicious/noExplicitAny: TypeScript restriction
export type AnyArgs = any[]

// biome-ignore lint/complexity/noBannedTypes: Definition
export interface Class<T, A extends Args = unknown[]> extends Function {
  new (...args: A): T
}
// biome-ignore lint/suspicious/noExplicitAny: TypeScript restriction
export type AnyClass = Class<any, AnyArgs>

export type Func<A extends Args, R, T = unknown> = (this: T, ...args: A) => R
export type Func0<R, T = unknown> = Func<NoArgs, R, T>
export type Func1<A, R, T = unknown> = Func<[A], R, T>

export type Serializable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable }
  | Date
