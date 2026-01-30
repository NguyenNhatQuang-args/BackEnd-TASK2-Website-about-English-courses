import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { UserRole, DEFAULT_ROLE_PERMISSIONS } from '../../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Login
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const tokens = this.generateTokenPair({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions ? user.permissions.split(',') : [],
    });

    return {
      user: this.userService.toUserResponse(user),
      tokens,
    };
  }

  // Register
  async register(registerDto: RegisterDto) {
    const user = await this.userService.create({
      ...registerDto,
      role: UserRole.STUDENT,
    });

    const tokens = this.generateTokenPair({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
    });

    return {
      user,
      tokens,
    };
  }

  // Refresh Token
  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const tokens = this.generateTokenPair({
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // Get Profile
  async getProfile(userId: string) {
    return this.userService.findById(userId);
  }

  // Change Password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    await this.userService.changePassword(userId, currentPassword, newPassword);

    return { message: 'Đổi mật khẩu thành công' };
  }

  // Generate token pair
  private generateTokenPair(user: {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  }) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d' as const,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d' as const,
    });

    return { accessToken, refreshToken };
  }
}
