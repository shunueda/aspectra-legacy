import { equal } from 'node:assert'
import { describe } from 'node:test'
import { Memoize } from 'aspectra'

// biome-ignore lint/complexity/noStaticOnlyClass: testing static methods
class Test {
  public static callCount = 0

  @Memoize
  public static add(a: number, b: number): number {
    Test.callCount++
    return a + b
  }
}

describe(import.meta.filename, () => {
  const { add } = Test

  equal(add(1, 2), 3)
  equal(Test.callCount, 1)

  equal(add(1, 2), 3)
  equal(Test.callCount, 1)

  equal(add(2, 3), 5)
  equal(Test.callCount, 2)

  equal(add(2, 3), 5)
  equal(Test.callCount, 2)
})
