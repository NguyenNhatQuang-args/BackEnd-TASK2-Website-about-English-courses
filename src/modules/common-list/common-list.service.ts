import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonList, CommonListType } from './common-list.entity';
import { CreateCommonListDto, UpdateCommonListDto, QueryCommonListDto } from './dto';

@Injectable()
export class CommonListService {
  constructor(
    @InjectRepository(CommonList)
    private readonly commonListRepository: Repository<CommonList>,
  ) {}

  // Tạo mới
  async create(createDto: CreateCommonListDto): Promise<CommonList> {
    // Kiểm tra code đã tồn tại trong type chưa
    const existing = await this.commonListRepository.findOne({
      where: { type: createDto.type, code: createDto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Code "${createDto.code}" đã tồn tại trong type "${createDto.type}"`,
      );
    }

    const commonList = this.commonListRepository.create(createDto);
    return this.commonListRepository.save(commonList);
  }

  // Lấy tất cả hoặc filter theo type
  async findAll(query: QueryCommonListDto): Promise<CommonList[]> {
    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return this.commonListRepository.find({
      where,
      order: { type: 'ASC', order: 'ASC', name: 'ASC' },
    });
  }

  // Lấy theo type cụ thể
  async findByType(type: CommonListType): Promise<CommonList[]> {
    return this.commonListRepository.find({
      where: { type, isActive: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  // Lấy theo ID
  async findById(id: string): Promise<CommonList> {
    const commonList = await this.commonListRepository.findOne({
      where: { id },
    });

    if (!commonList) {
      throw new NotFoundException(`CommonList với ID "${id}" không tồn tại`);
    }

    return commonList;
  }

  // Lấy theo type và code
  async findByTypeAndCode(type: CommonListType, code: string): Promise<CommonList> {
    const commonList = await this.commonListRepository.findOne({
      where: { type, code },
    });

    if (!commonList) {
      throw new NotFoundException(
        `CommonList với type "${type}" và code "${code}" không tồn tại`,
      );
    }

    return commonList;
  }

  // Cập nhật
  async update(id: string, updateDto: UpdateCommonListDto): Promise<CommonList> {
    const commonList = await this.findById(id);

    // Nếu cập nhật code, kiểm tra trùng
    if (updateDto.code && updateDto.code !== commonList.code) {
      const existing = await this.commonListRepository.findOne({
        where: { type: commonList.type, code: updateDto.code },
      });

      if (existing) {
        throw new ConflictException(
          `Code "${updateDto.code}" đã tồn tại trong type "${commonList.type}"`,
        );
      }
    }

    Object.assign(commonList, updateDto);
    return this.commonListRepository.save(commonList);
  }

  // Xóa (soft delete - set isActive = false)
  async softDelete(id: string): Promise<CommonList> {
    const commonList = await this.findById(id);
    commonList.isActive = false;
    return this.commonListRepository.save(commonList);
  }

  // Xóa hoàn toàn
  async delete(id: string): Promise<void> {
    const commonList = await this.findById(id);
    await this.commonListRepository.remove(commonList);
  }

  // Seed dữ liệu mặc định
  async seedDefaultData(): Promise<void> {
    const defaultData: Partial<CommonList>[] = [
      // LEVEL
      { type: CommonListType.LEVEL, code: 'S', name: 'Starter', order: 1 },
      { type: CommonListType.LEVEL, code: 'Pres', name: 'Pre-Starter', order: 2 },
      { type: CommonListType.LEVEL, code: 'TC', name: 'TC', order: 3 },
      { type: CommonListType.LEVEL, code: 'MTC', name: 'MTC', order: 4 },
      { type: CommonListType.LEVEL, code: 'FI', name: 'FI', order: 5 },
      { type: CommonListType.LEVEL, code: 'EF', name: 'EF', order: 6 },
      { type: CommonListType.LEVEL, code: 'TE', name: 'TE', order: 7 },
      { type: CommonListType.LEVEL, code: 'ME', name: 'ME', order: 8 },

      // KIND_OF_COURSE
      { type: CommonListType.KIND_OF_COURSE, code: 'IELTS', name: 'IELTS', order: 1 },
      { type: CommonListType.KIND_OF_COURSE, code: 'TOEIC', name: 'TOEIC', order: 2 },
      { type: CommonListType.KIND_OF_COURSE, code: '4SKILL', name: '4 Skills', order: 3 },

      // ROLE
      { type: CommonListType.ROLE, code: 'ADMIN', name: 'Quản trị viên', order: 1 },
      { type: CommonListType.ROLE, code: 'USER', name: 'Người dùng', order: 2 },
      { type: CommonListType.ROLE, code: 'TEACHER', name: 'Giáo viên', order: 3 },
    ];

    for (const data of defaultData) {
      const existing = await this.commonListRepository.findOne({
        where: { type: data.type, code: data.code },
      });

      if (!existing) {
        const item = this.commonListRepository.create(data);
        await this.commonListRepository.save(item);
      }
    }
  }
}
