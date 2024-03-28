import path from "path"
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'

const isObjectWithDefaultFunction = (module: unknown): module is { default: typeof monacoEditorPluginModule } => (
    module != null &&
    typeof module === 'object' &&
    'default' in module &&
    typeof module.default === 'function'
)

const monacoEditorPlugin = isObjectWithDefaultFunction(monacoEditorPluginModule)
    ? monacoEditorPluginModule.default
    : monacoEditorPluginModule

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        monacoEditorPlugin({})
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
