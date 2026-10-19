import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "File attachments and signed URLs are no longer supported for creator applications." },
    { status: 410 }
  );
}
