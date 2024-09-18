import { deepStrictEqual, equal, notEqual } from 'node:assert'
import { beforeEach, describe, test } from 'node:test'
import { Singleton } from '../../src'
import type { Class } from '../../src/types'

class TestBase {
  private value = 0

  public retrieve() {
    return this.value
  }

  public increment() {
    this.value++
  }

  public reset() {
    this.value = 0
  }
}

// biome-ignore lint/style/noNonNullAssertion: Initialization in beforeEach
let Test: Class<TestBase, []> = null!

describe(import.meta.filename, () => {
  beforeEach(() => {
    Test =
      @Singleton
      class extends TestBase {}
  })

  test('should return initial value when retrieving from Singleton instance', () => {
    const first = new Test()
    const second = new Test()
    equal(first.retrieve(), 0)
    equal(second.retrieve(), 0)
  })

  test('should correctly increment value in Singleton instance', () => {
    const first = new Test()
    const second = new Test()
    first.increment()
    equal(first.retrieve(), 1)
    equal(second.retrieve(), 1)
  })

  test('should correctly handle multiple increments', () => {
    const test = new Test()
    test.increment()
    equal(test.retrieve(), 1)
    test.increment()
    equal(test.retrieve(), 2)
  })

  test('should reset value correctly in Singleton instance', () => {
    const first = new Test()
    first.increment()
    first.reset()
    equal(first.retrieve(), 0)
    const second = new Test()
    equal(second.retrieve(), 0)
  })

  test('should be deeply equal when comparing instances', () => {
    const first = new Test()
    const second = new Test()
    deepStrictEqual(first, second)
  })

  test('should return the same instance for both references', () => {
    const first = new Test()
    const second = new Test()
    equal(first, second)
  })

  test('should handle non-equal instances with different prototypes', () => {
    class DifferentClass extends TestBase {}
    const first = new Test()
    const second = new DifferentClass()
    notEqual(first, second)
  })

  test('should share state between all references', () => {
    const first = new Test()
    const second = new Test()
    first.increment()
    equal(second.retrieve(), 1)
    second.increment()
    equal(first.retrieve(), 2)
  })
})
