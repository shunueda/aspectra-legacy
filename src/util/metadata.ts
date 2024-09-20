import { name } from '../../package.json'

const namespace = Symbol(name)

export function getMetadata<T extends DecoratorMetadataObject>(target: {
  [Symbol.metadata]: DecoratorMetadataObject | null
}) {
  target[Symbol.metadata] ??= {}
  // biome-ignore lint/style/noNonNullAssertion: Assigned above
  target[Symbol.metadata]![namespace] ??= {} satisfies DecoratorMetadataObject
  // biome-ignore lint/style/noNonNullAssertion: Assigned above
  return target[Symbol.metadata]![namespace]! as T
}

export function getContextMetadata<T extends DecoratorMetadataObject>(context: {
  metadata: DecoratorMetadataObject
}) {
  context.metadata[namespace] ??= {} satisfies DecoratorMetadataObject
  return context.metadata[namespace] as T
}
