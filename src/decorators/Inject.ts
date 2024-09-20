import type { Class } from '../types'
import { getMetadata } from '../util/metadata'

const symbol = Symbol(Inject.name)

interface InjectMetadata<T> extends DecoratorMetadataObject {
  [symbol]?: T
}

export function Inject<T, U extends T[keyof T]>(module: Class<U>) {
  const metadata = getMetadata<InjectMetadata<U>>(module)
  return (_: unknown, context: ClassFieldDecoratorContext<T, U>) => {
    context.addInitializer(function () {
      this[context.name as keyof T] = metadata[symbol] ??= Reflect.construct(
        module,
        [],
      )
    })
  }
}
