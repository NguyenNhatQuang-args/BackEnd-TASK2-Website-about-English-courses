import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto, PermissionQueryDto } from './dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Create permission
  async create(createPermissionDto: CreatePermissionDto) {
    // Check name exists
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new ConflictException('Permission đã tồn tại');
    }

    // Check action:resource combination exists
    const existingActionResource = await this.permissionRepository.findOne({
      where: {
        action: createPermissionDto.action,
        resource: createPermissionDto.resource,
      },
    });

    if (existingActionResource) {
      throw new ConflictException('Quyền với action và resource này đã tồn tại');
    }

    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      description: createPermissionDto.description || '',
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

  // Find all
  async findAll(query?: PermissionQueryDto) {
    const where: Record<string, any> = {};

    if (query?.action) {
      where.action = query.action;
    }

    if (query?.resource) {
      where.resource = query.resource;
    }

    if (typeof query?.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const permissions = await this.permissionRepository.find({
      where,
      order: { resource: 'ASC', action: 'ASC' },
    });

    return {
      permissions: permissions.map((p) => this.toPermissionResponse(p)),
      total: permissions.length,
    };
  }

  // Update permission
  async update(permissionId: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }

    // Check name uniqueness
    if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });
      if (existingPermission) {
        throw new ConflictException('Permission đã tồn tại');
      }
    }

    // Check action:resource combination uniqueness
    if (updatePermissionDto.action || updatePermissionDto.resource) {
      const action = updatePermissionDto.action || permission.action;
      const resource = updatePermissionDto.resource || permission.resource;

      const existingActionResource = await this.permissionRepository.findOne({
        where: { action, resource },
      });

      if (existingActionResource && existingActionResource.id !== permissionId) {
        throw new ConflictException('Quyền với action và resource này đã tồn tại');
      }
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
      throw new NotFoundException('Không tìm thấy permission');
    }

    await this.permissionRepository.remove(permission);

    return { message: 'Xóa permission thành công' };
  }

  // Toggle active status
  async toggleActive(permissionId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }

    permission.isActive = !permission.isActive;
    await this.permissionRepository.save(permission);

    return this.toPermissionResponse(permission);
  }

  // Get actions
  getActions() {
    return ['create', 'read', 'update', 'delete', 'manage'];
  }

  // Get resources
  getResources() {
    return ['users', 'roles', 'permissions', 'courses', 'lessons', 'profile'];
  }

  // Transform to response
  private toPermissionResponse(permission: Permission) {
    return {
      id: permission.id,
      name: permission.name,
      action: permission.action,
      resource: permission.resource,
      description: permission.description,
      isActive: permission.isActive,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
    };
  }
}
