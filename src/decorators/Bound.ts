import type { Func0 } from '../types'

export function Bound<T, R>(
  target: Func0<R, T>,
  context: ClassMethodDecoratorContext<T, typeof target>,
) {
  context.addInitializer(function () {
    this[context.name as keyof T] = target.bind(this) as T[keyof T]
  })
}
