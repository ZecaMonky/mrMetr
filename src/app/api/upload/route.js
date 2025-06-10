import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 30000
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
  return NextResponse.json({ error: "Только изображения разрешены" }, { status: 400 });
}

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary ошибка:", err);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
