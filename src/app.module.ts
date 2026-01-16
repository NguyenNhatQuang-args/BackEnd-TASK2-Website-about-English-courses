import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ClassModule } from './modules/class/class.module';
import { LessonsModule } from './modules/lessons/lessons.module';

// Entities
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Class } from './modules/class/class.entity';
import { Lesson } from './modules/lessons/lessons.entity'; // Đảm bảo có chữ 's'

@Module({
  imports: [
    // 1. Cấu hình biến môi trường (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Kết nối Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Role, Permission, Class, Lesson],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
        ssl: configService.get<string>('NODE_ENV') === 'production' 
             ? { rejectUnauthorized: false } 
             : false,
      }),
    }),

    // 3. Đăng ký các Modules
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ClassModule,
    LessonsModule,
  ],
})
export class AppModule {}