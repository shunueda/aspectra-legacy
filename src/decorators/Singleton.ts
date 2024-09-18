import type { AnyClass, AnyClassWithNoArgs } from '../types'

export function Singleton<T extends AnyClassWithNoArgs>(
  target: T,
  _: ClassDecoratorContext<T>,
) {
  let instance: T | null = null
  return class extends (target as AnyClass) {
    constructor() {
      if (instance) {
        // biome-ignore lint/correctness/noConstructorReturn: Properly handled
        return instance
      }
      // biome-ignore lint/correctness/noUnreachableSuper: Properly handled
      instance = super() as unknown as T
    }
  } as T
}
