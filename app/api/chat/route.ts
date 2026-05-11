import { NextRequest, NextResponse } from "next/server";
import { getResponse } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  const { city, message } = await req.json();

  if (!city || !message) {
    return NextResponse.json({ error: "Missing city or message" }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const response = getResponse(city, message);
  return NextResponse.json({ response });
}
