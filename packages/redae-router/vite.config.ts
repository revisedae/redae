import {resolve} from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      outDir: ["dist"],
      rollupTypes: true,
      clearPureImport: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "lib/index.ts"),
        server: resolve(__dirname, "lib/server/index.ts")
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
      ],
    },
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./lib/components"),
      "@context": resolve(__dirname, "./lib/context"),
      "@history": resolve(__dirname, "./lib/history"),
      "@hooks": resolve(__dirname, "./lib/hooks"),
      "@router": resolve(__dirname, "./lib/router"),
      "@server": resolve(__dirname, "./lib/server"),
      "@types": resolve(__dirname, "./lib/types"),
      "@utils": resolve(__dirname, "./lib/utils"),
    },
  },
});