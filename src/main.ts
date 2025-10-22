import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { cors: true });  

  const logger = new Logger('JPZ');

  app.setGlobalPrefix('api');
    

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );



  await app.listen(envs.port);
  logger.log(`Escri running on port ${ envs.port }`);
}
bootstrap();
