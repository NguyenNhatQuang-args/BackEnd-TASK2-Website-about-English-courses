import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommonListService } from './common-list.service';
import { CommonListType } from './common-list.entity';
import { CreateCommonListDto, UpdateCommonListDto, QueryCommonListDto } from './dto';

@Controller('common-list')
export class CommonListController {
  constructor(private readonly commonListService: CommonListService) {}

  // POST /common-list - Tạo mới
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateCommonListDto) {
    const data = await this.commonListService.create(createDto);
    return {
      success: true,
      message: 'Tạo CommonList thành công',
      data,
    };
  }

  // GET /common-list - Lấy tất cả (có thể filter)
  @Get()
  async findAll(@Query() query: QueryCommonListDto) {
    const data = await this.commonListService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách CommonList thành công',
      data,
      total: data.length,
    };
  }

  // GET /common-list/type/:type - Lấy theo type
  @Get('type/:type')
  async findByType(@Param('type') type: CommonListType) {
    const data = await this.commonListService.findByType(type);
    return {
      success: true,
      message: `Lấy danh sách ${type} thành công`,
      data,
      total: data.length,
    };
  }

  // GET /common-list/levels - Lấy danh sách Level
  @Get('levels')
  async getLevels() {
    const data = await this.commonListService.findByType(CommonListType.LEVEL);
    return {
      success: true,
      message: 'Lấy danh sách Level thành công',
      data,
    };
  }

  // GET /common-list/kind-of-courses - Lấy danh sách Kind of Course
  @Get('kind-of-courses')
  async getKindOfCourses() {
    const data = await this.commonListService.findByType(CommonListType.KIND_OF_COURSE);
    return {
      success: true,
      message: 'Lấy danh sách Kind of Course thành công',
      data,
    };
  }

  // GET /common-list/roles - Lấy danh sách Role
  @Get('roles')
  async getRoles() {
    const data = await this.commonListService.findByType(CommonListType.ROLE);
    return {
      success: true,
      message: 'Lấy danh sách Role thành công',
      data,
    };
  }

  // GET /common-list/:id - Lấy theo ID
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.commonListService.findById(id);
    return {
      success: true,
      message: 'Lấy CommonList thành công',
      data,
    };
  }

  // PUT /common-list/:id - Cập nhật
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCommonListDto,
  ) {
    const data = await this.commonListService.update(id, updateDto);
    return {
      success: true,
      message: 'Cập nhật CommonList thành công',
      data,
    };
  }

  // DELETE /common-list/:id - Xóa mềm
  @Delete(':id')
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.commonListService.softDelete(id);
    return {
      success: true,
      message: 'Xóa CommonList thành công (soft delete)',
      data,
    };
  }

  // DELETE /common-list/:id/permanent - Xóa hoàn toàn
  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.commonListService.delete(id);
  }

  // POST /common-list/seed - Seed dữ liệu mặc định
  @Post('seed')
  async seedDefaultData() {
    await this.commonListService.seedDefaultData();
    return {
      success: true,
      message: 'Seed dữ liệu mặc định thành công',
    };
  }
}
