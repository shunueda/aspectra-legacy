import type { Class } from '../types'
import { getMetadata } from '../util/getMetadata'

const identifier = Symbol(Inject.name)

export function Inject<T, K extends keyof T, M extends T[K]>(module: Class<M>) {
  const metadata = getMetadata(module)
  metadata[identifier] ??= Reflect.construct(module, [])
  return (_: unknown, context: ClassFieldDecoratorContext<T, M>) => {
    context.addInitializer(function () {
      this[context.name as K] = metadata[identifier] as InstanceType<Class<M>>
    })
  }
}
