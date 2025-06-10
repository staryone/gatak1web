import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
