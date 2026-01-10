// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ClassModule } from './modules/class/class.module';

// Entities
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Class } from './modules/class/class.entity';

@Module({
  imports: [
    // 1. Cấu hình biến môi trường (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Kết nối Database (Lấy thông tin từ .env)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Role, Permission, Class],
      synchronize: process.env.NODE_ENV === 'development', // Chỉ dùng cho dev
      autoLoadEntities: true,
    }),

    // 3. Đăng ký các Modules
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ClassModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}