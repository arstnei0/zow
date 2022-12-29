import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {},
    build: {
        lib: {
            entry: 'src/index.ts',
        },
        target: ['esm']
    }
})
