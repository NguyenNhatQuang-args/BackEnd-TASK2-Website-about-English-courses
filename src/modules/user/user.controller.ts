import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  AssignRoleDto,
  AssignPermissionsDto,
  UserQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /api/v1/users
  @Get()
  @Roles('ADMIN')
  async findAll(@Query() query: UserQueryDto) {
    const result = await this.userService.findAll(query);
    return {
      success: true,
      message: 'Lấy danh sách người dùng thành công',
      data: result.users,
      pagination: result.pagination,
    };
  }

  // GET /api/v1/users/:id
  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }

  // POST /api/v1/users
  @Post()
  @Roles('ADMIN')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      message: 'Tạo người dùng thành công',
      data: user,
    };
  }

  // PUT /api/v1/users/:id
  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return {
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: user,
    };
  }

  // DELETE /api/v1/users/:id
  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);
    return {
      success: true,
      message: 'Xóa người dùng thành công',
    };
  }

  // PUT /api/v1/users/:id/role
  @Put(':id/role')
  @Roles('ADMIN')
  async assignRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    const user = await this.userService.assignRole(id, assignRoleDto.role);
    return {
      success: true,
      message: 'Gán vai trò thành công',
      data: user,
    };
  }

  // PUT /api/v1/users/:id/permissions
  @Put(':id/permissions')
  @Roles('ADMIN')
  async assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    const user = await this.userService.assignPermissions(
      id,
      assignPermissionsDto.permissions,
    );
    return {
      success: true,
      message: 'Gán quyền thành công',
      data: user,
    };
  }
}
