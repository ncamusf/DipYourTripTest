import { logger } from "firebase-functions/v2";
import * as fs from "fs";
import path from "path";

interface PdfUploadApiResponse {
  expires_at: string | null;
  gcs_uri: string;
  ok: boolean;
  url: string;
}

const PDF_UPLOAD_ENDPOINT = "https://pdf-upload-mld2s2qvcq-uc.a.run.app/upload";
const DEFAULT_AUTH_TOKEN = "supersecret";


export async function uploadPdf(
  pdfPath: string
): Promise<string> {
  const fileName = path.basename(pdfPath);

  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found at path: ${pdfPath}`);
  }

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    const formData = new FormData();
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    formData.append("pdf", blob, fileName);

    const url = new URL(PDF_UPLOAD_ENDPOINT);
    url.searchParams.append("candidate_id", "NicoCamus");
    url.searchParams.append("file_name", fileName);

    logger.info("Uploading PDF to:", url.toString());

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEFAULT_AUTH_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PDF upload failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const responseData = await response.json() as PdfUploadApiResponse;
    logger.info("PDF uploaded successfully:", responseData.url);

    return responseData.url;
  } catch (error) {
    logger.error("Error uploading PDF:", error);
    throw error;
  }
}

