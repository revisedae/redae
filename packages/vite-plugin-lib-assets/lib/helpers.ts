import {PluginContext, EmittedAsset} from "rollup";
import {interpolateName} from "loader-utils";
import fs from "node:fs";
import path from "node:path";

type LoaderContext = Parameters<typeof interpolateName>[0];

const assetsContentMap = new Map<string, Buffer>();
export const getAssetContent = (
  id: string,
) => {
  let content: Buffer | undefined | null = assetsContentMap.get(id);
  const pureId = id.split("?")[0];
  if (!content) {
    if (!fs.existsSync(pureId)) {
      console.warn(`[redae]: file not found ${id}`);
      content = null;
    } else {
      content = fs.readFileSync(pureId);
      assetsContentMap.set(id, content);
    }
  }
  return content;
};

export const emitFile = (
  ctx: PluginContext,
  id: string,
  content: Buffer,
  assetsDir: string,
  outDir: string,
  name: string,
  regExp?: RegExp,
): string => {
  const [pureId, resourceQuery] = id.split("?");
  const loaderContext = {resourcePath: pureId, resourceQuery} as LoaderContext;
  const url = interpolateName(loaderContext, name, {content, regExp});

  let assetPath = path.posix.join(assetsDir, url);
  const filename = assetPath.replace(`?${resourceQuery}`, "");
  const fullname = path.join(
    path.isAbsolute(outDir) ? process.cwd() : "",
    outDir,
    assetPath,
  );

  const emitted: EmittedAsset = {
    fileName: filename,
    name: fullname,
    source: content,
    type: "asset",
  };
  ctx.emitFile(emitted);

  return assetPath;
};
