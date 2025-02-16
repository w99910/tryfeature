import { defineConfig } from "vite";
import path from "path";
export default defineConfig({
    esbuild: {
        minifyIdentifiers: false, // Keeps class names unchanged
        minifySyntax: false, // Prevents syntax simplifications
        minifyWhitespace: true, // Keeps whitespace minification (optional)
    },
    plugins: [],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"), // Your main entry file
            name: "TryFeature", // Global name for UMD builds
            fileName: 'index'
        },
        rollupOptions: {
            external: [
                "sutando"
            ], // External dependencies (optional)
            output: {
                exports: "named", // Ensures named exports work in CJS
            },
        },
    },
});
