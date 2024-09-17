import type { Func0 } from '../types'

export function Bound<T, R>(
  _: unknown,
  context: ClassMethodDecoratorContext<T, Func0<R>>,
) {
  const name = context.name as keyof T
  context.addInitializer(function () {
    this[name] = (this[name] as Func0<R>).bind(this) as T[keyof T]
  })
}
