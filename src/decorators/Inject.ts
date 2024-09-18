import type { Class } from '../types'

const identifier = Symbol.for(Inject.name)

interface Injectable<T> extends Class<T> {
  [identifier]?: T
}

export function Inject<T, K extends keyof T, M extends T[K]>(module: Class<M>) {
  return (_: unknown, context: ClassFieldDecoratorContext<T, M>) => {
    context.addInitializer(function () {
      this[context.name as K] = (module as Injectable<M>)[identifier] ||=
        Reflect.construct(module, [])
    })
  }
}
