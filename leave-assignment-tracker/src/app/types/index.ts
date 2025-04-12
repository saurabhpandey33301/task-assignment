
export type Role = "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  teacherId: string;
  teacher?: User;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignment?: Assignment;
  studentId: string;
  student?: User;
  content: string;
  grade?: string;
  feedback?: string;
  submittedAt: Date;
}

export interface Schedule {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  teacherId: string;
  teacher?: User;
}

export interface LeaveRequest {
  id: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  studentId: string;
  student?: User;
  createdAt: Date;
}
