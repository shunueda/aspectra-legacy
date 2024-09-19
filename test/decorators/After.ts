import { deepStrictEqual, equal, throws } from 'node:assert'
import { describe, test } from 'node:test'
import { After } from 'aspectra'

enum Call {
  METHOD = 0,
  AFTER_0 = 1,
  AFTER_1 = 2,
}

class Test {
  public readonly calls: Call[] = []

  constructor(public value: number) {}

  @After((_, result, thisArg) => {
    thisArg.calls.push(Call.AFTER_0)
    thisArg.value = result + 1
  })
  public setWithAfterAndIncrement(value: number) {
    this.calls.push(Call.METHOD)
    return ++this.value
  }

  @After((result, thisArg) => {
    thisArg.calls.push(Call.AFTER_0)
    thisArg.value += result
  })
  @After((result, thisArg) => {
    thisArg.calls.push(Call.AFTER_1)
    thisArg.value += result
  })
  public doubleIncrementWithAfter() {
    this.calls.push(Call.METHOD)
    return ++this.value
  }

  @After((_, result, thisArg) => {
    thisArg.calls.push(Call.AFTER_0)
    thisArg.value = result + 2
  })
  public setWithAfterAndReturn(arg: number) {
    this.calls.push(Call.METHOD)
    return this.value
  }

  @After((_, thisArg) => {
    thisArg.calls.push(Call.AFTER_0)
    throw new Error()
  })
  public throwInAfter() {
    this.calls.push(Call.METHOD)
    return this.value
  }

  @After((_, thisArg) => {
    thisArg.calls.push(Call.AFTER_0)
  })
  public throwInMethod() {
    this.calls.push(Call.METHOD)
    throw new Error()
  }
}

describe(import.meta.filename, () => {
  test('should increment value after method call', () => {
    const test = new Test(0)
    test.setWithAfterAndIncrement(5)
    equal(test.value, 2)
    deepStrictEqual(test.calls, [Call.METHOD, Call.AFTER_0])
  })

  test('should handle multiple after decorators', () => {
    const test = new Test(0)
    test.doubleIncrementWithAfter()
    equal(test.value, 3)
    deepStrictEqual(test.calls, [Call.METHOD, Call.AFTER_1, Call.AFTER_0])
  })

  test('should set value after returning result', () => {
    const test = new Test(0)
    const result = test.setWithAfterAndReturn(5)
    equal(result, 0)
    equal(test.value, 2)
    deepStrictEqual(test.calls, [Call.METHOD, Call.AFTER_0])
  })

  test('should throw in after', () => {
    const test = new Test(0)
    throws(() => test.throwInAfter(), Error)
    deepStrictEqual(test.calls, [Call.METHOD, Call.AFTER_0])
  })

  test('should throw in method', () => {
    const test = new Test(0)
    throws(() => test.throwInMethod(), Error)
    deepStrictEqual(test.calls, [Call.METHOD])
  })
})
