export type CourseStatus = 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';

type ContentType = 'VIDEO' | 'AUDIO' | 'PDF';

export interface Question {
  id: number;
  lessonId: number;
  text: string;
  choices: Choice[];
  lesson: Lesson;
}

export interface Choice {
  id: number;
  isCorrect: boolean;
  questionId: number;
  text: string;
  question: Question;
}

export interface Lesson {
  id: number;
  title: string;
  courseId: number;
  order: number;
  passingScore: number;
  // videoUrl: string;
  contentUrl: string;
  contentType: ContentType;
  description: string;
  questions: Question[];
  completed?: boolean;
  lessonProgress: LessonProgress[];
}

export interface LessonProgress {
  id: number;
  completed: boolean;
  lessonId: number;
  score: number;
  userId: number;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  status: CourseStatus;
  lessons?: Lesson[];
  author?: {
    name: string;
  };
  progress: {
    percentage: number;
    completedCount: number;
    totalCount: number;
    isFullyCompleted: boolean;
  };
}

export interface AgentsReport {
  agentEmail: string;
  enrolledCourses: EnrolledCourses[];
  coursesEnrolled: number;
  quizResults: QuizResults[];
}

export interface EnrolledCourses {
  courseTitle: string;
  completionRate: string;
  lessonsFinished: string;
  status: string;
}

export interface QuizResults {
  lesson: string;
  score: string;
  status: string;
}