import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { logger } from '../config/logger';

export class FileCleanup {
  static async cleanupOldFiles(): Promise<void> {
    try {
      const uploadDir = config.upload.uploadDir;
      const retentionMs = config.upload.retentionHours * 60 * 60 * 1000;
      const now = Date.now();

      const files = await fs.readdir(uploadDir);

      for (const file of files) {
        if (file === '.gitkeep') continue;

        const filePath = path.join(uploadDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          const age = now - stats.mtimeMs;
          if (age > retentionMs) {
            await fs.rm(filePath, { recursive: true, force: true });
            logger.info('Cleaned up old upload directory', { filePath, ageHours: age / (60 * 60 * 1000) });
          }
        }
      }
    } catch (error) {
      logger.error('File cleanup error', { error });
    }
  }

  static startCleanupSchedule(): void {
    const intervalMs = 60 * 60 * 1000;
    setInterval(() => {
      this.cleanupOldFiles();
    }, intervalMs);

    logger.info('File cleanup schedule started', { intervalHours: 1 });
  }
}
