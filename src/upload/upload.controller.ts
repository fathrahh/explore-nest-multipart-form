import { Express } from 'express';
import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  HasuraResponse,
  SatuDataInsPost,
} from './interface/hasuraHandler.interface';
import { HasuraHandlerService } from './services/hasuraHandler.service';
import { UploadService } from './services/upload.service';
import { CreatePostDTO } from './dto/create-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly hasuraHandlerService: HasuraHandlerService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() body: CreatePostDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const uploadResponse = await Promise.all(
      files.map(async (file) => await this.uploadService.uploadFile(file)),
    );

    const uploadImage = uploadResponse.map((key) => key.name);

    const hasuraResponse: HasuraResponse =
      await this.hasuraHandlerService.uploadPostAndReels(
        body.caption,
        uploadImage[0],
        uploadImage,
      );

    return hasuraResponse.data;
  }

  @Get()
  async getPost() {
    const {
      data: { satu_data_ins_post },
    }: HasuraResponse<SatuDataInsPost> = await this.hasuraHandlerService.getAllPost();

    return await Promise.all(
      satu_data_ins_post.map(async (value) => {
        const imageKeys = value.post_images.map(({ key }) => key);
        return {
          id: value.id,
          caption: value.caption,
          thumbnail: value.thumbnail,
          created_at: value.created_at,
          update_at: value.update_at,
          images: this.uploadService.getFile(imageKeys),
        };
      }),
    );
  }
}
