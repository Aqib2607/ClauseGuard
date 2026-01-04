import { FileValidator } from '../utils/fileValidator';

describe('FileValidator', () => {
  describe('validateFile', () => {
    it('should accept valid PDF file', () => {
      const mockFile = {
        size: 1024 * 1024, // 1MB
        mimetype: 'application/pdf',
        originalname: 'contract.pdf',
      } as Express.Multer.File;

      expect(() => FileValidator.validateFile(mockFile)).not.toThrow();
    });

    it('should reject file exceeding size limit', () => {
      const mockFile = {
        size: 15 * 1024 * 1024, // 15MB
        mimetype: 'application/pdf',
        originalname: 'contract.pdf',
      } as Express.Multer.File;

      expect(() => FileValidator.validateFile(mockFile)).toThrow('File size exceeds');
    });

    it('should reject invalid file type', () => {
      const mockFile = {
        size: 1024 * 1024,
        mimetype: 'application/zip',
        originalname: 'contract.zip',
      } as Express.Multer.File;

      expect(() => FileValidator.validateFile(mockFile)).toThrow('Invalid file type');
    });
  });
});
