import type { Args } from '../types'

export function After<T, U extends Args, R>(
  func: (this: T, ...args: [...U, T]) => void,
) {
  return (
    target: (this: T, ...args: U) => R,
    _: ClassMethodDecoratorContext<T, (this: T, ...args: U) => R>,
  ) => {
    return function wrapper(this: T, ...args: U): R {
      const result = target.call(this, ...args)
      func.call(this, ...args, this)
      return result
    }
  }
}
