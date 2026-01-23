import { 
  Exercise, 
  ExerciseSection, 
  Question,  QuestionUnion,  Dang1_WordBank,
  VocabQuestion,
  GrammarQuestion,
  PracticeQuestion,
  VideoGrammarQuestion,
  ListeningQuestion,
  WritingQuestion,
  ReadingQuestion,
  SpeakingQuestion
} from "../../types/exercise.type";

// Base DTOs
export class CreateExerciseDTO {
  courseId: string;
  lessonNumber: number;
  title: string;
  description: string;
  sections?: CreateExerciseSectionDTO[];

  constructor(data: Partial<CreateExerciseDTO>) {
    this.courseId = data.courseId || "";
    this.lessonNumber = data.lessonNumber || 0;
    this.title = data.title || "";
    this.description = data.description || "";
    this.sections = data.sections || [];
  }
}

export class UpdateExerciseDTO {
  title?: string;
  description?: string;
  sections?: Partial<ExerciseSection>[];

  constructor(data: Partial<UpdateExerciseDTO>) {
    this.title = data.title;
    this.description = data.description;
    this.sections = data.sections;
  }
}

// Exercise Section DTOs
export class CreateExerciseSectionDTO {
  lessonId: string;
  sectionType: string;
  title: string;
  description: string;
  questions?: QuestionUnion[];
  order: number;

  constructor(data: Partial<CreateExerciseSectionDTO>) {
    this.lessonId = data.lessonId || "";
    this.sectionType = data.sectionType || "";
    this.title = data.title || "";
    this.description = data.description || "";
    this.questions = data.questions || [];
    this.order = data.order || 0;
  }
}

// Vocab Question DTO
export class CreateVocabQuestionDTO {
  questionText: string;
  word: string;
  pronunciation: string;
  definition: string;
  examples: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  image?: string;

  constructor(data: Partial<CreateVocabQuestionDTO>) {
    this.questionText = data.questionText || "";
    this.word = data.word || "";
    this.pronunciation = data.pronunciation || "";
    this.definition = data.definition || "";
    this.examples = data.examples || [];
    this.answer = data.answer || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
    this.image = data.image;
  }
}

// Grammar Question DTO
export class CreateGrammarQuestionDTO {
  questionText: string;
  grammarTopic: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateGrammarQuestionDTO>) {
    this.questionText = data.questionText || "";
    this.grammarTopic = data.grammarTopic || "";
    this.options = data.options || [];
    this.answer = data.answer || "";
    this.explanation = data.explanation || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
  }
}

export class CreateWordBankQuestionDTO {
  questionText: string;
  

  workBanks: { id: string | number; name: string }[];
  

  answer: string;
  
  
  correctWordIds: (string | number)[];
  
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateWordBankQuestionDTO>) {
    this.questionText = data.questionText || "";
    this.workBanks = data.workBanks || [];
    this.answer = data.answer || "";
    this.correctWordIds = data.correctWordIds || [];
    this.explanation = data.explanation;
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
  }
}


export class CreatePracticeQuestionDTO {
  questionText: string;
  subType: "multiple_choice" | "fill_blank" | "match" | "arrange";
  options?: string[];
  answer: string | string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreatePracticeQuestionDTO>) {
    this.questionText = data.questionText || "";
    this.subType = data.subType || "multiple_choice";
    this.options = data.options;
    this.answer = data.answer || "";
    this.explanation = data.explanation || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
  }
}


export class CreateVideoGrammarQuestionDTO {
  videoUrl: string;
  videoTitle: string;
  grammarTopic: string;
  questionText: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateVideoGrammarQuestionDTO>) {
    this.videoUrl = data.videoUrl || "";
    this.videoTitle = data.videoTitle || "";
    this.grammarTopic = data.grammarTopic || "";
    this.questionText = data.questionText || "";
    this.options = data.options || [];
    this.answer = data.answer || "";
    this.explanation = data.explanation || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
  }
}

// Listening Question DTO
export class CreateListeningQuestionDTO {
  audioUrl: string;
  audioTitle: string;
  questionType: "multiple_choice" | "fill_blank" | "short_answer";
  questionText: string;
  options?: string[];
  answer: string | string[];
  transcript?: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateListeningQuestionDTO>) {
    this.audioUrl = data.audioUrl || "";
    this.audioTitle = data.audioTitle || "";
    this.questionType = data.questionType || "multiple_choice";
    this.questionText = data.questionText || "";
    this.options = data.options;
    this.answer = data.answer || "";
    this.transcript = data.transcript;
    this.explanation = data.explanation || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
  }
}

// Writing Question DTO
export class CreateWritingQuestionDTO {
  prompt: string;
  hints: string[];
  sampleAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateWritingQuestionDTO>) {
    this.prompt = data.prompt || "";
    this.hints = data.hints || [];
    this.sampleAnswer = data.sampleAnswer || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 5;
  }
}

// Reading Question DTO
export class CreateReadingQuestionDTO {
  passage: string;
  questionText: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateReadingQuestionDTO>) {
    this.passage = data.passage || "";
    this.questionText = data.questionText || "";
    this.options = data.options || [];
    this.answer = data.answer || "";
    this.explanation = data.explanation || "";
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 1;
  }
}

// Speaking Question DTO
export class CreateSpeakingQuestionDTO {
  prompt: string;
  topicArea: string;
  audioExample?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;

  constructor(data: Partial<CreateSpeakingQuestionDTO>) {
    this.prompt = data.prompt || "";
    this.topicArea = data.topicArea || "";
    this.audioExample = data.audioExample;
    this.difficulty = data.difficulty || "medium";
    this.points = data.points || 5;
  }
}

// Response DTOs
export class ExerciseResponseDTO {
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

  constructor(exercise: Exercise) {
    this.id = exercise.id;
    this.courseId = exercise.courseId;
    this.lessonNumber = exercise.lessonNumber;
    this.title = exercise.title;
    this.description = exercise.description;
    this.sections = exercise.sections;
    this.totalPoints = exercise.totalPoints;
    this.estimatedTime = exercise.estimatedTime;
    this.createdAt = exercise.createdAt;
    this.updatedAt = exercise.updatedAt;
  }
}

export class SelectWordFromBankDTO {
  questionId: string;
  userId: string;
  wordId: string | number;
  currentSelectedWordIds: (string | number)[]; 

  constructor(data: Partial<SelectWordFromBankDTO>) {
    this.questionId = data.questionId || "";
    this.userId = data.userId || "";
    this.wordId = data.wordId || "";
    this.currentSelectedWordIds = data.currentSelectedWordIds || [];
  }
}


export class RemoveWordFromAnswerDTO {
  questionId: string;
  userId: string;
  wordId: string | number;
  currentSelectedWordIds: (string | number)[]; 

  constructor(data: Partial<RemoveWordFromAnswerDTO>) {
    this.questionId = data.questionId || "";
    this.userId = data.userId || "";
    this.wordId = data.wordId || "";
    this.currentSelectedWordIds = data.currentSelectedWordIds || [];
  }
}

export class WordBankInteractionResponseDTO {
  success: boolean;
  message: string;
  

  answerArea: { id: string | number; name: string }[];
  
  
  wordBank: { id: string | number; name: string }[];
  
  isCorrect: boolean;
  
  attemptCount: number;

  constructor(data: Partial<WordBankInteractionResponseDTO>) {
    this.success = data.success || false;
    this.message = data.message || "";
    this.answerArea = data.answerArea || [];
    this.wordBank = data.wordBank || [];
    this.isCorrect = data.isCorrect || false;
    this.attemptCount = data.attemptCount || 0;
  }
}

// Request: User submits their answer
export class SubmitWordBankDTO {
  questionId: string;
  userId: string;
  selectedWordIds: (string | number)[]; // Final selected words in Answer Area

  constructor(data: Partial<SubmitWordBankDTO>) {
    this.questionId = data.questionId || "";
    this.userId = data.userId || "";
    this.selectedWordIds = data.selectedWordIds || [];
  }
}

// Response: After submitting the WordBank exercise
export class WordBankSubmissionResponseDTO {
  success: boolean;
  isCorrect: boolean;
  message: string;
  
  // User's final answer (joined words)
  userAnswer: string;
  
  // Correct answer
  correctAnswer: string;
  
  // How many times user corrected before submitting
  attemptCount: number;
  
  // Points earned
  pointsAwarded: number;
  
  // Explanation of the correct answer
  explanation?: string;

  constructor(data: Partial<WordBankSubmissionResponseDTO>) {
    this.success = data.success || false;
    this.isCorrect = data.isCorrect || false;
    this.message = data.message || "";
    this.userAnswer = data.userAnswer || "";
    this.correctAnswer = data.correctAnswer || "";
    this.attemptCount = data.attemptCount || 0;
    this.pointsAwarded = data.pointsAwarded || 0;
    this.explanation = data.explanation;
  }
}
