import hash from 'object-hash'
import type { Args, Func } from '../types'

export function Memoize<T, U extends Args, R>(
  target: Func<U, R>,
  context: ClassMethodDecoratorContext<T, typeof target>,
) {
  const cache = new Map<string, R>()
  context.addInitializer(function () {
    this[context.name as keyof T] = ((...args: U) => {
      const key = hash(args)
      if (cache.has(key)) {
        // biome-ignore lint/style/noNonNullAssertion: Checked
        return cache.get(key)!
      }
      const result = target.call(this, ...args)
      cache.set(key, result)
      return result
    }) as T[keyof T]
  })
}
