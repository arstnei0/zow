type Key = string | symbol
type Def<T extends Record<Key, any> = Record<Key, any>> = T
type Type<T extends Def = Def> = keyof T
type Data<T extends Def = Def, K extends Type<T> = Type<T>> = T[K]
type Item<T extends Def = Def, K extends Type<T> = Type<T>> = [K, Data<T, K>]
type Factory<T extends Def = Def> = {
	item: Item<T>
} & {
	[K in Type<T>]: (data: Data<T, K>) => Item<T, K>
}

export function zenum<T extends Def>() {
	const proxy = new Proxy(
		{},
		{
			get(target, t, receiver) {
				return (data: Data<T>) => [t, data]
			},
		}
	)

	return proxy as Factory<T>
}

export type inf<F extends Factory> = F["item"]

export function type<T extends Def = Def, K extends Type<T> = Type<T>>(
	item: Item<T, K>
): K {
	return item[0]
}

export function data<T extends Def = Def, K extends Type<T> = Type<T>>(
	item: Item<T, K>
): Data<T, K> {
	return item[1]
}

type Matchers<Return, T extends Def = Def, K extends Type<T> = Type<T>> = {
	[Key in K]: (data: Data<T, Key>) => Return
}

export function match<Return, T extends Def, K extends Type<T>>(
	item: Item<T, K>,
	matchers: Matchers<Return, T, K>
) {
	const matcher = Reflect.get(matchers, type(item))
	if (matcher) return matcher(data(item))

	throw new Error("Matching an enum item: No matchers found!")
}
