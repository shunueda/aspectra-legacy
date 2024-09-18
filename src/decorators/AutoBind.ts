import type { AnyArgs, AnyClass } from '../types'

export function AutoBind<T extends AnyClass>(
  target: T,
  _: ClassDecoratorContext<T>,
) {
  return class extends target {
    constructor(...args: AnyArgs) {
      super(...args)
      Object.getOwnPropertyNames(target.prototype)
        .filter(
          (key) =>
            Object.getOwnPropertyDescriptor(target.prototype, key)
              ?.configurable,
        )
        .forEach((key) => {
          this[key] = this[key].bind(this)
        })
    }
  }
}
