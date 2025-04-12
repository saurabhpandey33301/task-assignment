"use client"
import { useState } from "react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/context/AuthContext";
import { createLeaveRequest } from "@/app/lib/mock-data";
import { ArrowLeftIcon } from "lucide-react";
import { redirect } from "next/navigation";

const CreateLeaveRequest = () => {
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim() || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create leave requests",
        variant: "destructive",
      });
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast({
        title: "Error",
        description: "End date must be after or equal to start date",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createLeaveRequest({
        reason,
        startDate: start,
        endDate: end,
        studentId: user.id
      });
      
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      
      redirect("/LeaveRequests");
    } catch (error) {
      console.error("Error creating leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => redirect("/LeaveRequests")}
          className="mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Leave Requests
        </Button>
        
        <div className="bg-white p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Request Leave</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you need leave"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => redirect("/LeaveRequests")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLeaveRequest;
