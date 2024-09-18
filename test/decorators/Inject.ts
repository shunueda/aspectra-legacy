import { equal } from 'node:assert'
import { describe, test } from 'node:test'
import { Bind, Inject } from 'aspectra'
import { version } from '../../package.json'

class Module {
  public readonly version = version

  @Bind
  public getVersion(): string {
    return this.version
  }
}

class Test {
  @Inject(Module)
  public readonly module!: Module

  @Bind
  public getModuleVersion(): string {
    return this.module.version
  }
}

describe(import.meta.filename, () => {
  test(`should inject ${Module.name} correctly`, () => {
    const { module } = new Test()
    equal(module.version, version, 'Injected module version mismatch')
  })

  test(`should retrieve version from ${Module.name} using method`, () => {
    const test = new Test()
    equal(test.getModuleVersion(), version, 'Injected module version mismatch')
  })

  test(`should retrieve @${Bind.name} method from injected ${Module.name}`, () => {
    const { getVersion } = new Test().module
    equal(getVersion(), version, 'Injected module version mismatch')
  })

  test(`should inject a shared ${Module.name} instance across multiple ${Test.name} instances`, () => {
    equal(
      new Test().module,
      new Test().module,
      `${Module.name} should be shared between ${Test.name} instances`,
    )
  })
})
