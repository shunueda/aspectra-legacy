import type { Args, Func } from '../types'

export function After<T, U extends Args, R>(func: Func<[...U, T], void, T>) {
  return (
    target: Func<U, R, T>,
    _: ClassMethodDecoratorContext<T, typeof target>,
  ) =>
    function (this: T, ...args: U): R {
      const result = target.call(this, ...args)
      func.call(this, ...args, this)
      return result
    }
}
