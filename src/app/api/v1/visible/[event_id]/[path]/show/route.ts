import { api } from "@/trpc/server";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(
  req: NextApiRequest,
  { params }: { params: Promise<{ event_id: string; path: string }> },
) {
  const awaitedParams = await params;

  await api.visibleState.show(awaitedParams);

  return NextResponse.json({ ok: true }, { status: 200 });
}
