import { Exercise, ExerciseSection, ExerciseType, Question } from "../types/exercise.type";

export class ExerciseEntity implements Exercise {
  id: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  description: string;
  sections: ExerciseSection[];
  totalPoints: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Exercise>) {
    this.id = data.id || `exercise_${Date.now()}`;
    this.courseId = data.courseId || "";
    this.lessonNumber = data.lessonNumber || 0;
    this.title = data.title || "";
    this.description = data.description || "";
    this.sections = data.sections || [];
    this.totalPoints = data.totalPoints || 0;
    this.estimatedTime = data.estimatedTime || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  calculateTotalPoints(): number {
    return this.sections.reduce((sum, section) => sum + section.totalPoints, 0);
  }

  calculateTotalTime(): number {
    return this.sections.reduce((sum, section) => sum + section.estimatedTime, 0);
  }

  getSectionByType(type: ExerciseType): ExerciseSection | undefined {
    return this.sections.find(section => section.sectionType === type);
  }

  addSection(section: ExerciseSection): void {
    this.sections.push(section);
    this.totalPoints = this.calculateTotalPoints();
    this.estimatedTime = this.calculateTotalTime();
  }

  updateSection(sectionId: string, updates: Partial<ExerciseSection>): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      Object.assign(section, updates);
      this.totalPoints = this.calculateTotalPoints();
      this.estimatedTime = this.calculateTotalTime();
    }
  }

  removeSection(sectionId: string): void {
    this.sections = this.sections.filter(s => s.id !== sectionId);
    this.totalPoints = this.calculateTotalPoints();
    this.estimatedTime = this.calculateTotalTime();
  }
}
