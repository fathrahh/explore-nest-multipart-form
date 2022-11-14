import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { HasuraHandlerService } from './services/hasuraHandler.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: process.env.HASURA_URL,
        method: 'POST',
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_SECRET,
        },
        timeout: 60000,
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, HasuraHandlerService],
})
export class UploadModule {}
