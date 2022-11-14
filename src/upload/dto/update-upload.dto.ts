import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDTO } from './create-upload.dto';

export class UpdateUploadDto extends PartialType(CreatePostDTO) {}
