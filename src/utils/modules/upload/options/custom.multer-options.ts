import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const videoMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/videos',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedFormats = ['video/mp4', 'video/mkv', 'video/webm'];
    if (!allowedFormats.includes(file.mimetype)) {
      return callback(
        new HttpException('Invalid video format', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    callback(null, true);
  },
};

/**
 * @param limits 5MB
 */
export const imageMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedFormats.includes(file.mimetype)) {
      return callback(
        new HttpException('Invalid image format', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    callback(null, true);
  },
};

export const fileMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/files',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, callback) => {
    const allowedFormats = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedFormats.includes(file.mimetype)) {
      return callback(
        new HttpException('Invalid file format', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    callback(null, true);
  },
};

export const voiceMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/voice',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, callback) => {
    const allowedFormats = ['audio/ogg', 'audio/mpeg'];
    if (!allowedFormats.includes(file.mimetype)) {
      return callback(
        new HttpException('Invalid file format', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    callback(null, true);
  },
};
