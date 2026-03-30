import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/index.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${String(timestamp)}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const uploadToCloudinary = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "portfolio",
  });
  return result.secure_url;
};

// Función específica para documentos (PDF, DOC, DOCX)
export const uploadDocumentToCloudinary = async (
  filePath: string,
  customName?: string,
) => {
  const publicId = customName || `cvIvanJaimes_${Date.now()}`;

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "portfolio",
    resource_type: "raw",
    public_id: publicId,
    use_filename: false,
    unique_filename: false,
  });
  return result.secure_url;
};

interface CloudinaryDeleteResult {
  result: string;
}

const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
};

export const deleteFromCloudinary = async (url: string): Promise<boolean> => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn("[Cloudinary] No se pudo extraer public_id de:", url);
    return false;
  }

  try {
    const result = (await cloudinary.uploader.destroy(
      publicId,
    )) as CloudinaryDeleteResult;
    return result.result === "ok";
  } catch (error) {
    console.error("[Cloudinary] Error al borrar:", error);
    return false;
  }
};
