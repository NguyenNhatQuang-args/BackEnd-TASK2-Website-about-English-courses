import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from './config';

// Start server
const startServer = async (): Promise<void> => {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: config.cors.origin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Start listening
    await app.listen(config.port);
    
    console.log(`
========================================
  NestJS Server is running!
  Environment: ${config.nodeEnv}
  Port: ${config.port}
  API: http://localhost:${config.port}/api/v1
========================================
    `);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();