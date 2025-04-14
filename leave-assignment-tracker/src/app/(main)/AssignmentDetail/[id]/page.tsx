"use client"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/context/AuthContext";
import {
  getAssignmentById,
  getSubmissionsByAssignment,
  createSubmission,
  updateSubmission,
} from "@/app/actions/mock-data";
import { Assignment, Submission } from "@/app/types";
import { ArrowLeftIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AssignmentDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<any| null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionContent, setSubmissionContent] = useState("");
  const [studentSubmission, setStudentSubmission] = useState<any | null>(null);
  const [gradeValue, setGradeValue] = useState<{ [key: string]: string }>({});
  const [feedbackValue, setFeedbackValue] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        const [assignmentResult, submissionsResult] = await Promise.all([
          getAssignmentById(id as string),
          getSubmissionsByAssignment(id as string),
        ]);

        if (assignmentResult.success) {
          setAssignment(
            assignmentResult.data
              ? {
                  ...assignmentResult.data,
                  teacher: {
                    ...assignmentResult.data.teacher,
                    email: "",
                    role: "TEACHER",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                }
              : null
          );
        }

        if (submissionsResult.success) {
          const submissionsData = submissionsResult.data;
          setSubmissions(submissionsData || []);

          if (user?.role === "TEACHER") {
            const initialGrades: { [key: string]: string } = {};
            const initialFeedback: { [key: string]: string } = {};

            submissionsData?.forEach((sub) => {
              initialGrades[sub.id] = sub.grade || "";
              initialFeedback[sub.id] = sub.feedback || "";
            });

            setGradeValue(initialGrades);
            setFeedbackValue(initialFeedback);
          } else if (user?.role === "STUDENT") {
            const userSubmission = (submissionsData ?? []).find((sub) => sub.studentId === user.id);
            if (userSubmission) {
              setStudentSubmission(userSubmission);
              setSubmissionContent(userSubmission.content);
            }
          }
        }
      } catch (error) {
        console.error("Error loading assignment:", error);
        toast({
          title: "Error",
          description: "Failed to load assignment details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, user, toast]);

  const handleSubmit = async () => {
    try {
      if (!id || !user || !submissionContent.trim()) {
        toast({
          title: "Error",
          description: "Please provide submission content",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("assignmentId", id as string);
      formData.append("studentId", user.id);
      formData.append("content", submissionContent);

      const result = await createSubmission(formData);

      if (result?.success) {
        toast({
          title: "Success",
          description: "Assignment submitted successfully",
        });
        router.push("/Assignments");
      } else {
        throw new Error(result?.error || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit assignment",
        variant: "destructive",
      });
    }
  };

  const handleGrade = async (submissionId: string) => {
    try {
      const grade = gradeValue[submissionId];
      const feedback = feedbackValue[submissionId];

      if (!grade?.trim()) {
        toast({
          title: "Error",
          description: "Please provide a grade",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("grade", grade);
      formData.append("feedback", feedback || "");

      const result = await updateSubmission(submissionId, formData);

      if (result?.success) {
        toast({
          title: "Success",
          description: "Submission graded successfully",
        });

        const submissionsResult = await getSubmissionsByAssignment(id as string);
        if (submissionsResult.success) {
          setSubmissions(
            (submissionsResult.data || []).map((submission) => ({
              ...submission,
              submittedAt: submission.submissionDate.toISOString(), // Derive submittedAt from submissionDate
            }))
          );
        }
      } else {
        throw new Error(result?.error || "Failed to grade submission");
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to grade submission",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
      </Layout>
    );
  }

  if (!assignment) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-500">Assignment not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/Assignments")}>
            Back to Assignments
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push("/Assignments")} className="mb-4">
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Assignments
        </Button>

        <div className="bg-white p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
          <div className="flex items-center text-gray-500 mb-4">
            <span className="mr-4">Due: {formatDate(assignment.dueDate)}</span>
            {assignment.teacher && <span>Posted by: {assignment.teacher.name}</span>}
          </div>
          <div className="prose max-w-none">
            <p>{assignment.description}</p>
          </div>
        </div>

        {user?.role === "STUDENT" && (
          <div className="bg-white p-6 border rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Submission</h2>

            {studentSubmission ? (
              <div className="space-y-4">
                <div>
                  <Label>Your Work</Label>
                  <div className="mt-1 p-3 border rounded bg-gray-50">{studentSubmission.content}</div>
                </div>

                {studentSubmission.grade && (
                  <div>
                    <Label>Grade</Label>
                    <div className="mt-1 p-3 border rounded bg-gray-50 font-medium">
                      {studentSubmission.grade}
                    </div>
                  </div>
                )}

                {studentSubmission.feedback && (
                  <div>
                    <Label>Feedback</Label>
                    <div className="mt-1 p-3 border rounded bg-gray-50">{studentSubmission.feedback}</div>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Submitted on: {formatDate(studentSubmission.submittedAt)}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="submission">Your Work</Label>
                  <Textarea
                    id="submission"
                    placeholder="Enter link to your work or paste content here"
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    className="mt-1"
                    rows={5}
                  />
                </div>
                <Button onClick={handleSubmit}>Submit Assignment</Button>
              </div>
            )}
          </div>
        )}

        {user?.role === "TEACHER" && (
          <div className="bg-white p-6 border rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>

            {submissions.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Submission</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.student?.name || "Unknown Student"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{submission.content}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell>
                          <Input
                            placeholder="Grade"
                            value={gradeValue[submission.id] || ""}
                            onChange={(e) =>
                              setGradeValue({ ...gradeValue, [submission.id]: e.target.value })
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Feedback"
                            value={feedbackValue[submission.id] || ""}
                            onChange={(e) =>
                              setFeedbackValue({ ...feedbackValue, [submission.id]: e.target.value })
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleGrade(submission.id)}>
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-6 bg-gray-50 border rounded">No submissions yet</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignmentDetail;