import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';


@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('files/product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path );
  }



  @Post('tes/admin/upload')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  async uploadProductImage( 
    @UploadedFile() file: Express.Multer.File,
  ){

    if ( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    // const secureUrl = `${ file.filename }`;
    // const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
    const message1 = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
 
    // 2) Subir a Cloudinary
    const cloudinaryUpload = await this.filesService.uploadToCloudinary(file.path);
    

    
    // return {
      //   localUrl,
      //   cloudinaryUrl: cloudinaryUpload.secure_url,
      //   public_id: cloudinaryUpload.public_id,
      // };
      const message = cloudinaryUpload.secure_url;
      console.log(message);
      return { message };
  }

}
