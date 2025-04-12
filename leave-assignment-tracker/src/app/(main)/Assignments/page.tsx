"use client"
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { getAssignments, getAssignmentsByTeacher, getSubmissionsByStudent } from "@/app/lib/mock-data";
import { Assignment, Submission } from "@/app/types";
import { PlusIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirect } from "next/navigation";

const Assignments = () => {
  const { user } = useAuth();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === "TEACHER") {
          const teacherAssignments = await getAssignmentsByTeacher(user.id);
          setAssignments(teacherAssignments);
        } else if (user?.role === "STUDENT") {
          const [allAssignments, studentSubmissions] = await Promise.all([
            getAssignments(),
            getSubmissionsByStudent(user.id)
          ]);
          setAssignments(allAssignments);
          setSubmissions(studentSubmissions);
        }
      } catch (error) {
        console.error("Error loading assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const isSubmitted = (assignmentId: string) => {
    return submissions.some(sub => sub.assignmentId === assignmentId);
  };

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = submissions.find(sub => sub.assignmentId === assignmentId);
    if (!submission) return "Not Submitted";
    if (submission.grade) return `Graded: ${submission.grade}`;
    return "Submitted";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assignments</h1>
          
          {user?.role === "TEACHER" && (
            <Button onClick={() => redirect("/CreateAssignment")}>
              <PlusIcon size={16} className="mr-2" />
              New Assignment
            </Button>
          )}
        </div>

        {assignments.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                  {user?.role === "STUDENT" && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell className="max-w-sm truncate">{assignment.description}</TableCell>
                    <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                    
                    {user?.role === "STUDENT" && (
                      <TableCell>
                        <span className={`text-sm px-2 py-1 rounded-full
                          ${isSubmitted(assignment.id) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {getSubmissionStatus(assignment.id)}
                        </span>
                      </TableCell>
                    )}
                    
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => redirect(`/AssignmentDetail/${assignment.id}`)}
                      >
                        {user?.role === "TEACHER" ? "View Details" : "View & Submit"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md bg-gray-50">
            <p className="text-gray-500">No assignments found</p>
            {user?.role === "TEACHER" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => redirect("/CreateAssignment")}
              >
                Create your first assignment
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assignments;
