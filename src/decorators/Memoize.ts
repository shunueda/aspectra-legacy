import hash from 'object-hash'
import type { Args, Func } from '../types'

export function Memoize<T, U extends Args, R>(
  target: Func<U, R>,
  _: ClassMethodDecoratorContext<T, typeof target>,
) {
  const cache = new Map<string, R>()
  return function wrapper(this: T, ...args: U): R {
    const key = hash(args)
    if (cache.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: Checked
      return cache.get(key)!
    }
    const result = target.apply(this, args)
    cache.set(key, result)
    return result
  }
}
