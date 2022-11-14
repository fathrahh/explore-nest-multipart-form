import { HasuraHandlerService } from './services/hasuraHandler.service';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './services/upload.service';
import { CreatePostDTO } from './dto/create-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly hasuraHandlerService: HasuraHandlerService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreatePostDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadResponse = await this.uploadService.uploadFile(file);
    const hasuraResponse = await this.hasuraHandlerService.uploadPostAndReels(
      body.caption,
      uploadResponse.name,
      uploadResponse.name,
    );

    return hasuraResponse;
  }
}
