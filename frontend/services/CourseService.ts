import { AgentsReport, Choice, Course, GlobalDashboard } from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
  getHeaders: () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  getAgentProgressReport: async (): Promise<AgentsReport[]> => {
    const res = await fetch(`${API_BASE_URL}/assignments/reports/agents`, {
      headers: api.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  getGlobalDashboard: async (): Promise<GlobalDashboard> => {
    const res = await fetch(`${API_BASE_URL}/assignments/reports/global`, {
      headers: api.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  getCourses: async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      headers: api.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  getCourseById: async (id: string): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: api.getHeaders(),
    });
    if (!res.ok) throw new Error("Course not found");
    return res.json();
  },

  submitQuiz: async (lessonId: number, answers: Record<number, number>) => {
    const res = await fetch(
      `${API_BASE_URL}/quizzes/lesson/${lessonId}/submit`,
      {
        method: "POST",
        headers: api.getHeaders(),
        body: JSON.stringify({ answers }),
      },
    );
    return res.json();
  },

  createCourse: async (
    title: string,
    description: string,
    thumbnail: string,
  ) => {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: api.getHeaders(),
      body: JSON.stringify({ title, description, thumbnail }),
    });
     return res.json();
  },

  updateCourse: async (
    courseId: number,
    title: string,
    description: string,
    thumbnail: string,
  ) => {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: "PUT",
      headers: api.getHeaders(),
      body: JSON.stringify({ title, description, thumbnail }),
    });
     return res.json();
  },

  addLesson: async (
    courseId: number,
    title: string,
    contentUrl: string,
    contentType: string,
    order: number,
    passingScore: number,

  ) => {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
      method: "POST",
      headers: api.getHeaders(),
      body: JSON.stringify({ title, contentUrl, contentType, order, passingScore }),
    });
     return res.json();
  },

   updateLesson: async (
    lessonId: number,
    title: string,
    contentUrl: string,
    contentType: string,
    order: number,
    passingScore: number,

  ) => {
    const res = await fetch(`${API_BASE_URL}/courses/lesson/${lessonId}`, {
      method: "PUT",
      headers: api.getHeaders(),
      body: JSON.stringify({ title, contentUrl, contentType, order, passingScore }),
    });
     return res.json();
  },

  createQuestion: async (
    lessonId: number,
    text: string,
    choices: Choice[],

  ) => {
    const res = await fetch(`${API_BASE_URL}/quizzes/lesson/${lessonId}/questions`, {
      method: "POST",
      headers: api.getHeaders(),
      body: JSON.stringify({ text, choices}),
    });
     return res.json();
  },
};
