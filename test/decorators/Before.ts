import { deepStrictEqual, equal, throws } from 'node:assert'
import { beforeEach, describe, test } from 'node:test'
import { Before } from 'aspectra'

enum Call {
  BEFORE = 0,
  BEFORE2 = 2,
  METHOD = 1,
}

const calls: Call[] = []

class Test {
  public value = 0

  @Before(() => {
    calls.push(Call.BEFORE)
  })
  noArg() {
    calls.push(Call.METHOD)
  }

  @Before((a: number, b: number, thisArg: Test) => {
    calls.push(Call.BEFORE)
    equal(a, 1)
    equal(b, 2)
    equal(thisArg.value, 0)
  })
  twoArgs(a: number, b: number) {
    equal(a, 1)
    equal(b, 2)
    calls.push(Call.METHOD)
  }

  @Before(() => calls.push(Call.BEFORE))
  @Before(() => calls.push(Call.BEFORE2))
  methodWithMultipleBefore() {
    calls.push(Call.METHOD)
  }

  @Before(() => calls.push(Call.BEFORE))
  methodWithReturnValue() {
    calls.push(Call.METHOD)
    return 42
  }

  @Before(() => calls.push(Call.BEFORE))
  async asyncMethod() {
    calls.push(Call.METHOD)
    return 42
  }

  @Before(() => calls.push(Call.BEFORE))
  methodThatThrows() {
    calls.push(Call.METHOD)
    throw new Error()
  }

  @Before(() => {
    calls.push(Call.BEFORE)
    throw new Error()
  })
  methodThrowsBefore() {
    calls.push(Call.METHOD)
  }

  @Before(function () {
    equal(this.value, 100)
    calls.push(Call.BEFORE)
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

  test('should call Before before the method with arguments', () => {
    new Test().twoArgs(1, 2)
    deepStrictEqual(calls, [Call.BEFORE, Call.METHOD])
  })

  test('should call Before before a no-arg method', () => {
    new Test().noArg()
    deepStrictEqual(calls, [Call.BEFORE, Call.METHOD])
  })

  test('should call multiple Before decorators in order', () => {
    new Test().methodWithMultipleBefore()
    deepStrictEqual(calls, [Call.BEFORE, Call.BEFORE2, Call.METHOD])
  })

  test('should not interfere with method return value', () => {
    const result = new Test().methodWithReturnValue()
    deepStrictEqual(calls, [Call.BEFORE, Call.METHOD])
    equal(result, 42)
  })

  test('should call Before before an async method', async () => {
    const result = await new Test().asyncMethod()
    deepStrictEqual(calls, [Call.BEFORE, Call.METHOD])
    equal(result, 42)
  })

  test('should handle errors thrown by the method', () => {
    const test = new Test()
    throws(() => test.methodThatThrows())
    deepStrictEqual(calls, [Call.BEFORE, Call.METHOD])
  })

  test('should handle errors thrown by the Before function', () => {
    throws(() => new Test().methodThrowsBefore())
    deepStrictEqual(calls, [Call.BEFORE])
  })

  test('should preserve "this" context within the method', () => {
    const test = new Test()
    test.value = 100
    test.methodWithThisContext()
    deepStrictEqual(calls, [Call.BEFORE, Call.METHOD])
  })
})
