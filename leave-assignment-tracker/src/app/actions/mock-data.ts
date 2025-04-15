"use server";
import {prisma} from "@/app/lib/index"
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Mock service functions

// Auth

export const login = async (email: string, password: string): Promise<any | null> => {
  // For demo purposes, we'll just check if the email exists
  const result = await prisma.user.findFirst({
      where: {
        email: email
      }
  });
 
  return result ; 
};
// Users

// USER ACTIONS
export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Failed to fetch user" };
  }
}


export async function createAssignment(formData: FormData) {
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().min(1, "Due date is required"),
    teacherId: z.string().min(1, "Teacher ID is required")
  });

  try {
    const { title, description, dueDate, teacherId } = schema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      teacherId: formData.get("teacherId")
    });

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        teacherId
      }
    });

    revalidatePath("/Assignments");
    return { success: true, data: assignment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create assignment" };
  }
}


// SOLUTION (SUBMISSION) ACTIONS

// app/lib/actions.ts
export async function getAssignments() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
    return { success: true, data: assignments };
  } catch (error) {
    return { success: false, error: "Failed to fetch assignments" };
  }
}

export async function getAssignmentsByTeacher(teacherId: string) {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { teacherId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        },
        solutions: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
    return { success: true, data: assignments };
  } catch (error) {
    return { success: false, error: "Failed to fetch assignments" };
  }
}

export async function getSubmissionsByStudent(studentId: string) {
  try {
    const submissions = await prisma.solution.findMany({
      where: { studentId },
      include: {
        assignment: true
      }
    });
    return { success: true, data: submissions };
  } catch (error) {
    return { success: false, error: "Failed to fetch submissions" };
  }
}


// LEAVE REQUEST ACTIONS
export async function getLeaveRequests() {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      include: {
        student: true
      }
    });
    return { success: true, data: leaveRequests };
  } catch (error) {
    return { success: false, error: "Failed to fetch leave requests" };
  }
}

export async function getLeaveRequestById(id: string) {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        student: true
      }
    });
    return { success: true, data: leaveRequest };
  } catch (error) {
    return { success: false, error: "Failed to fetch leave request" };
  }
}

export async function getLeaveRequestsByStudent(studentId: string) {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { studentId },
      include: {
        student: true
      }
    });
    return { success: true, data: leaveRequests };
  } catch (error) {
    return { success: false, error: "Failed to fetch leave requests" };
  }
}

export async function createLeaveRequest(formData: FormData) {
  const schema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    reason: z.string().min(1, "Reason is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required")
  });

  try {
    const { studentId, reason, startDate, endDate } = schema.parse({
      studentId: formData.get("studentId"),
      reason: formData.get("reason"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate")
    });

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        studentId,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "PENDING"
      }
    });

    revalidatePath("/LeaveRequests");
    return { success: true, data: leaveRequest };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create leave request" };
  }
}

export async function updateLeaveRequest(formData: FormData) {
  const schema = z.object({
    id: z.string().min(1, "ID is required"),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"])
  });

  try {
    const { id, status } = schema.parse({
      id: formData.get("id"),
      status: formData.get("status")
    });

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status
      }
    });

    revalidatePath("/LeaveRequests");
    return { success: true, data: leaveRequest };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update leave request" };
  }
}




// SCHEDULE ACTIONS
export async function getSchedules() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return { success: true, data: schedules };
  } catch (error) {
    return { success: false, error: "Failed to fetch schedules" };
  }
}

export async function getScheduleById(id: string) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        teacher: true
      }
    });
    return { success: true, data: schedule };
  } catch (error) {
    return { success: false, error: "Failed to fetch schedule" };
  }
}

export async function getSchedulesByTeacher(teacherId: string) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { teacherId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return { success: true, data: schedules };
  } catch (error) {
    return { success: false, error: "Failed to fetch schedules" };
  }
}

export async function createSchedule(formData: FormData) {
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    teacherId: z.string().min(1, "Teacher ID is required")
  });

  try {
    const { title, description, startTime, endTime, teacherId } = schema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      teacherId: formData.get("teacherId")
    });

    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        teacherId
      }
    });

    revalidatePath("/Schedules");
    return { success: true, data: schedule };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create schedule" };
  }
}

export async function updateSchedule(formData: FormData) {
  const schema = z.object({
    id: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required")
  });

  try {
    const { id, title, description, startTime, endTime } = schema.parse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime")
    });

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    });

    revalidatePath("/Schedules");
    return { success: true, data: schedule };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update schedule" };
  }
}





// app/lib/actions.ts
export async function getAssignmentById(id: string) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return { success: true, data: assignment };
  } catch (error) {
    return { success: false, error: "Failed to fetch assignment" };
  }
}

export async function getSubmissionsByAssignment(assignmentId: string) {
  try {
    const submissions = await prisma.solution.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return { success: true, data: submissions };
  } catch (error) {
    return { success: false, error: "Failed to fetch submissions" };
  }
}

export async function createSubmission(formData: FormData) {
  const schema = z.object({
    assignmentId: z.string().min(1, "Assignment ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
    content: z.string().min(1, "Content is required")
  });

  try {
    const { assignmentId, studentId, content } = schema.parse({
      assignmentId: formData.get("assignmentId"),
      studentId: formData.get("studentId"),
      content: formData.get("content")
    });

    const submission = await prisma.solution.create({
      data: {
        content,
        assignmentId,
        studentId
      }
    });

    revalidatePath(`/Assignments/${assignmentId}`);
    return { success: true, data: submission };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create submission" };
  }
}

export async function updateSubmission(submissionId: string, formData: FormData) {
  const schema = z.object({
    grade: z.string().min(1, "Grade is required"),
    feedback: z.string().optional()
  });

  try {
    const { grade, feedback } = schema.parse({
      grade: formData.get("grade"),
      feedback: formData.get("feedback")
    });

    const submission = await prisma.solution.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback: feedback || null
      }
    });

    revalidatePath(`/Assignments/${submission.assignmentId}`);
    return { success: true, data: submission };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update submission" };
  }
}