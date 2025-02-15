import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    // esbuild: {
    //     minifyIdentifiers: false, // Keeps class names unchanged
    //     minifySyntax: false, // Prevents syntax simplifications
    //     minifyWhitespace: true, // Keeps whitespace minification (optional)
    // },
    build: {
        minify: false,
        terserOptions: {
            mangle: {
                properties: false, // Prevents class property name changes
            },
            keep_classnames: true, // Keeps class names intact
            keep_fnames: true, // Keeps function names unchanged
        },
        lib: {
            entry: path.resolve(__dirname, "src/index.js"), // Your main entry file
            name: "TryFeature", // Global name for UMD builds
            fileName: (format) => `index.${format === "cjs" ? "cjs" : "mjs"}`,
            formats: ["cjs"], // Export both ESM and CommonJS
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
