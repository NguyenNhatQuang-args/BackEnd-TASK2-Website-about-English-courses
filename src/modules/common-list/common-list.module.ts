import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonList } from './common-list.entity';
import { CommonListService } from './common-list.service';
import { CommonListController } from './common-list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommonList])],
  controllers: [CommonListController],
  providers: [CommonListService],
  exports: [CommonListService], // Export để các module khác có thể sử dụng
})
export class CommonListModule {}
