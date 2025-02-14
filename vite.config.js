import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"), // Your main entry file
            name: "TryFeature", // Global name for UMD builds
            fileName: (format) => `index.${format === "cjs" ? "cjs" : "mjs"}`,
            formats: ["es", "cjs"], // Export both ESM and CommonJS
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
