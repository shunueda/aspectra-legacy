import type { Class } from '../types'

const identifier = Symbol.for(Inject.name)

interface Injectable<T> extends Class<T> {
  [identifier]?: T
}

export function Inject<T, K extends keyof T>(injectable: Injectable<T[K]>) {
  return (_: unknown, context: ClassFieldDecoratorContext<T, T[K]>) => {
    context.addInitializer(function () {
      const field = context.name as K
      this[field] = injectable[identifier] ||= new injectable()
    })
  }
}
