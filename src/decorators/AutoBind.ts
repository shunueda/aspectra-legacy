import type { AnyArgs, AnyClass } from '../types'

export function AutoBind<T extends AnyClass>(
  target: T,
  _: ClassDecoratorContext<T>,
) {
  return class extends target {
    constructor(...args: AnyArgs) {
      super(...args)
      Object.getOwnPropertyNames(target.prototype)
        .filter(it => it !== 'constructor' && typeof this[it] === 'function')
        .forEach(it => {
          this[it] = this[it].bind(this)
        })
    }
  }
}
