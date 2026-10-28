
import multer from "multer";
import { promisify } from "util";
import { parsePDF } from "../../lib/pdfParser";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadMiddleware = promisify(upload.single("file"));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    await uploadMiddleware(req, res);

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "Please upload a PDF file.",
      });
    }

    if (
      file.mimetype !== "application/pdf" ||
      !file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return res.status(400).json({
        error: "Only PDF files are allowed.",
      });
    }

    const resumeText = await parsePDF(file.buffer);

    return res.status(200).json({
      message: "PDF parsed successfully.",
      resumeText,
    });
  } catch (error) {
    console.error("PDF upload failed:", error);

    return res.status(400).json({
      error: "Could not process this PDF. Please try another file.",
    });
  }
}
