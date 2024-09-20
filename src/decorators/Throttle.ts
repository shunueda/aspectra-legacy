import type { Args, Func } from '../types'

const symbol = Symbol(Throttle.name)

interface Throttled {
  [symbol]?: Map<string | symbol, number>
}

export function Throttle<T, R, U extends Args>(interval: number) {
  return (
    target: Func<U, R, T>,
    context: ClassMethodDecoratorContext<T, typeof target>,
  ) => {
    return function (this: T & Throttled, ...args: U) {
      const now = performance.now()
      // biome-ignore lint/suspicious/noAssignInExpressions: Properly handled
      const timestamps = (this[symbol] ??= new Map<string | symbol, number>())
      if (now - (timestamps.get(context.name) ?? 0) < interval) {
        throw new Error(Throttle.name)
      }
      timestamps.set(context.name, now)
      return target.apply(this, args)
    }
  }
}
