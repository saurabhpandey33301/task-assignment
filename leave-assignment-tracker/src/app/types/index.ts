
// export type Role = "TEACHER" | "STUDENT";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Assignment {
//   id: string;
//   title: string;
//   description: string;
//   dueDate: Date;
//   createdAt: Date;
//   teacherId: string;
//   teacher?: User;
// }

// export interface Submission {
//   id: string;
//   assignmentId: string;
//   assignment?: Assignment;
//   studentId: string;
//   student?: User;
//   content: string;
//   grade?: string;
//   feedback?: string;
//   submittedAt: Date;
// }

// export interface Schedule {
//   id: string;
//   title: string;
//   description: string;
//   startTime: Date;
//   endTime: Date;
//   teacherId: string;
//   teacher?: User;
// }

// export interface LeaveRequest {
//   id: string;
//   reason: string;
//   startDate: Date;
//   endDate: Date;
//   status: "PENDING" | "APPROVED" | "REJECTED";
//   studentId: string;
//   student?: User;
//   createdAt: Date;
// }




// app/types/index.ts

export type Role = "TEACHER" | "STUDENT";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string | null;
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
  teacherId: string;
  teacher?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  content: string;
  submissionDate: Date;
  studentId: string;
  assignmentId: string;
  student?: User;
  assignment?: Assignment;
  createdAt: Date;
  updatedAt: Date;
  grade?: string;
  feedback?: string;
  
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  student?: User;
  createdAt: Date;
  updatedAt: Date;
}

export type Schedule = {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  teacherId: string;
};

// Response type for server actions
export interface ServerActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}


export type ScheduleWithTeacher = Schedule & {
  teacher: {
    id: string;
    name: string | null;
  };
};

// types.ts
