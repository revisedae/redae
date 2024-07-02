# 💜 @redae/vite-plugin-lib-assets

A Vite Plugin extracts resource files referenced in [`library mode`](https://vitejs.dev/guide/build.html#library-mode) instead of embedded them as base64.

## Install

```bash
npm i @redae/vite-plugin-lib-assets -D
```

Or

```bash
yarn add @redae/vite-plugin-lib-assets -D
```

Or

```bash
pnpm add @redae/vite-plugin-lib-assets -D
```

## Usage

```typescript
// vite.config.ts
import {redaePluginLibAssets} from "@redae/vite-plugin-lib-assets";

export default defineConfig({
  plugins: [
    redaePluginLibAssets({
      /* options */
    }),
  ],
});
```

### `include`

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns indicate which files need to be handled by the plugin.

- Type: `string | RegExp | (string | RegExp)[]`
- Default: Same as Vite's default value for [`assetsInclude`](https://vitejs.dev/config/shared-options.html#assetsinclude), you can find the complete list [here](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts#L91-L135).
- Example:
  ```typescript
  redaePluginLibAssets({
    include: /\.a?png(\?.*)?$/
  })
  ```

### `exclude`

Same as `include`, but it is used to indicate the files that should to be omitted.

- Type: `string | RegExp | (string | RegExp)[]`
- Default: `undefined`.
- Example:
  ```typescript
  redaePluginLibAssets({
    exclude: /\.svg(\?.*)?$/
  })
  ```

### `name`

Output name of the resource file, its usage aligns with the [`name`](https://github.com/webpack-contrib/file-loader#name) option of the `file-loader`.

- Type: `string`
- Default: `"[contenthash].[ext]"`
- Example:
  - `string`
    ```typescript
    redaePluginLibAssets({
      name: "[name].[contenthash:8].[ext]?[query]"
    })
    ```

### `regExp`

Specifies a Regular Expression to extract parts of content(capture groups) from the file path and use [N] as placeholders in the `name` for replacement. Its usage aligns with the [`regexp`](https://github.com/webpack-contrib/file-loader#regexp) option of the `file-loader`.

- Type: `RegExp`
- Default: `undefined`
- Example:
  ```typescript
  libAssetsPlugin({
    regExp: /\/([^/]+)\/[^\.]+.png$/,
    name: "[1]-[name].[contenthash:8].[ext]"
  })
  ```
