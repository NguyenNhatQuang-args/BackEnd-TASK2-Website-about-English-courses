import { Exercise, VocabQuestion, GrammarQuestion, PracticeQuestion, VideoGrammarQuestion, ListeningQuestion, WritingQuestion, ReadingQuestion, SpeakingQuestion, Dang1_WordBank } from "../types/exercise.type";

// Minimal seed data with ONE example per section
export const exercisesData: Exercise[] = [
  {
    id: "exercise_lesson_1",
    courseId: "course_beginner",
    lessonNumber: 1,
    title: "Basic Greetings and Introductions",
    description: "Learn how to greet people and introduce yourself in English",
    totalPoints: 8,
    estimatedTime: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      // VOCAB SECTION - 1 question
      {
        id: "section_vocab_1",
        lessonId: "exercise_lesson_1",
        sectionType: "vocab",
        title: "Essential Greetings Vocabulary",
        description: "Learn key vocabulary for greetings",
        order: 1,
        totalPoints: 1,
        estimatedTime: 3,
        questions: [
          {
            id: "vocab_q1",
            questionText: "What does 'greet' mean?",
            questionType: "vocab",
            difficulty: "easy",
            points: 1,
            word: "greet",
            pronunciation: "/ɡriːt/",
            definition: "To welcome or acknowledge someone in a friendly way",
            examples: [
              "I greet my friends every morning.",
              "The host greeted the guests at the door."
            ],
            answer: "To welcome or acknowledge someone in a friendly way"
          } as VocabQuestion
        ]
      },

      // GRAMMAR SECTION - 1 question
      {
        id: "section_grammar_1",
        lessonId: "exercise_lesson_1",
        sectionType: "grammar",
        title: "Present Simple Tense",
        description: "Learn present simple tense usage",
        order: 2,
        totalPoints: 1,
        estimatedTime: 3,
        questions: [
          {
            id: "grammar_q1",
            questionText: "Choose the correct form: 'I ___ to school every day.'",
            questionType: "grammar",
            difficulty: "easy",
            points: 1,
            grammarTopic: "Present Simple",
            options: ["go", "goes", "going", "gone"],
            answer: "go",
            explanation: "With 'I' (first person singular), use the base form 'go'."
          } as GrammarQuestion
        ]
      },

      // PRACTICE SECTION (WORDBANK) - 1 question
      {
        id: "section_practice_1",
        lessonId: "exercise_lesson_1",
        sectionType: "practice",
        title: "Word Bank Practice",
        description: "Arrange words to form correct sentences",
        order: 3,
        totalPoints: 1,
        estimatedTime: 3,
        questions: [
          {
            id: "practice_q1",
            questionText: "Arrange the words to form a correct greeting",
            questionType: "practice",
            difficulty: "easy",
            points: 1,
            workBanks: [
              { id: "1", name: "you" },
              { id: "2", name: "do" },
              { id: "3", name: "how" }
            ],
            answer: "How do you",
            correctWordIds: ["3", "2", "1"]
          } as Dang1_WordBank
        ]
      },

      // VIDEO GRAMMAR SECTION - 1 question
      {
        id: "section_video_1",
        lessonId: "exercise_lesson_1",
        sectionType: "video_grammar",
        title: "Greeting Expressions Video",
        description: "Watch and learn common greeting expressions",
        order: 4,
        totalPoints: 1,
        estimatedTime: 5,
        questions: [
          {
            id: "video_q1",
            questionText: "What is the proper way to greet a friend?",
            questionType: "video_grammar",
            difficulty: "easy",
            points: 1,
            videoUrl: "https://example.com/greetings",
            videoDuration: 120,
            videoTitle: "Greetings Video",
            grammarTopic: "Greetings",
            options: ["Hello", "Hi", "Good morning"],
            answer: "Good morning",
            explanation: "'Good morning' is a proper greeting in the morning."
          } as VideoGrammarQuestion
        ]
      },

      // LISTENING SECTION - 1 question
      {
        id: "section_listening_1",
        lessonId: "exercise_lesson_1",
        sectionType: "listening",
        title: "Listening to Greetings",
        description: "Listen and identify the greeting",
        order: 5,
        totalPoints: 1,
        estimatedTime: 3,
        questions: [
          {
            id: "listening_q1",
            questionText: "What greeting do you hear?",
            questionType: "listening",
            difficulty: "easy",
            points: 1,
            audioUrl: "https://example.com/greeting-audio",
            audioDuration: 5,
            options: ["Hello", "Goodbye", "Thank you"],
            answer: "Hello",
            transcript: "Hello, how are you?"
          } as ListeningQuestion
        ]
      },

      // READING SECTION - 1 question
      {
        id: "section_reading_1",
        lessonId: "exercise_lesson_1",
        sectionType: "reading",
        title: "Reading Dialogues",
        description: "Read a dialogue and answer questions",
        order: 6,
        totalPoints: 1,
        estimatedTime: 3,
        questions: [
          {
            id: "reading_q1",
            questionText: "Based on the dialogue, what time of day is it?",
            questionType: "reading",
            difficulty: "easy",
            points: 1,
            passage: "A: Good morning! How are you?\nB: I'm fine, thank you. How are you?\nA: I'm doing well, thanks for asking.",
            options: ["Morning", "Afternoon", "Evening"],
            answer: "Morning",
            explanation: "'Good morning' is used in the morning."
          } as ReadingQuestion
        ]
      },

      // WRITING SECTION - 1 question
      {
        id: "section_writing_1",
        lessonId: "exercise_lesson_1",
        sectionType: "writing",
        title: "Write Your Introduction",
        description: "Write a short introduction of yourself",
        order: 7,
        totalPoints: 1,
        estimatedTime: 5,
        questions: [
          {
            id: "writing_q1",
            questionText: "Write a short introduction (2-3 sentences). Include your name, where you're from, and one hobby.",
            questionType: "writing",
            difficulty: "easy",
            points: 1,
            prompt: "Write a brief introduction about yourself.",
            hints: ["Include your name", "Mention your origin", "Add one hobby"],
            sampleAnswer: "Hi, my name is John. I am from Vietnam. I enjoy playing football.",
            rubric: {
              grammar: 1,
              vocabulary: 1,
              coherence: 1,
              total: 3
            }
          } as WritingQuestion
        ]
      },

      // SPEAKING SECTION - 1 question
      {
        id: "section_speaking_1",
        lessonId: "exercise_lesson_1",
        sectionType: "speaking",
        title: "Introduce Yourself",
        description: "Record yourself introducing yourself",
        order: 8,
        totalPoints: 1,
        estimatedTime: 5,
        questions: [
          {
            id: "speaking_q1",
            questionText: "Introduce yourself. Say your name and where you're from.",
            questionType: "speaking",
            difficulty: "easy",
            points: 1,
            prompt: "Record a 30-second introduction including your name and country.",
            topicArea: "Personal Introduction",
            evaluationCriteria: {
              pronunciation: 1,
              total: 1
            }
          } as SpeakingQuestion
        ]
      }
    ]
  }
];
