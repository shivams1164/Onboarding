import { NextResponse } from "next/server";

const BANK_NAMES_SOURCE_URL = "https://raw.githubusercontent.com/razorpay/ifsc/master/src/banknames.json";

let cachedBankNames: string[] | null = null;

export async function GET() {
  try {
    if (cachedBankNames) {
      return NextResponse.json({ banks: cachedBankNames });
    }

    const response = await fetch(BANK_NAMES_SOURCE_URL, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch bank names." }, { status: 502 });
    }

    const codeToName = (await response.json()) as Record<string, string>;
    const banks = Array.from(
      new Set(
        Object.values(codeToName)
          .map((name) => name.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    cachedBankNames = banks;

    return NextResponse.json({ banks });
  } catch {
    return NextResponse.json({ error: "Unable to load bank names." }, { status: 500 });
  }
}
