const fs = require("fs");
const pdfModule = require("pdf-parse");

async function parsePDF(file) {
  if (!file) {
    throw new Error("No PDF file provided.");
  }

  let buffer;

  // Accept a file path or an uploaded file object.
  if (Buffer.isBuffer(file)) {
    buffer = file;
  } else if (file.buffer && Buffer.isBuffer(file.buffer)) {
    buffer = file.buffer;
  } else if (file.path) {
    buffer = fs.readFileSync(file.path);
  } else {
    throw new Error("Unsupported PDF file format.");
  }

  let text = "";

  // Support both pdf-parse v2 (class-based) and legacy v1 (function-based)
  if (typeof pdfModule === "function") {
    const result = await pdfModule(buffer);
    text = result?.text || "";
  } else if (pdfModule && typeof pdfModule.PDFParse === "function") {
    const parser = new pdfModule.PDFParse({ data: buffer });
    const result = await parser.getText();
    text = result?.text || "";
    if (typeof parser.destroy === "function") {
      await parser.destroy().catch(() => {});
    }
  } else if (pdfModule && typeof pdfModule.default === "function") {
    const result = await pdfModule.default(buffer);
    text = result?.text || "";
  } else {
    throw new Error("PDF parser library could not be initialized.");
  }

  // Clean up any page separator markers added by pdf-parse v2 (e.g. "\n-- 1 of 1 --\n")
  text = text.replace(/\n*--\s*\d+\s+of\s+\d+\s*--\n*/gi, "\n").trim();

  if (!text) {
    throw new Error("No readable text found in the PDF.");
  }

  return text;
}

module.exports = { parsePDF };
