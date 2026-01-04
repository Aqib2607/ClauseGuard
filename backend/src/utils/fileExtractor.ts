import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { logger } from '../config/logger';

export class FileExtractor {
  static async extractText(filePath: string, mimeType: string): Promise<string> {
    try {
      logger.info('Extracting text from file', { filePath, mimeType });

      if (mimeType === 'application/pdf') {
        return await this.extractFromPdf(filePath);
      } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        return await this.extractFromDocx(filePath);
      } else if (mimeType === 'text/plain') {
        return await this.extractFromTxt(filePath);
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error) {
      logger.error('Text extraction failed', { filePath, error });
      throw error;
    }
  }

  private static async extractFromPdf(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  private static async extractFromDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  private static async extractFromTxt(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }
}
