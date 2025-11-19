import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';

import { envs } from '../config/envs'; // <== Importás tus envs
import { v2 as cloudinary } from 'cloudinary';


@Injectable()
export class FilesService {
  constructor() {
    cloudinary.config({
      cloud_name: envs.cloudinaryCloudName,
      api_key: envs.cloudinaryApiKey,
      api_secret: envs.cloudinaryApiSecret,
    });
  }
  
    getStaticProductImage( imageName: string ) {

        const path = join( __dirname, '../../static/products', imageName );

        if ( !existsSync(path) ) 
            throw new BadRequestException(`No product found with image ${ imageName }`);

        return path;
    }

  uploadToCloudinary(filePath: string): Promise<any> {
    return cloudinary.uploader.upload(filePath, {
      folder: 'my_products',
    });
  }

}
