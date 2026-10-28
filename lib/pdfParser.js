
const fs = require("fs");
const pdfParse = require("pdf-parse");

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

  const result = await pdfParse(buffer);
  const text = result.text?.trim();

  if (!text) {
    throw new Error(
      "No readable text found in the PDF."
    );
  }

  return text;
}

module.exports = { parsePDF };
