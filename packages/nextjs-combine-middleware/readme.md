# 💜 @redae/nextjs-combine-middleware

Package for Next.js that simplifies middleware management based on pathname matching. It allows developers to define middleware sets and apply them to requests automatically, depending on the URL paths.

## Install

```bash
npm i @redae/nextjs-combine-middleware -D
```

Or

```bash
yarn add @redae/nextjs-combine-middleware -D
```

Or

```bash
pnpm add @redae/nextjs-combine-middleware -D
```

## Usage

```typescript
// middleware.ts
export {middleware, config} from "./middlewares";
```

```typescript
//middlewares/index.ts
import {combineMiddlewares} from "@redae/nextjs-combine-middleware";
import {auth} from "./auth";

export const {middleware, config} = combineMiddlewares([auth]);
```

```typescript
//middlewares/auth.ts
import {NextRequest, NextResponse} from "next/server";
import {defineMiddleware} from "@redae/nextjs-combine-middleware";

export const auth = defineMiddleware({
  matcher: ["/@me", "/signin"],
  handler: (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;

    const {pathname} = req.nextUrl;

    if (pathname === "/@me" && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (pathname === "/signin" && token) {
      return NextResponse.redirect(new URL("/@me", req.url));
    }

    return NextResponse.next();
  },
});
```

## Contributors

[![contributors](https://contrib.rocks/image?repo=revisedae/redae)](https://github.com/revisedae/redae/graphs/contributors)
