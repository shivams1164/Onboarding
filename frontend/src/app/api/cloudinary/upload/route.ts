import { createHash } from "crypto";
import { NextResponse } from "next/server";

const SUPPORTED_DOC_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  if (value.startsWith("your_")) {
    throw new Error(`Invalid value for ${name}. Please set the real Cloudinary value in .env.local.`);
  }
  return value;
}

function buildSignature(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${toSign}${apiSecret}`)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const cloudName = getRequiredEnv("CLOUDINARY_CLOUD_NAME");
    const apiKey = getRequiredEnv("CLOUDINARY_API_KEY");
    const apiSecret = getRequiredEnv("CLOUDINARY_API_SECRET");
    const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "hrms-documents";

    const formData = await request.formData();
    const uploaded = formData.get("file");

    if (!(uploaded instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (!SUPPORTED_DOC_TYPES.includes(uploaded.type)) {
      return NextResponse.json({ error: "Only PDF, PNG, and JPG files are allowed." }, { status: 400 });
    }

    if (uploaded.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File size must be 2MB or less." }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signatureParams = {
      folder: uploadFolder,
      timestamp,
    };
    const signature = buildSignature(signatureParams, apiSecret);

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", uploaded);
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("timestamp", timestamp);
    cloudinaryForm.append("folder", uploadFolder);
    cloudinaryForm.append("signature", signature);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok || !cloudinaryData?.secure_url) {
      return NextResponse.json(
        {
          error:
            cloudinaryData?.error?.message ||
            cloudinaryData?.message ||
            "Cloudinary upload failed.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      secureUrl: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
      format: cloudinaryData.format,
      bytes: cloudinaryData.bytes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
