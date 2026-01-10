# Backend API

## Mô tả
Backend API được xây dựng với TypeScript, Nestjs, PostgreSQL (TypeORM) và JWT authentication.

### Chạy ứng dụng
```bash
# Development mode
npm run dev

# Build production
npm run build

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh-token` - Làm mới token
- `GET /api/v1/auth/profile` - Lấy thông tin profile (Auth required)
- `PUT /api/v1/auth/change-password` - Đổi mật khẩu (Auth required)
- `POST /api/v1/auth/logout` - Đăng xuất (Auth required)

### Users (Admin only)
- `GET /api/v1/users` - Lấy danh sách users
- `GET /api/v1/users/:id` - Lấy user theo ID
- `POST /api/v1/users` - Tạo user mới
- `PUT /api/v1/users/:id` - Cập nhật user
- `DELETE /api/v1/users/:id` - Xóa user
- `PUT /api/v1/users/:id/role` - Gán role cho user
- `PUT /api/v1/users/:id/permissions` - Gán permissions cho user

### Roles (Admin only)
- `GET /api/v1/roles` - Lấy danh sách roles
- `GET /api/v1/roles/:id` - Lấy role theo ID
- `POST /api/v1/roles` - Tạo role mới
- `PUT /api/v1/roles/:id` - Cập nhật role
- `DELETE /api/v1/roles/:id` - Xóa role
- `POST /api/v1/roles/:id/permissions` - Thêm permissions vào role
- `DELETE /api/v1/roles/:id/permissions` - Xóa permissions khỏi role

### Permissions (Admin only)
- `GET /api/v1/permissions` - Lấy danh sách permissions
- `GET /api/v1/permissions/:id` - Lấy permission theo ID
- `POST /api/v1/permissions` - Tạo permission mới
- `POST /api/v1/permissions/bulk` - Tạo nhiều permissions
- `PUT /api/v1/permissions/:id` - Cập nhật permission
- `DELETE /api/v1/permissions/:id` - Xóa permission
- `GET /api/v1/permissions/resource/:resource` - Lấy permissions theo resource

## Roles mặc định
- `admin` - Quản trị viên, có toàn quyền
- `teacher` - Giáo viên, quản lý courses và lessons
- `user` - Người dùng cơ bản

## Tài khoản Admin mặc định
- **Username:** admin
- **Password:** admin@123


### Create Role (Admin)
```json
POST /api/v1/roles
Authorization: Bearer <access_token>
{
  "name": "moderator",
  "description": "Người điều hành",
  "permissions": ["read:users", "read:courses"]
}
```

### Assign Role to User (Admin)
```json
PUT /api/v1/users/:id/role
Authorization: Bearer <access_token>
{
  "role": "teacher"
}
```