import { name } from '../../package.json'

const namespace = Symbol(name)

export function getMetadata<
  T extends {
    [Symbol.metadata]: DecoratorMetadataObject | null
  },
>(target: T) {
  target[Symbol.metadata] ??= {}
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  target[Symbol.metadata]![namespace] ??= {} satisfies DecoratorMetadataObject
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return target[Symbol.metadata]![namespace]! as DecoratorMetadataObject
}
