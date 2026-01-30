import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class, ClassStudent, User, Status, UserRole } from '../../entities';
import { CreateClassDto, UpdateClassDto, AddStudentsDto } from './dto';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,

        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createClassDto: CreateClassDto): Promise<any> {
        const { studentIds, ...classData } = createClassDto;

        // Check classCode uniqueness
        if (classData.classCode) {
            const existingClass = await this.classRepository.findOne({
                where: { classCode: classData.classCode },
            });
            if (existingClass) {
                throw new ConflictException('Mã lớp học đã tồn tại');
            }
        }

        // Create the class first
        const newClass = this.classRepository.create(classData);
        const savedClass = await this.classRepository.save(newClass);

        // Add students through ClassStudent join table
        if (studentIds && studentIds.length > 0) {
            await this.addStudentsToClass(savedClass.id, studentIds);
        }

        return this.findOneWithStudents(savedClass.id);
    }

    async findAll(): Promise<any[]> {
        const classes = await this.classRepository.find({
            relations: ['course', 'teacher'],
        });

        return Promise.all(classes.map(async (cls) => {
            const students = await this.getStudentsByClassId(cls.id);
            return {
                ...cls,
                students,
            };
        }));
    }

    async findOne(id: string): Promise<Class | null> {
        return this.classRepository.findOne({
            where: { id },
            relations: ['course', 'teacher'],
        });
    }

    async findOneWithStudents(id: string): Promise<any> {
        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['course', 'teacher'],
        });

        if (!classEntity) {
            throw new NotFoundException('Không tìm thấy lớp học');
        }

        const students = await this.getStudentsByClassId(id);

        return {
            ...classEntity,
            students,
        };
    }

    async update(id: string, updateClassDto: UpdateClassDto): Promise<any> {
        const classEntity = await this.classRepository.findOne({
            where: { id },
        });

        if (!classEntity) {
            throw new NotFoundException('Không tìm thấy lớp học');
        }

        // Check classCode uniqueness if changing
        if (updateClassDto.classCode && updateClassDto.classCode !== classEntity.classCode) {
            const existingClass = await this.classRepository.findOne({
                where: { classCode: updateClassDto.classCode },
            });
            if (existingClass) {
                throw new ConflictException('Mã lớp học đã tồn tại');
            }
        }

        const { studentIds, ...classData } = updateClassDto;

        Object.assign(classEntity, classData);
        await this.classRepository.save(classEntity);

        // Update students if provided
        if (studentIds !== undefined) {
            // Remove all existing students
            await this.classStudentRepository.delete({ classId: id });
            // Add new students
            if (studentIds.length > 0) {
                await this.addStudentsToClass(id, studentIds);
            }
        }

        return this.findOneWithStudents(id);
    }

    async delete(id: string): Promise<void> {
        const classEntity = await this.classRepository.findOne({
            where: { id },
        });

        if (!classEntity) {
            throw new NotFoundException('Không tìm thấy lớp học');
        }

        await this.classRepository.remove(classEntity);
    }

    // Student management
    async addStudentsToClass(classId: string, studentIds: string[]): Promise<void> {
        const students = await this.userRepository.find({
            where: {
                id: In(studentIds),
                role: UserRole.STUDENT,
            },
        });

        for (const student of students) {
            // Check if already exists
            const existing = await this.classStudentRepository.findOne({
                where: { classId, studentId: student.id },
            });

            if (!existing) {
                const classStudent = this.classStudentRepository.create({
                    classId,
                    studentId: student.id,
                    status: Status.ACTIVE,
                });
                await this.classStudentRepository.save(classStudent);
            }
        }
    }

    async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
        const classStudent = await this.classStudentRepository.findOne({
            where: { classId, studentId },
        });

        if (!classStudent) {
            throw new NotFoundException('Không tìm thấy học sinh trong lớp');
        }

        await this.classStudentRepository.remove(classStudent);
    }

    async getStudentsByClassId(classId: string): Promise<any[]> {
        const classStudents = await this.classStudentRepository.find({
            where: { classId },
            relations: ['student'],
        });

        return classStudents.map((cs) => ({
            userId: cs.studentId,
            name: cs.student?.fullname || cs.student?.username || '',
            email: cs.student?.email || '',
            phone: cs.student?.phone || '',
            enrolledAt: cs.enrolledAt,
            status: cs.status,
        }));
    }

    async addStudents(classId: string, addStudentsDto: AddStudentsDto): Promise<any> {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
        });

        if (!classEntity) {
            throw new NotFoundException('Không tìm thấy lớp học');
        }

        await this.addStudentsToClass(classId, addStudentsDto.studentIds);

        return this.findOneWithStudents(classId);
    }

    async removeStudent(classId: string, studentId: string): Promise<any> {
        await this.removeStudentFromClass(classId, studentId);
        return this.findOneWithStudents(classId);
    }
}