import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function saveImage(image, sellerId) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(image.type)) {
        throw new Error("Invalid file type. Only JPG and PNG are allowed.");
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (image.size > maxSize) {
        throw new Error("File size exceeds 2MB limit.");
    }

    const ext = image.name.split(".").pop();
    const uniqueName = `${crypto.randomUUID()}.${ext}`;

    const sellerDir = path.join(process.cwd(), `public/uploads/seller/products/seller_${sellerId}`);
    await mkdir(sellerDir, { recursive: true });

    const filePath = path.join(sellerDir, uniqueName);

    // ✅ More efficient way to get Buffer from the stream
    const fileBuffer = Buffer.from(await image.arrayBuffer());

    await writeFile(filePath, fileBuffer);
    return `/uploads/seller/products/seller_${sellerId}/${uniqueName}`;
}
