import {Plugin, createFilter} from "vite";
import {emitFile, getAssetContent} from "./helpers";
import {DEFAULT_ASSETS} from "./constants";

export interface PluginOptions {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
  name?: string;
  regExp?: RegExp;
}

const redaePluginLibAssets = (options: PluginOptions = {}): Plugin => {
  const {
    include = DEFAULT_ASSETS,
    exclude,
    name = "[contenthash].[ext]",
    regExp,
  } = options;

  const filter = createFilter(include, exclude);
  const assetsPathMap = new Map<string, string>();
  let assetsDir: string;
  let outDir: string;

  return {
    name: "redae-plugin-lib-assets",
    apply: "build",
    enforce: "pre",
    configResolved(config) {
      const {build} = config;
      assetsDir = build.assetsDir;
      outDir = build.outDir;
    },
    async resolveId(source, importer) {
      const resolved = await this.resolve(source, importer);
      if (resolved && filter(resolved.id)) {
        const {id} = resolved;
        let assetPath: string | undefined | null = assetsPathMap.get(id);

        if (!assetPath) {
          const resourceQuery = id.split("?")[1];
          const content = getAssetContent(id);
          if (resourceQuery !== "url" || !content) return null;

          assetPath = emitFile(
            this,
            id,
            content,
            assetsDir,
            outDir,
            name,
            regExp,
          );
          assetsPathMap.set(id, assetPath);
        }
        return {id: `./${assetPath}`, external: "relative"};
      }
    },
    load(id) {
      const assetPath = assetsPathMap.get(id);
      if (assetPath) {
        return `export default '${outDir}${assetPath}'`;
      }
    },
  };
};

export default redaePluginLibAssets;
