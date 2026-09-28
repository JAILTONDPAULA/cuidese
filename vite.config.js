import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				// Injeta breakpoints e mixins em todo arquivo .scss, sem precisar importar.
				// Os próprios arquivos de src/styles/abstracts ficam de fora para evitar import circular.
				additionalData: (source, filename) =>
					filename.replaceAll('\\', '/').includes('/src/styles/abstracts/')
						? source
						: `@use "@/styles/abstracts" as *;\n${source}`,
			},
		},
	},
})
