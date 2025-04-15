"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Layout from "@/components/Layout";
import DashboardCard from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { 
  getAssignmentsByTeacher, 
  getSchedulesByTeacher,
  getLeaveRequests,
  getSubmissionsByStudent,
  getAssignments,
  getSchedules
} from "@/app/actions/mock-data";
import {  LeaveRequest } from "@/app/types/index";
import { CalendarIcon, BookIcon, FileTextIcon, PlusIcon } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === "TEACHER") {
          const [teacherAssignments, teacherSchedules, allLeaveRequests] = await Promise.all([
            getAssignmentsByTeacher(user.id),
            getSchedulesByTeacher(user.id),
            getLeaveRequests()
          ]);
          setAssignments(teacherAssignments.data || []);
          setSchedules(teacherSchedules.data || []);
          // Type-safe filtering for leave requests
          setLeaveRequests(
            allLeaveRequests.data?.filter((lr: LeaveRequest) => 
              lr.status === "PENDING"
            ) || []
          );
        } else if (user?.role === "STUDENT") {
          const [allAssignments, allSchedules, studentSubmissions, studentLeaveRequests] = await Promise.all([
            getAssignments(),
            getSchedules(), // Get all schedules
            getSubmissionsByStudent(user.id),
            getLeaveRequests()
          ]);
          console.log(allSchedules);
          
          // Safe approach for filtering assignments
            const submittedAssignmentIds: string[] = (studentSubmissions?.data || [])
            .map((sub: any & { grade: string | null }): string => sub.assignmentId || "")
            .filter((id: string): boolean => id !== "");
          
          const pendingAssignments = allAssignments.data?.filter(
            (assignment) => 
              assignment?.id && !submittedAssignmentIds.includes(assignment.id)
          ) || [];
          
          setAssignments(pendingAssignments);
          setSchedules(allSchedules.data || []);
          setSubmissions(studentSubmissions.data || []);
          
          // Type-safe filtering for student leave requests
          setLeaveRequests(
            studentLeaveRequests.data?.filter((lr: LeaveRequest) => 
              lr.studentId === user.id
            ) || []
          );
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          Loading...
        </div>
      </Layout>
    );
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          {user?.role === "TEACHER" && (
            <div className="flex gap-2">
              <Button onClick={() => navigateTo("/CreateAssignment")}>
                <PlusIcon size={16} className="mr-2" />
                New Assignment
              </Button>
              <Button onClick={() => navigateTo("/CreateSchedule")}>
                <PlusIcon size={16} className="mr-2" />
                New Schedule
              </Button>
            </div>
          )}
          
          {user?.role === "STUDENT" && (
            <Button onClick={() => navigateTo("/CreateLeaveRequest")}>
              <PlusIcon size={16} className="mr-2" />
              Request Leave
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard 
            title="Assignments" 
            description={user?.role === "TEACHER" ? "Your created assignments" : "Pending assignments"}
          >
            {assignments.length > 0 ? (
              <ul className="space-y-2">
                {assignments.slice(0, 5).map((assignment) => (
                  <li key={assignment.id || 'unknown'} className="border-b border-gray-100 pb-2">
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(`/AssignmentDetail/${assignment.id || ''}`);
                      }}
                      className="flex justify-between items-center hover:bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <BookIcon size={16} className="text-app-blue" />
                        <span>{assignment.title || 'Untitled'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No assignments found</p>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => navigateTo("/Assignments")}>
                View All
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Schedules" 
            description="Upcoming class schedules"
          >
            {schedules.length > 0  ? (
              <ul className="space-y-2">
                {schedules.slice(0, 5).map((schedule) => (
                  <li key={schedule.id || 'unknown'} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-app-blue" />
                        <span>{schedule.title || 'Untitled'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {schedule.startTime ? new Date(schedule.startTime).toLocaleString() : 'TBD'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No schedules found</p>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => navigateTo("/Schedules")}>
                View All
              </Button>
            </div>
          </DashboardCard>

          {user?.role === "TEACHER" && (
            <DashboardCard 
              title="Leave Requests" 
              description="Pending student leave requests"
            >
              {leaveRequests.length > 0 ? (
                <ul className="space-y-2">
                  {leaveRequests.slice(0, 5).map((request) => (
                    <li key={request.id || 'unknown'} className="border-b border-gray-100 pb-2">
                      <div 
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => navigateTo(`/LeaveRequests`)}
                      >
                        <div className="flex items-center gap-2">
                          <FileTextIcon size={16} className="text-app-blue" />
                          <span>{request.student?.name || 'Unknown Student'}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No pending leave requests</p>
              )}
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/LeaveRequests")}>
                  View All
                </Button>
              </div>
            </DashboardCard>
          )}

          {user?.role === "STUDENT" && (
            <DashboardCard 
              title="My Submissions" 
              description="Your assignment submissions"
            >
              {submissions.length > 0 ? (
                <ul className="space-y-2">
                  {submissions.slice(0, 5).map((submission) => (
                    <li key={submission.id || 'unknown'} className="border-b border-gray-100 pb-2">
                      <div 
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => navigateTo(`/Assignments`)}
                      >
                        <div className="flex items-center gap-2">
                          <BookIcon size={16} className="text-app-blue" />
                          <span>{submission.assignment?.title || 'Unknown Assignment'}</span>
                        </div>
                        <span className={`text-sm ${submission.grade ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                          {submission.grade ? `Grade: ${submission.grade}` : 'Pending review'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No submissions found</p>
              )}
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/Assignments")}>
                  View Assignments
                </Button>
              </div>
            </DashboardCard>
          )}

          {user?.role === "STUDENT" && (
            <DashboardCard 
              title="My Leave Requests" 
              description="Your leave request status"
            >
              {leaveRequests.length > 0 ? (
                <ul className="space-y-2">
                  {leaveRequests.slice(0, 5).map((request) => (
                    <li key={request.id || 'unknown'} className="border-b border-gray-100 pb-2">
                      <div 
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => navigateTo(`/LeaveRequests`)}
                      >
                        <div className="flex items-center gap-2">
                          <FileTextIcon size={16} className="text-app-blue" />
                          <span>{request.reason ? 
                            (request.reason.substring(0, 30) + (request.reason.length > 30 ? '...' : '')) : 
                            'No reason provided'}</span>
                        </div>
                        <span className={`text-sm font-medium
                          ${request.status === 'APPROVED' ? 'text-green-500' : 
                            request.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {request.status || 'PENDING'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No leave requests found</p>
              )}
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/LeaveRequests")}>
                  View All
                </Button>
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;