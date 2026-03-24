import { AgentsReport, Choice, Course, GlobalDashboard } from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

const get = <T>(path: string) =>
  fetch(`${API_BASE_URL}${path}`, { headers: getHeaders() }).then((res) =>
    handleResponse<T>(res),
  );

const post = <T>(path: string, body: unknown) =>
  fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  }).then((res) => handleResponse<T>(res));

const put = <T>(path: string, body: unknown) =>
  fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  }).then((res) => handleResponse<T>(res));

export const api = {
  getCourses: () => get<Course[]>("/courses"),
  getCourseById: (id: string) => get<Course>(`/courses/${id}`),
  createCourse: (title: string, description: string, thumbnail: string) =>
    post("/courses", { title, description, thumbnail }),
  updateCourse: (
    courseId: number,
    title: string,
    description: string,
    thumbnail: string,
  ) => put(`/courses/${courseId}`, { title, description, thumbnail }),

  getLessonById: (lessonId: string) => get(`/lessons/${lessonId}`),
  addLesson: (
    courseId: number,
    title: string,
    description: string,
    contentUrl: string,
    contentType: string,
    order: number,
    passingScore: number,
  ) =>
    post(`/courses/${courseId}/lessons`, {
      title,
      contentUrl,
      contentType,
      description,
      order,
      passingScore,
    }),
  updateLesson: (
    lessonId: number,
    title: string,
    description: string,
    contentUrl: string,
    contentType: string,
    order: number,
    passingScore: number,
  ) =>
    put(`/lessons/${lessonId}`, {
      title,
      contentUrl,
      contentType,
      description,
      order,
      passingScore,
    }),

  getCommentsByLesson: (lessonId: string) => get(`/comments/${lessonId}`),
  addComment: (lessonId: string, text: string) =>
    post(`/comments/${lessonId}`, { text }),

  submitQuiz: (lessonId: number, answers: Record<number, number>) =>
    post(`/quizzes/lesson/${lessonId}/submit`, { answers }),
  createQuestion: (lessonId: number, text: string, choices: Choice[]) =>
    post(`/quizzes/lesson/${lessonId}/questions`, { text, choices }),

  inviteAgent: (email: string, courseId: string) =>
    post("/assignments/invite", { email, courseId }),
  bulkAssign: (emails: string[], courseId: string) =>
    post("/assignments/bulk-assign", { emails, courseId }),

  getAgentProgressReport: () => get<AgentsReport[]>("/reports/agents"),
  getGlobalDashboard: () => get<GlobalDashboard>("/reports/global"),

  deleteCourse: (courseId: number) =>
    fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => handleResponse(res)),
  deleteLesson: (lessonId: number) =>
    fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => handleResponse(res)),
  removeAgent: (userId: number, courseId: number) =>
    fetch(`${API_BASE_URL}/assignments/${userId}/${courseId}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => handleResponse(res)),
};
