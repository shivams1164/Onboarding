import { NextResponse } from "next/server";

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

type IfscLookupResponse = {
  IFSC?: string;
  BANK?: string;
  BRANCH?: string;
  ADDRESS?: string;
  CITY?: string;
  STATE?: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const normalizedCode = code.trim().toUpperCase();

    if (!IFSC_REGEX.test(normalizedCode)) {
      return NextResponse.json({ error: "Invalid IFSC format." }, { status: 400 });
    }

    const response = await fetch(`https://ifsc.razorpay.com/${normalizedCode}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "IFSC code not found." }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to fetch IFSC details." }, { status: 502 });
    }

    const data = (await response.json()) as IfscLookupResponse;

    return NextResponse.json({
      ifsc: data.IFSC || normalizedCode,
      bank: data.BANK || "",
      branch: data.BRANCH || "",
      address: data.ADDRESS || "",
      city: data.CITY || "",
      state: data.STATE || "",
    });
  } catch {
    return NextResponse.json({ error: "Unable to lookup IFSC details." }, { status: 500 });
  }
}
