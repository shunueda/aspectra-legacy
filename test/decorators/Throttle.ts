import { doesNotThrow, throws } from 'node:assert'
import { describe, test } from 'node:test'
import { setTimeout } from 'node:timers/promises'
import { Throttle } from '../../src/decorators/Throttle'

const interval = 4

class Test {
  @Throttle(interval)
  public method() {}
}

describe(import.meta.filename, () => {
  test('first call should not be throttled', () => {
    const test = new Test()
    doesNotThrow(() => test.method())
  })

  test('should be throttled', async () => {
    const test = new Test()
    doesNotThrow(() => test.method())
    await setTimeout(interval / 2)
    throws(() => test.method())
  })

  test('should not be throttled', async () => {
    const test = new Test()
    doesNotThrow(() => test.method())
    await setTimeout(interval * 2)
    doesNotThrow(() => test.method())
  })
})
