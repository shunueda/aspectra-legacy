import { deepStrictEqual, equal, throws } from 'node:assert'
import { beforeEach, describe, test } from 'node:test'
import { After } from 'aspectra'

enum Call {
  AFTER = 0,
  AFTER2 = 1,
  METHOD = 2,
}

const calls: Call[] = []

class Test {
  public value = 0

  @After(() => {
    calls.push(Call.AFTER)
  })
  noArg() {
    calls.push(Call.METHOD)
  }

  @After((a: number, b: number, thisArg: Test) => {
    calls.push(Call.AFTER)
    equal(a, 1)
    equal(b, 2)
    equal(thisArg.value, 0)
  })
  twoArgs(a: number, b: number) {
    equal(a, 1)
    equal(b, 2)
    calls.push(Call.METHOD)
  }

  @After(() => calls.push(Call.AFTER))
  @After(() => calls.push(Call.AFTER2))
  methodWithMultipleAfter() {
    calls.push(Call.METHOD)
  }

  @After(() => calls.push(Call.AFTER))
  methodWithReturnValue() {
    calls.push(Call.METHOD)
    return 42
  }

  @After(() => calls.push(Call.AFTER))
  async asyncMethod() {
    calls.push(Call.METHOD)
    return 42
  }

  @After(() => calls.push(Call.AFTER))
  methodThatThrows() {
    calls.push(Call.METHOD)
    throw new Error()
  }

  @After(() => {
    calls.push(Call.AFTER)
    throw new Error()
  })
  methodThrowsAfter() {
    calls.push(Call.METHOD)
  }

  @After(function () {
    equal(this.value, 100)
    calls.push(Call.AFTER)
  })
  methodWithThisContext() {
    equal(this.value, 100)
    calls.push(Call.METHOD)
  }
}

describe(import.meta.filename, () => {
  beforeEach(() => {
    calls.length = 0
  })

  test(`should call ${After.name} after the method with arguments`, () => {
    new Test().twoArgs(1, 2)
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER])
  })

  test(`should call ${After.name} after a no-arg method`, () => {
    new Test().noArg()
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER])
  })

  test(`should call multiple ${After.name} decorators in order`, () => {
    new Test().methodWithMultipleAfter()
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER2, Call.AFTER])
  })

  test('should not interfere with method return value', () => {
    const result = new Test().methodWithReturnValue()
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER])
    equal(result, 42)
  })

  test(`should call ${After.name} after an async method`, async () => {
    const result = await new Test().asyncMethod()
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER])
    equal(result, 42)
  })

  test('should handle errors thrown by the method', () => {
    const test = new Test()
    throws(test.methodThatThrows)
    deepStrictEqual(calls, [Call.METHOD])
  })

  test(`should handle errors thrown by the ${After.name} function`, () => {
    throws(() => new Test().methodThrowsAfter())
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER])
  })

  test(`should preserve 'this' context within the method`, () => {
    const test = new Test()
    test.value = 100
    test.methodWithThisContext()
    deepStrictEqual(calls, [Call.METHOD, Call.AFTER])
  })
})
