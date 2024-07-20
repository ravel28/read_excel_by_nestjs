//file : multer-options.config.ts-------------------------------------------------------
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { Request, Express } from 'express';

// Multer configuration
export const multerConfig = {
  dest: './uploads/excel',
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1000000,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Allow storage of file
    if (/\.(xlsx|xls|xlsm|xlsb|xlt|csv|ods)$/i.test(file?.originalname))
      cb(null, true);
    // Reject file
    else
      cb(
        new BadRequestException(
          `Unsupported file type ${extname(file.originalname)}`,
        ),
        false,
      );
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) mkdirSync(uploadPath);

      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: Request, file: any, cb: any) => {
      const uploadedFileName = file.originalname;
      // Validation years & configName
      if (!file) {
        cb(new BadRequestException([`file should not be empty`]), false);
      }
      // Calling the callback passing the random name generated with the original extension name
      else cb(null, uploadedFileName);
    },
  }),
};
//file : multer-options.config.ts-------------------------------------------------------
