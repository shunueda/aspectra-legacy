import { createHash } from 'node:crypto'
import type { Serializable } from '../types'

export function hash<T extends Serializable>(object: T): string {
  return createHash('sha256').update(serialize(object)).digest('hex')
}

function serialize(value: Serializable): string {
  if (value === undefined) {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    const contents = value.map(serialize).join(',')
    return `[${contents}]`
  }
  if (typeof value === 'object') {
    const serialized = Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `"${k}":${serialize(v)}`)
      .join(',')
    return `{${serialized}}`
  }
  if (typeof value === 'bigint') {
    return `"${value}"` // BigInt is serialized as a string
  }
  return JSON.stringify(value)
}
