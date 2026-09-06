import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "Thiếu NEXT_PUBLIC_API_URL" },
      { status: 500 },
    );
  }

  const { path } = await context.params;

  const targetUrl =
    `${API_URL}/${path.join("/")}` +
    request.nextUrl.search;

  try {
    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    const authorization = request.headers.get("authorization");

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    if (authorization) {
      headers.set("Authorization", authorization);
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "Không thể kết nối đến máy chủ API.",
      },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;