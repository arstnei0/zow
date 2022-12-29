import { expect, expectTypeOf, it, should } from "vitest"
import { data, match, type, zenum } from "../src/enum.js"

it("enum working correctly", () => {
	const Response = zenum<{
		success: string
		loading: void
		error: Error
	}>()
	type Response = typeof Response.item

	const item1 = Response.success("Hello")
	const item2 = Response.loading()
	const item3 = Response.error(new Error("Network error"))

	expect(item1).toEqual(["success", "Hello"])
	expect(item2).toEqual(["loading", undefined])
	expect(item3).toEqual(["error", new Error("Network error")])

	const items = [item1, item2, item3]
	const results = items.map((item) =>
		match(item, {
			success(data) {
				expect(data).toEqual("Hello")
			},
			loading(data) {
				expectTypeOf(data).toBeVoid()
			},
			error(error) {
				expect(error).toEqual(new Error("Network error"))
			},
		})
	)

	expect(type(item1)).toEqual("success")
	expect(data(item1)).toEqual("Hello")

	expect(() => {
		match(item1, {} as any)
	})
})
