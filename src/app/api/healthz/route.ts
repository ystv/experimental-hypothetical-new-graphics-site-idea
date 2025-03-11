// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$executeRaw(Prisma.sql`SELECT 1;`);
  } catch (_e) {
    return NextResponse.json(
      { status: "not ok :(", reason: "Could not connect to database" },
      { status: 500 },
    );
  }
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
