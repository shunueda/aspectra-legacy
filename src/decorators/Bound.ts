import type { Func0 } from '../types'

export function Bound<T, R>(
	_: unknown,
	context: ClassMethodDecoratorContext<T, Func0<R>>,
) {
	const method = context.name as keyof T
	context.addInitializer(function () {
		this[method] = (this[method] as Func0<R>).bind(this) as T[keyof T]
	})
}
