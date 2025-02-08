import { resolve } from 'path'
import { defineConfig } from 'vite'
import builtins from 'builtin-modules'
import banner from 'vite-plugin-banner'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
    // resolve: { alias: { '@': resolve(__dirname, './src') } },

    plugins: [
        banner(
            `/*! ${pkg.name}@${pkg.version} is released under the ${pkg.license} license, check ${pkg.repository.url} */`,
        ),
    ],

    build: {
        target: 'es2022',
        outDir: 'lib',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: 'obsidian-fnc',
        },
        rollupOptions: {
            treeshake: true,
            logLevel: 'info',
            external: [
                'obsidian',
                'electron',
                '@codemirror/autocomplete',
                '@codemirror/closebrackets',
                '@codemirror/collab',
                '@codemirror/commands',
                '@codemirror/comment',
                '@codemirror/fold',
                '@codemirror/gutter',
                '@codemirror/highlight',
                '@codemirror/history',
                '@codemirror/language',
                '@codemirror/lint',
                '@codemirror/matchbrackets',
                '@codemirror/panel',
                '@codemirror/rangeset',
                '@codemirror/rectangular-selection',
                '@codemirror/search',
                '@codemirror/state',
                '@codemirror/stream-parser',
                '@codemirror/text',
                '@codemirror/tooltip',
                '@codemirror/view',
                ...builtins,
            ],
        },
    },
})
