// Word Bank type
export type WorkBank = {
  id: string | number;
  name: string;
};

// Question types
export type Question = {
  id: string;
  questionText: string;
  questionType: ExerciseType;
  difficulty: "easy" | "medium" | "hard";
  points: number;
};


export type Dang1_WordBank = Question & {
  workBanks: WorkBank[];
  answer: string;
  
  correctWordIds: (string | number)[];
  
  explanation?: string;
};

// Vocab Section
export type VocabQuestion = Question & {
  word: string;
  pronunciation: string;
  definition: string;
  examples: string[];
  image?: string;
  answer: string;
};

// Grammar Section
export type GrammarQuestion = Question & {
  grammarTopic: string;
  questionText: string;
  options: string[];
  answer: string;
  explanation: string;
};

// Practice Section (Mixed types)
export type PracticeQuestion = Question & {
  subType: "multiple_choice" | "fill_blank" | "match" | "arrange";
  questionText: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
};

// Video Grammar Section
export type VideoGrammarQuestion = Question & {
  videoUrl: string;
  videoTitle: string;
  grammarTopic: string;
  questionText: string;
  options: string[];
  answer: string;
  explanation: string;
};

// Listening Section
export type ListeningQuestion = Question & {
  audioUrl: string;
  audioTitle: string;
  questionType: "multiple_choice" | "fill_blank" | "short_answer";
  questionText: string;
  options?: string[];
  answer: string | string[];
  transcript?: string;
  explanation: string;
};

// Writing Section
export type WritingQuestion = Question & {
  prompt: string;
  hints: string[];
  sampleAnswer: string;
  rubric: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    total: number;
  };
};

// Reading Section
export type ReadingQuestion = Question & {
  passage: string;
  questionText: string;
  options: string[];
  answer: string;
  explanation: string;
};

// Speaking Section
export type SpeakingQuestion = Question & {
  prompt: string;
  topicArea: string;
  audioExample?: string;
  evaluationCriteria: {
    pronunciation: number;
    fluency: number;
    grammar: number;
    vocabulary: number;
    total: number;
  };
};

// Exercise Section Type
export type ExerciseSection = {
  id: string;
  lessonId: string;
  sectionType: ExerciseType;
  title: string;
  description: string;
  questions: QuestionUnion[];
  totalPoints: number;
  estimatedTime: number; // in minutes
  order: number;
};

// Union of all question types for flexibility in sections
export type QuestionUnion = 
  | VocabQuestion 
  | GrammarQuestion 
  | Dang1_WordBank 
  | PracticeQuestion 
  | VideoGrammarQuestion 
  | ListeningQuestion 
  | WritingQuestion 
  | ReadingQuestion 
  | SpeakingQuestion;

// Main Exercise/Lesson type
export type ExerciseType = 
  | "vocab"
  | "grammar"
  | "practice"
  | "video_grammar"
  | "listening"
  | "writing"
  | "reading"
  | "speaking";

export type Exercise = {
  id: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  description: string;
  sections: ExerciseSection[];
  totalPoints: number;
  estimatedTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
};


// User's current state while solving a WordBank exercise
export type WordBankUserState = {
  questionId: string;
  userId: string;
  
  // Words currently in the Answer Area (top) - in order
  selectedWordIds: (string | number)[];
  
  // Words available in the Word Bank (bottom) - automatically calculated from workBanks - selectedWordIds
  availableWordIds: (string | number)[];
  
  // Number of corrections made so far
  attemptCount: number;
  
  // Whether the current answer matches the correct answer
  isCorrect: boolean;
  
  startTime: Date;
  lastModifiedTime: Date;
};

// Response when user clicks a word in Word Bank (bottom)
export type WordBankSelectResponse = {
  success: boolean;
  message: string;
  selectedWordIds: (string | number)[]; // Updated answer area
  availableWordIds: (string | number)[]; // Updated word bank
  isCorrect: boolean;
  attemptCount: number;
};

// Response when user clicks a word in Answer Area (top) to remove it
export type WordBankRemoveResponse = {
  success: boolean;
  message: string;
  selectedWordIds: (string | number)[]; // Updated answer area
  availableWordIds: (string | number)[]; // Updated word bank
  isCorrect: boolean;
  attemptCount: number;
};

// Submission of the WordBank exercise
export type WordBankSubmissionResponse = {
  success: boolean;
  isCorrect: boolean;
  message: string;
  selectedAnswer: string; // User's final answer
  correctAnswer: string;
  attemptCount: number;
  pointsAwarded: number;
  explanation?: string;
};
