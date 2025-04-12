
import { v4 as uuidv4 } from "uuid";
import { Assignment, LeaveRequest, Role, Schedule, Submission, User } from "@/app/types";

// Mock users data
const users: User[] = [
  {
    id: "t1",
    name: "John Smith",
    email: "john@example.com",
    role: "TEACHER" as Role,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01")
  },
  {
    id: "t2",
    name: "Emma Davis",
    email: "emma@example.com",
    role: "TEACHER" as Role,
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02")
  },
  {
    id: "s1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "STUDENT" as Role,
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03")
  },
  {
    id: "s2",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "STUDENT" as Role,
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2023-01-04")
  },
  {
    id: "s3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "STUDENT" as Role,
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-01-05")
  }
];

// Mock assignments data
const assignments: Assignment[] = [
  {
    id: "a1",
    title: "Introduction to React",
    description: "Create a simple React application with components, props, and state.",
    dueDate: new Date("2023-04-15"),
    createdAt: new Date("2023-04-01"),
    teacherId: "t1"
  },
  {
    id: "a2",
    title: "Advanced CSS Techniques",
    description: "Implement responsive design using CSS Grid and Flexbox.",
    dueDate: new Date("2023-04-20"),
    createdAt: new Date("2023-04-05"),
    teacherId: "t2"
  }
];

// Mock submissions data
const submissions: Submission[] = [
  {
    id: "sub1",
    assignmentId: "a1",
    studentId: "s1",
    content: "https://github.com/alice/react-project",
    submittedAt: new Date("2023-04-14"),
    grade: "A",
    feedback: "Excellent work! You've demonstrated a good understanding of React components."
  },
  {
    id: "sub2",
    assignmentId: "a1",
    studentId: "s2",
    content: "https://github.com/bob/react-assignment",
    submittedAt: new Date("2023-04-15"),
    grade: "B",
    feedback: "Good job! Consider implementing error handling in your components."
  },
  {
    id: "sub3",
    assignmentId: "a2",
    studentId: "s1",
    content: "https://codepen.io/alice/css-project",
    submittedAt: new Date("2023-04-18")
  }
];

// Mock schedules data
const schedules: Schedule[] = [
  {
    id: "sch1",
    title: "Web Development Basics",
    description: "Introduction to HTML, CSS, and JavaScript",
    startTime: new Date("2023-04-10T09:00:00"),
    endTime: new Date("2023-04-10T11:00:00"),
    teacherId: "t1"
  },
  {
    id: "sch2",
    title: "React Workshop",
    description: "Hands-on session with React hooks and context",
    startTime: new Date("2023-04-12T13:00:00"),
    endTime: new Date("2023-04-12T16:00:00"),
    teacherId: "t1"
  },
  {
    id: "sch3",
    title: "CSS Masterclass",
    description: "Advanced CSS techniques and animations",
    startTime: new Date("2023-04-14T10:00:00"),
    endTime: new Date("2023-04-14T12:00:00"),
    teacherId: "t2"
  }
];

// Mock leave requests data
const leaveRequests: LeaveRequest[] = [
  {
    id: "lr1",
    reason: "Family event",
    startDate: new Date("2023-04-22"),
    endDate: new Date("2023-04-23"),
    status: "APPROVED",
    studentId: "s1",
    createdAt: new Date("2023-04-15")
  },
  {
    id: "lr2",
    reason: "Medical appointment",
    startDate: new Date("2023-04-25"),
    endDate: new Date("2023-04-25"),
    status: "PENDING",
    studentId: "s2",
    createdAt: new Date("2023-04-18")
  }
];

// Mock service functions

// Auth
export const login = async (email: string, password: string): Promise<User | null> => {
  // For demo purposes, we'll just check if the email exists
  const user = users.find(u => u.email === email);
  return user || null;
};

// Users
export const getUsers = async (): Promise<User[]> => {
  return users;
};

export const getUserById = async (id: string): Promise<User | null> => {
  return users.find(u => u.id === id) || null;
};

export const getTeachers = async (): Promise<User[]> => {
  return users.filter(u => u.role === "TEACHER");
};

export const getStudents = async (): Promise<User[]> => {
  return users.filter(u => u.role === "STUDENT");
};

// Assignments
export const getAssignments = async (): Promise<Assignment[]> => {
  return assignments.map(a => ({
    ...a,
    teacher: users.find(u => u.id === a.teacherId)
  }));
};

export const getAssignmentById = async (id: string): Promise<Assignment | null> => {
  const assignment = assignments.find(a => a.id === id);
  if (!assignment) return null;
  
  return {
    ...assignment,
    teacher: users.find(u => u.id === assignment.teacherId)
  };
};

export const getAssignmentsByTeacher = async (teacherId: string): Promise<Assignment[]> => {
  return assignments
    .filter(a => a.teacherId === teacherId)
    .map(a => ({
      ...a,
      teacher: users.find(u => u.id === a.teacherId)
    }));
};

export const createAssignment = async (data: Omit<Assignment, "id" | "createdAt">): Promise<Assignment> => {
  const newAssignment: Assignment = {
    id: uuidv4(),
    ...data,
    createdAt: new Date()
  };
  assignments.push(newAssignment);
  return newAssignment;
};

// Submissions
export const getSubmissions = async (): Promise<Submission[]> => {
  return submissions.map(s => ({
    ...s,
    student: users.find(u => u.id === s.studentId),
    assignment: assignments.find(a => a.id === s.assignmentId)
  }));
};

export const getSubmissionById = async (id: string): Promise<Submission | null> => {
  const submission = submissions.find(s => s.id === id);
  if (!submission) return null;
  
  return {
    ...submission,
    student: users.find(u => u.id === submission.studentId),
    assignment: assignments.find(a => a.id === submission.assignmentId)
  };
};

export const getSubmissionsByAssignment = async (assignmentId: string): Promise<Submission[]> => {
  return submissions
    .filter(s => s.assignmentId === assignmentId)
    .map(s => ({
      ...s,
      student: users.find(u => u.id === s.studentId),
      assignment: assignments.find(a => a.id === s.assignmentId)
    }));
};

export const getSubmissionsByStudent = async (studentId: string): Promise<Submission[]> => {
  return submissions
    .filter(s => s.studentId === studentId)
    .map(s => ({
      ...s,
      student: users.find(u => u.id === s.studentId),
      assignment: assignments.find(a => a.id === s.assignmentId)
    }));
};

export const createSubmission = async (data: Omit<Submission, "id" | "submittedAt">): Promise<Submission> => {
  const newSubmission: Submission = {
    id: uuidv4(),
    ...data,
    submittedAt: new Date()
  };
  submissions.push(newSubmission);
  return newSubmission;
};

export const updateSubmission = async (id: string, data: Partial<Submission>): Promise<Submission | null> => {
  const index = submissions.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  submissions[index] = { ...submissions[index], ...data };
  
  return {
    ...submissions[index],
    student: users.find(u => u.id === submissions[index].studentId),
    assignment: assignments.find(a => a.id === submissions[index].assignmentId)
  };
};

// Schedules
export const getSchedules = async (): Promise<Schedule[]> => {
  return schedules.map(s => ({
    ...s,
    teacher: users.find(u => u.id === s.teacherId)
  }));
};

export const getScheduleById = async (id: string): Promise<Schedule | null> => {
  const schedule = schedules.find(s => s.id === id);
  if (!schedule) return null;
  
  return {
    ...schedule,
    teacher: users.find(u => u.id === schedule.teacherId)
  };
};

export const getSchedulesByTeacher = async (teacherId: string): Promise<Schedule[]> => {
  return schedules
    .filter(s => s.teacherId === teacherId)
    .map(s => ({
      ...s,
      teacher: users.find(u => u.id === s.teacherId)
    }));
};

export const createSchedule = async (data: Omit<Schedule, "id">): Promise<Schedule> => {
  const newSchedule: Schedule = {
    id: uuidv4(),
    ...data
  };
  schedules.push(newSchedule);
  return newSchedule;
};

// Leave Requests
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  return leaveRequests.map(lr => ({
    ...lr,
    student: users.find(u => u.id === lr.studentId)
  }));
};

export const getLeaveRequestById = async (id: string): Promise<LeaveRequest | null> => {
  const leaveRequest = leaveRequests.find(lr => lr.id === id);
  if (!leaveRequest) return null;
  
  return {
    ...leaveRequest,
    student: users.find(u => u.id === leaveRequest.studentId)
  };
};

export const getLeaveRequestsByStudent = async (studentId: string): Promise<LeaveRequest[]> => {
  return leaveRequests
    .filter(lr => lr.studentId === studentId)
    .map(lr => ({
      ...lr,
      student: users.find(u => u.id === lr.studentId)
    }));
};

export const createLeaveRequest = async (data: Omit<LeaveRequest, "id" | "status" | "createdAt">): Promise<LeaveRequest> => {
  const newLeaveRequest: LeaveRequest = {
    id: uuidv4(),
    ...data,
    status: "PENDING",
    createdAt: new Date()
  };
  leaveRequests.push(newLeaveRequest);
  return newLeaveRequest;
};

export const updateLeaveRequest = async (id: string, data: Partial<LeaveRequest>): Promise<LeaveRequest | null> => {
  const index = leaveRequests.findIndex(lr => lr.id === id);
  if (index === -1) return null;
  
  leaveRequests[index] = { ...leaveRequests[index], ...data };
  
  return {
    ...leaveRequests[index],
    student: users.find(u => u.id === leaveRequests[index].studentId)
  };
};
