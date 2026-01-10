import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // GET /api/v1/roles
  @Get()
  async findAll() {
    const result = await this.roleService.findAll();
    return {
      success: true,
      message: 'Lấy danh sách vai trò thành công',
      data: result.roles,
      total: result.total,
    };
  }

  // GET /api/v1/roles/:id
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const role = await this.roleService.findById(id);
    return {
      success: true,
      message: 'Lấy thông tin vai trò thành công',
      data: role,
    };
  }

  // POST /api/v1/roles
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return {
      success: true,
      message: 'Tạo vai trò thành công',
      data: role,
    };
  }

  // PUT /api/v1/roles/:id
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.roleService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Cập nhật vai trò thành công',
      data: role,
    };
  }

  // DELETE /api/v1/roles/:id
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.roleService.remove(id);
    return {
      success: true,
      message: 'Xóa vai trò thành công',
    };
  }

  // PUT /api/v1/roles/:id/permissions
  @Put(':id/permissions')
  async assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('permissions') permissions: string[],
  ) {
    const role = await this.roleService.assignPermissions(id, permissions);
    return {
      success: true,
      message: 'Gán quyền cho vai trò thành công',
      data: role,
    };
  }

  // PATCH /api/v1/roles/:id/toggle-active
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    const role = await this.roleService.toggleActive(id);
    return {
      success: true,
      message: role.isActive ? 'Kích hoạt vai trò thành công' : 'Vô hiệu hóa vai trò thành công',
      data: role,
    };
  }
}
