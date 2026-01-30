import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchemaV2_1706360100000 implements MigrationInterface {
    name = 'UpdateSchemaV2_1706360100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop existing tables if any (reset)
        await queryRunner.query(`DROP TABLE IF EXISTS questions CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS exercise_sections CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS lesson_details CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS lessons CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS class_students CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS classes CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS courses CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS common_lists CASCADE`);

        // Drop existing types
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS users_role_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_status_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS permission_action_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS permission_resource_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_level_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_kind_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS status_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS exercise_section_type_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS question_type_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS difficulty_level_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS common_list_type_enum CASCADE`);

        // Create ENUM types
        await queryRunner.query(`CREATE TYPE status_enum AS ENUM ('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'TEACHER', 'STUDENT')`);
        await queryRunner.query(`CREATE TYPE course_level_enum AS ENUM ('S', 'Pres', 'TC', 'MTC', 'FI', 'EF', 'TE', 'ME')`);
        await queryRunner.query(`CREATE TYPE course_kind_enum AS ENUM ('IELTS', 'TOEIC', '4SKILL')`);
        await queryRunner.query(`CREATE TYPE exercise_section_type_enum AS ENUM ('vocab', 'grammar', 'practice', 'video_grammar', 'listening', 'writing', 'reading', 'speaking')`);
        await queryRunner.query(`CREATE TYPE question_type_enum AS ENUM ('multiple_choice', 'fill_blank', 'match', 'arrange', 'short_answer', 'essay', 'word_bank', 'true_false')`);
        await queryRunner.query(`CREATE TYPE difficulty_level_enum AS ENUM ('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TYPE common_list_type_enum AS ENUM ('KIND_OF_COURSE', 'LEVEL', 'ROLE')`);

        // 1. PERMISSIONS TABLE (New structure with code and roles)
        await queryRunner.query(`
            CREATE TABLE permissions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                code VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                description TEXT DEFAULT '',
                roles TEXT DEFAULT '',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. ROLES TABLE
        await queryRunner.query(`
            CREATE TABLE roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(50) UNIQUE NOT NULL,
                description TEXT DEFAULT '',
                permissions TEXT DEFAULT '',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. USERS TABLE
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                fullname VARCHAR(100),
                phone VARCHAR(20),
                date_of_birth DATE,
                role user_role_enum DEFAULT 'STUDENT',
                status status_enum DEFAULT 'ACTIVE',
                permissions TEXT DEFAULT '',
                avatar_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. COURSES TABLE
        await queryRunner.query(`
            CREATE TABLE courses (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                level course_level_enum,
                kind course_kind_enum,
                status status_enum DEFAULT 'ACTIVE',
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. CLASSES TABLE
        await queryRunner.query(`
            CREATE TABLE classes (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                class_code VARCHAR(50) UNIQUE,
                description TEXT,
                course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
                teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
                level course_level_enum,
                kind course_kind_enum,
                max_students INTEGER DEFAULT 30,
                start_date DATE,
                end_date DATE,
                status status_enum DEFAULT 'ACTIVE',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. CLASS_STUDENTS TABLE (Join table)
        await queryRunner.query(`
            CREATE TABLE class_students (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                status status_enum DEFAULT 'ACTIVE',
                UNIQUE(class_id, student_id)
            )
        `);

        // 7. LESSONS TABLE (with code field)
        await queryRunner.query(`
            CREATE TABLE lessons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                code VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
                order_index INTEGER DEFAULT 0,
                duration_minutes INTEGER,
                status status_enum DEFAULT 'ACTIVE',
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 8. LESSON_DETAILS TABLE
        await queryRunner.query(`
            CREATE TABLE lesson_details (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                content_type VARCHAR(50) NOT NULL,
                content_url TEXT,
                description TEXT,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 9. EXERCISE_SECTIONS TABLE
        await queryRunner.query(`
            CREATE TABLE exercise_sections (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                section_type exercise_section_type_enum NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                order_index INTEGER DEFAULT 0,
                total_points INTEGER DEFAULT 0,
                estimated_time INTEGER DEFAULT 0,
                status status_enum DEFAULT 'ACTIVE',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 10. QUESTIONS TABLE
        await queryRunner.query(`
            CREATE TABLE questions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                section_id UUID NOT NULL REFERENCES exercise_sections(id) ON DELETE CASCADE,
                question_type question_type_enum NOT NULL,
                question_text TEXT NOT NULL,
                difficulty difficulty_level_enum DEFAULT 'medium',
                points INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                options JSONB,
                answer JSONB,
                explanation TEXT,
                audio_url TEXT,
                video_url TEXT,
                image_url TEXT,
                passage TEXT,
                transcript TEXT,
                word VARCHAR(255),
                pronunciation VARCHAR(255),
                definition TEXT,
                examples JSONB,
                word_bank JSONB,
                correct_word_ids JSONB,
                grammar_topic VARCHAR(255),
                rubric JSONB,
                evaluation_criteria JSONB,
                hints JSONB,
                sample_answer TEXT,
                topic_area VARCHAR(255),
                status status_enum DEFAULT 'ACTIVE',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 11. COMMON_LISTS TABLE
        await queryRunner.query(`
            CREATE TABLE common_lists (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                type common_list_type_enum NOT NULL,
                code VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                "order" INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(type, code)
            )
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
        await queryRunner.query(`CREATE INDEX idx_users_username ON users(username)`);
        await queryRunner.query(`CREATE INDEX idx_users_role ON users(role)`);
        await queryRunner.query(`CREATE INDEX idx_permissions_code ON permissions(code)`);
        await queryRunner.query(`CREATE INDEX idx_classes_course ON classes(course_id)`);
        await queryRunner.query(`CREATE INDEX idx_classes_teacher ON classes(teacher_id)`);
        await queryRunner.query(`CREATE INDEX idx_class_students_class ON class_students(class_id)`);
        await queryRunner.query(`CREATE INDEX idx_class_students_student ON class_students(student_id)`);
        await queryRunner.query(`CREATE INDEX idx_lessons_code ON lessons(code)`);
        await queryRunner.query(`CREATE INDEX idx_lessons_course ON lessons(course_id)`);
        await queryRunner.query(`CREATE INDEX idx_lessons_class ON lessons(class_id)`);
        await queryRunner.query(`CREATE INDEX idx_exercise_sections_lesson ON exercise_sections(lesson_id)`);
        await queryRunner.query(`CREATE INDEX idx_questions_section ON questions(section_id)`);
        await queryRunner.query(`CREATE INDEX idx_common_lists_type ON common_lists(type)`);

        // Create auto-update trigger for updated_at
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Apply triggers
        const tables = ['permissions', 'roles', 'users', 'courses', 'classes', 'lessons', 'lesson_details', 'exercise_sections', 'questions', 'common_lists'];
        for (const table of tables) {
            await queryRunner.query(`
                CREATE TRIGGER update_${table}_updated_at
                    BEFORE UPDATE ON ${table}
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS questions CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS exercise_sections CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS lesson_details CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS lessons CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS class_students CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS classes CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS courses CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS common_lists CASCADE`);

        // Drop types
        await queryRunner.query(`DROP TYPE IF EXISTS status_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_level_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_kind_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS exercise_section_type_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS question_type_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS difficulty_level_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS common_list_type_enum CASCADE`);

        // Drop function
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column CASCADE`);
    }
}
