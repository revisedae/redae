import {PathRegExp} from "@marvinh/path-to-regexp";
import {NextRequest, NextResponse} from "next/server";
import {Middleware} from "./types";

export const combineMiddlewares = (
  middlewares: Middleware[],
) => {
  const matchers = middlewares.reduce((matchers: string[], {matcher}) => {
    matchers.push(...matcher);
    return matchers;
  }, []);

  const pathCache = new Map<string, PathRegExp>();

  return {
    middleware(req: NextRequest) {
      for (const {matcher, handler} of middlewares) {
        for (const path of matcher) {
          let Path = pathCache.get(path);
          if (!Path) {
            Path = new PathRegExp(decodeURIComponent(path));
            pathCache.set(path, Path);
          }
          const matchResult = Path.match(req.nextUrl.pathname);
          if (matchResult) {
            const response = handler(req);
            if (response) {
              return response;
            }
          }
        }
      }

      return NextResponse.next();
    },
    config: {
      matcher: matchers,
    },
  };
};
