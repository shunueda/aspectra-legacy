import { equal } from 'node:assert'
import { describe, test } from 'node:test'
import { Memoize } from 'aspectra'

class Test {
  constructor(private counter: number) {}

  public add(value: number): number {
    this.counter += value
    return this.counter
  }

  @Memoize
  public memoizedAdd(value: number): number {
    return this.add(value)
  }
}

describe(import.meta.filename, () => {
  test('should not memoize the result of a non-memoized method call', () => {
    const initial = 0
    const additional = 1
    const test = new Test(initial)
    equal(
      test.add(additional),
      initial + additional,
      'First addition result should be correct',
    )
    equal(
      test.add(additional),
      initial + additional * 2,
      'Result should not be cached',
    )
  })
  test('should cache the result of a method call', () => {
    const initial = 0
    const additional = 1
    const test = new Test(initial)
    equal(
      test.memoizedAdd(additional),
      initial + additional,
      'First addition result should be correct',
    )
    equal(
      test.memoizedAdd(additional),
      initial + additional,
      'Result should be cached',
    )
  })
})
