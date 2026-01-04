import { config } from '../config';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

export class FileValidator {
  static validateFile(file: Express.Multer.File): void {
    const maxSizeBytes = config.upload.maxFileSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${config.upload.maxFileSizeMB}MB limit`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type. Allowed types: PDF, DOCX, DOC, TXT`
      );
    }

    const extension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      throw new Error(
        `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
      );
    }
  }

  static async mockVirusScan(_filePath: string): Promise<boolean> {
    return true;
  }
}
