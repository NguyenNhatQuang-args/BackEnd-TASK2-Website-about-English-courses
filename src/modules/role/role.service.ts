import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Create role
  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name.toLowerCase() },
    });

    if (existingRole) {
      throw new ConflictException('Vai trò đã tồn tại');
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      name: createRoleDto.name.toLowerCase(),
      permissions: createRoleDto.permissions ? createRoleDto.permissions.join(',') : '',
    });

    await this.roleRepository.save(role);

    return this.toRoleResponse(role);
  }

  // Find by ID
  async findById(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    return this.toRoleResponse(role);
  }

  // Find by name
  async findByName(name: string) {
    const role = await this.roleRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    if (!role) {
      return null;
    }

    return this.toRoleResponse(role);
  }

  // Find all
  async findAll() {
    const roles = await this.roleRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    return {
      roles: roles.map((role) => this.toRoleResponse(role)),
      total: roles.length,
    };
  }

  // Update role
  async update(roleId: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    // Check name uniqueness
    if (
      updateRoleDto.name &&
      updateRoleDto.name.toLowerCase() !== role.name
    ) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name.toLowerCase() },
      });
      if (existingRole) {
        throw new ConflictException('Vai trò đã tồn tại');
      }
    }

    Object.assign(role, {
      ...updateRoleDto,
      name: updateRoleDto.name
        ? updateRoleDto.name.toLowerCase()
        : role.name,
    });

    await this.roleRepository.save(role);

    return this.toRoleResponse(role);
  }

  // Delete role
  async remove(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    await this.roleRepository.remove(role);

    return { message: 'Xóa vai trò thành công' };
  }

  // Assign permissions to role
  async assignPermissions(roleId: string, permissions: string[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    role.permissions = permissions.join(',');
    await this.roleRepository.save(role);

    return this.toRoleResponse(role);
  }

  // Toggle active status
  async toggleActive(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    role.isActive = !role.isActive;
    await this.roleRepository.save(role);

    return this.toRoleResponse(role);
  }

  // Transform to response
  private toRoleResponse(role: Role) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions ? role.permissions.split(',') : [],
      isActive: role.isActive,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    };
  }
}
