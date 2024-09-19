import type { Args, Func } from '../types'

export function After<T, R, U extends Args>(func: Func<[...U, R, T], void, T>) {
  return (
    target: Func<U, R, T>,
    _: ClassMethodDecoratorContext<T, typeof target>,
  ) => {
    return function (this: T, ...args: U): R {
      const result = target.call(this, ...args)
      func.call(this, ...args, result, this)
      return result
    }
  }
}
