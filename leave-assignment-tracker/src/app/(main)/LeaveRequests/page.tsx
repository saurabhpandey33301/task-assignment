"use client"
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { getLeaveRequests, getLeaveRequestsByStudent, updateLeaveRequest } from "@/app/lib/mock-data";
import { LeaveRequest } from "@/app/types";
import { PlusIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";

const LeaveRequests = () => {
  const { user } = useAuth();

  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === "TEACHER") {
          const allRequests = await getLeaveRequests();
          setLeaveRequests(allRequests);
        } else if (user?.role === "STUDENT") {
          const studentRequests = await getLeaveRequestsByStudent(user.id);
          setLeaveRequests(studentRequests);
        }
      } catch (error) {
        console.error("Error loading leave requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await updateLeaveRequest(id, { status });
      
      toast({
        title: "Success",
        description: `Leave request ${status.toLowerCase()}`,
      });
      
      // Update the local state
      setLeaveRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error("Error updating leave request:", error);
      toast({
        title: "Error",
        description: "Failed to update leave request",
        variant: "destructive",
      });
    }
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
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          
          {user?.role === "STUDENT" && (
            <Button onClick={() => redirect("/CreateLeaveRequest")}>
              <PlusIcon size={16} className="mr-2" />
              New Leave Request
            </Button>
          )}
        </div>

        {leaveRequests.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {user?.role === "TEACHER" && <TableHead>Student</TableHead>}
                  <TableHead>Reason</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  {user?.role === "TEACHER" && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    {user?.role === "TEACHER" && request.student && (
                      <TableCell className="font-medium">{request.student.name}</TableCell>
                    )}
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{formatDate(request.startDate)}</TableCell>
                    <TableCell>{formatDate(request.endDate)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full
                        ${request.status === "APPROVED" ? "bg-green-100 text-green-800" : 
                          request.status === "REJECTED" ? "bg-red-100 text-red-800" : 
                          "bg-yellow-100 text-yellow-800"}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    
                    {user?.role === "TEACHER" && request.status === "PENDING" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                            onClick={() => handleUpdateStatus(request.id, "APPROVED")}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    
                    {user?.role === "TEACHER" && request.status !== "PENDING" && (
                      <TableCell className="text-right">
                        <span className="text-sm text-gray-500">No action needed</span>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md bg-gray-50">
            <p className="text-gray-500">No leave requests found</p>
            {user?.role === "STUDENT" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => redirect("/CreateLeaveRequest")}
              >
                Create your first leave request
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveRequests;
