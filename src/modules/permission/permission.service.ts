import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from './dto';
import { UserRole } from '../../entities/enums';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create permission
  async create(createPermissionDto: CreatePermissionDto) {
    // Check code exists
    const existingCode = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });

    if (existingCode) {
      throw new ConflictException('Mã quyền đã tồn tại');
    }

    const permission = this.permissionRepository.create({
      code: createPermissionDto.code,
      name: createPermissionDto.name,
      description: createPermissionDto.description || '',
      roles: createPermissionDto.roles.join(','),
    });

    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Find by ID
  async findById(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }

    return this.toPermissionResponse(permission);
  }

  // Find by code
  async findByCode(code: string) {
    const permission = await this.permissionRepository.findOne({
      where: { code },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }

    return this.toPermissionResponse(permission);
  }

  // Find all
  async findAll(query?: PermissionQueryDto) {
    const where: Record<string, any> = {};

    if (typeof query?.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const permissions = await this.permissionRepository.find({
      where,
      order: { code: 'ASC' },
    });

    return {
      permissions: permissions.map((p) => this.toPermissionResponse(p)),
      total: permissions.length,
    };
  }

  // Find by role
  async findByRole(role: UserRole) {
    const permissions = await this.permissionRepository.find({
      where: { isActive: true },
    });

    const filteredPermissions = permissions.filter((p) => p.hasRole(role));

    return {
      permissions: filteredPermissions.map((p) => this.toPermissionResponse(p)),
      total: filteredPermissions.length,
    };
  }

  // Update permission
  async update(permissionId: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    // Check code uniqueness
    if (updatePermissionDto.code && updatePermissionDto.code !== permission.code) {
      const existingCode = await this.permissionRepository.findOne({
        where: { code: updatePermissionDto.code },
      });
      if (existingCode) {
        throw new ConflictException('Mã quyền đã tồn tại');
      }
    }

    // Handle roles array
    if (updatePermissionDto.roles) {
      permission.roles = updatePermissionDto.roles.join(',');
      delete (updatePermissionDto as any).roles;
    }

    Object.assign(permission, updatePermissionDto);
    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Delete permission
  async remove(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    await this.permissionRepository.remove(permission);

    return { message: 'Xóa quyền thành công' };
  }

  // Toggle active status
  async toggleActive(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    permission.isActive = !permission.isActive;
    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Get available roles
  getRoles() {
    return Object.values(UserRole);
  }

  // Transform to response
  private toPermissionResponse(permission: Permission) {
    return {
      id: permission.id,
      code: permission.code,
      name: permission.name,
      description: permission.description,
      roles: permission.getRolesArray(),
      isActive: permission.isActive,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
    };
  }
}
