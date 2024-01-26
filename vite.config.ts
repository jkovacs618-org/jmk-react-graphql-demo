import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import VitePluginBuildMetadata from 'vite-plugin-build-metadata'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    const vite_server_port: number = Number(env.VITE_NODEJS_PORT) || 5174

    return {
        server: {
            host: true,
            port: vite_server_port,
            watch: {
                ignored: ['**/.idea/**'],
            },
        },
        optimizeDeps: {
            include: ['fast-deep-equal'],
        },
        plugins: [
            VitePluginBuildMetadata({
                fileName: 'build-meta',
            }),

            // See: https://www.npmjs.com/package/vite-plugin-environment
            EnvironmentPlugin('all'),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    }
})
