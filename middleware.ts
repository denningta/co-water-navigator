/* eslint-disable @next/next/no-server-import-in-page */
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

} 