import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { UserRole, DEFAULT_ROLE_PERMISSIONS } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create user
  async create(createUserDto: CreateUserDto) {
    // Check username exists
    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Check email exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const role = createUserDto.role || UserRole.USER;
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[role] || [];

    const user = this.userRepository.create({
      ...createUserDto,
      dateOfBirth: new Date(createUserDto.dateOfBirth),
      role,
      permissions: defaultPermissions,
    });

    await this.userRepository.save(user);

    return this.toUserResponse(user);
  }

  // Find by ID
  async findById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return this.toUserResponse(user);
  }

  // Get user by username (with password for auth)
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  // Find all with pagination
  async findAll(query: UserQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.fullname ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Active status filter
    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('user.is_active = :isActive', { isActive });
    }

    // Sorting
    const sortColumn =
      sortBy === 'createdAt' ? 'user.created_at' : `user.${sortBy}`;
    queryBuilder.orderBy(sortColumn, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users: users.map((user) => this.toUserResponse(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update user
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Check email uniqueness
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    Object.assign(user, {
      ...updateUserDto,
      dateOfBirth: updateUserDto.dateOfBirth
        ? new Date(updateUserDto.dateOfBirth)
        : user.dateOfBirth,
    });

    await this.userRepository.save(user);

    return this.toUserResponse(user);
  }

  // Delete user
  async remove(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    await this.userRepository.remove(user);

    return { message: 'Xóa người dùng thành công' };
  }

  // Assign role
  async assignRole(userId: string, role: UserRole) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.role = role;
    user.permissions = DEFAULT_ROLE_PERMISSIONS[role] || [];

    await this.userRepository.save(user);

    return this.toUserResponse(user);
  }

  // Assign permissions
  async assignPermissions(userId: string, permissions: string[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.permissions = permissions;
    await this.userRepository.save(user);

    return this.toUserResponse(user);
  }

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    user.setPassword(newPassword);
    await this.userRepository.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }

  // Transform to response
  toUserResponse(user: User) {
    return {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      dateOfBirth:
        user.dateOfBirth instanceof Date
          ? user.dateOfBirth.toISOString().split('T')[0]
          : user.dateOfBirth,
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
