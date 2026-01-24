import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // GET /api/v1/permissions
  @Get()
  async findAll(@Query() query: PermissionQueryDto) {
    const result = await this.permissionService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách quyền thành công',
      data: result.permissions,
      total: result.total,
    };
  }

  // GET /api/v1/permissions/roles
  @Get('roles')
  getRoles() {
    return {
      success: true,
      message: 'Lấy danh sách roles thành công',
      data: this.permissionService.getRoles(),
    };
  }

  // GET /api/v1/permissions/:id
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const permission = await this.permissionService.findById(id);
    return {
      success: true,
      message: 'Lấy thông tin quyền thành công',
      data: permission,
    };
  }

  // POST /api/v1/permissions
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionService.create(createPermissionDto);
    return {
      success: true,
      message: 'Tạo quyền thành công',
      data: permission,
    };
  }

  // PUT /api/v1/permissions/:id
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const permission = await this.permissionService.update(id, updatePermissionDto);
    return {
      success: true,
      message: 'Cập nhật quyền thành công',
      data: permission,
    };
  }

  // DELETE /api/v1/permissions/:id
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.permissionService.remove(id);
    return {
      success: true,
      message: 'Xóa quyền thành công',
    };
  }

  // PATCH /api/v1/permissions/:id/toggle-active
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    const permission = await this.permissionService.toggleActive(id);
    return {
      success: true,
      message: permission.isActive
        ? 'Kích hoạt permission thành công'
        : 'Vô hiệu hóa permission thành công',
      data: permission,
    };
  }
}
