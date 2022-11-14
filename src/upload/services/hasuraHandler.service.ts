import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InsertPostAndReelsImages } from '../interface/hasura.interface';

@Injectable()
export class HasuraHandlerService {
  constructor(private readonly httpService: HttpService) {}
  async uploadPostAndReels(
    caption = '',
    thumbnail = '',
    keys: string | string[],
  ) {
    const query = `
    mutation ($postData: [satu_data_ins_post_image_insert_input!]!, $caption: String!, $thumbnail: String!){
        insert_satu_data_ins_post(objects: {
          caption: $caption,
          thumbnail: $thumbnail,
          post_images: {
            data: $postData
          }
        }) {
          affected_rows
        }
      }                 
    `;

    const ArrayOfKeyImage = typeof keys === 'string' ? [keys] : keys;
    const postData: InsertPostAndReelsImages[] = ArrayOfKeyImage.map((key) => ({
      key,
    }));

    const variables = {
      caption: caption,
      thumbnail: thumbnail,
      postData: postData,
    };

    const response = await this.httpService.axiosRef({
      data: {
        query,
        variables,
      },
    });
    console.log(response);
    return response.data;
  }

  async getAllPost() {
    const query = `
    query{
        satu_data_ins_post{
          id,
          caption,
          thumbnail
          post_images{
            key
          }
        }
      }            
    `;

    const response = await this.httpService.axiosRef({
      data: { query },
    });
    return response.data;
  }
}
