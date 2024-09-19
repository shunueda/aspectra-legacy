import type { Args, Func } from '../types'

export function Before<T, R, U extends Args>(func: Func<[...U, T], void, T>) {
  return (
    target: Func<U, R, T>,
    _: ClassMethodDecoratorContext<T, typeof target>,
  ) => {
    return function (this: T, ...args: U): R {
      func.call(this, ...args, this)
      return target.call(this, ...args)
    }
  }
}
