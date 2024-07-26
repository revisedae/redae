import {NextRequest, NextResponse} from "next/server";

export interface Middleware {
  matcher: string[];
  handler: (req: NextRequest) => NextResponse | Promise<NextResponse> | null;
}
