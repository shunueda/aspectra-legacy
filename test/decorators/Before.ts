import { deepStrictEqual, equal } from 'node:assert'
import { describe, test } from 'node:test'
import { Before } from 'aspectra'

enum Call {
  METHOD = 0,
  BEFORE_0 = 1,
  BEFORE_1 = 2,
}

class Test {
  public readonly calls: Call[] = []

  constructor(public value: number) {}

  @Before((value, thisArg) => {
    thisArg.calls.push(Call.BEFORE_0)
    thisArg.value = value
  })
  public setWithBeforeAndIncrement(value: number) {
    this.calls.push(Call.METHOD)
    this.value++
  }

  @Before(thisArg => {
    thisArg.calls.push(Call.BEFORE_0)
    thisArg.value++
  })
  @Before(thisArg => {
    thisArg.calls.push(Call.BEFORE_1)
    thisArg.value++
  })
  public doubleIncrementWithBefore() {
    this.calls.push(Call.METHOD)
  }

  @Before((arg, thisArg) => {
    thisArg.calls.push(Call.BEFORE_0)
    thisArg.value = arg
  })
  public setWithBeforeAndReturn(arg: number) {
    this.calls.push(Call.METHOD)
    return this.value
  }

  @Before(thisArg => {
    thisArg.calls.push(Call.BEFORE_0)
    throw new Error()
  })
  public throwInBefore() {
    this.calls.push(Call.METHOD)
  }

  @Before(thisArg => {
    thisArg.calls.push(Call.BEFORE_0)
  })
  public throwInMethod() {
    this.calls.push(Call.METHOD)
    throw new Error()
  }
}

describe(import.meta.filename, () => {
  test('should set value before incrementing', () => {
    const test = new Test(0)
    test.setWithBeforeAndIncrement(5)
    equal(test.value, 6)
    deepStrictEqual(test.calls, [Call.BEFORE_0, Call.METHOD])
  })

  test('should handle multiple before decorators', () => {
    const test = new Test(0)
    test.doubleIncrementWithBefore()
    equal(test.value, 2)
    deepStrictEqual(test.calls, [Call.BEFORE_0, Call.BEFORE_1, Call.METHOD])
  })

  test('should get arg correctly', () => {
    const test = new Test(0)
    const result = test.setWithBeforeAndReturn(5)
    equal(result, 5)
    equal(test.value, 5)
    deepStrictEqual(test.calls, [Call.BEFORE_0, Call.METHOD])
  })

  test('should throw in before', () => {
    const test = new Test(0)
    try {
      test.throwInBefore()
    } catch (error) {
      equal(error instanceof Error, true)
    }
    deepStrictEqual(test.calls, [Call.BEFORE_0])
  })

  test('should throw in method', () => {
    const test = new Test(0)
    try {
      test.throwInMethod()
    } catch (error) {
      equal(error instanceof Error, true)
    }
    deepStrictEqual(test.calls, [Call.BEFORE_0, Call.METHOD])
  })
})
