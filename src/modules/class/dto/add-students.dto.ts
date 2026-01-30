import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class AddStudentsDto {
    @IsArray()
    @IsUUID('4', { each: true, message: 'ID học sinh không hợp lệ' })
    @ArrayMinSize(1, { message: 'Phải có ít nhất 1 học sinh' })
    studentIds: string[];
}
