import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, DifficultyLevel, Status } from '../../../entities/enums';

export class CreateQuestionDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Section ID không được để trống' })
  sectionId: string;

  @IsEnum(QuestionType, { message: 'Question type không hợp lệ' })
  questionType: QuestionType;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung câu hỏi không được để trống' })
  questionText: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  // For multiple choice, match questions
  @IsArray()
  @IsOptional()
  options?: string[];

  // Correct answer(s)
  @IsOptional()
  answer?: string | string[];

  @IsString()
  @IsOptional()
  explanation?: string;

  // Media URLs
  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  // Reading/Listening content
  @IsString()
  @IsOptional()
  passage?: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  // Vocabulary fields
  @IsString()
  @IsOptional()
  word?: string;

  @IsString()
  @IsOptional()
  pronunciation?: string;

  @IsString()
  @IsOptional()
  definition?: string;

  @IsArray()
  @IsOptional()
  examples?: string[];

  // Word Bank
  @IsArray()
  @IsOptional()
  wordBank?: { id: string | number; name: string }[];

  @IsArray()
  @IsOptional()
  correctWordIds?: (string | number)[];

  // Grammar
  @IsString()
  @IsOptional()
  grammarTopic?: string;

  // Writing
  @IsOptional()
  rubric?: {
    grammar?: number;
    vocabulary?: number;
    coherence?: number;
    total?: number;
  };

  // Speaking
  @IsOptional()
  evaluationCriteria?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    vocabulary?: number;
    total?: number;
  };

  @IsArray()
  @IsOptional()
  hints?: string[];

  @IsString()
  @IsOptional()
  sampleAnswer?: string;

  @IsString()
  @IsOptional()
  topicArea?: string;
}

export class UpdateQuestionDto {
  @IsEnum(QuestionType, { message: 'Question type không hợp lệ' })
  @IsOptional()
  questionType?: QuestionType;

  @IsString()
  @IsOptional()
  questionText?: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsOptional()
  answer?: string | string[];

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  passage?: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  @IsString()
  @IsOptional()
  word?: string;

  @IsString()
  @IsOptional()
  pronunciation?: string;

  @IsString()
  @IsOptional()
  definition?: string;

  @IsArray()
  @IsOptional()
  examples?: string[];

  @IsArray()
  @IsOptional()
  wordBank?: { id: string | number; name: string }[];

  @IsArray()
  @IsOptional()
  correctWordIds?: (string | number)[];

  @IsString()
  @IsOptional()
  grammarTopic?: string;

  @IsOptional()
  rubric?: {
    grammar?: number;
    vocabulary?: number;
    coherence?: number;
    total?: number;
  };

  @IsOptional()
  evaluationCriteria?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    vocabulary?: number;
    total?: number;
  };

  @IsArray()
  @IsOptional()
  hints?: string[];

  @IsString()
  @IsOptional()
  sampleAnswer?: string;

  @IsString()
  @IsOptional()
  topicArea?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
