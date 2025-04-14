
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useAuth } from "@/app/context/AuthContext";
import { createLeaveRequest } from "@/app/actions/mock-data"; // Updated import
import { ArrowLeftIcon } from "lucide-react";

const CreateLeaveRequest = () => {
  const router = useRouter();
  const { user } = useAuth();
 
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim() || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create leave requests");
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast.error("End date must be after or equal to start date");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("startDate", start.toISOString());
      formData.append("endDate", end.toISOString());
      formData.append("studentId", user.id);

      const response = await createLeaveRequest(formData);
      
      if (response.success) {
        toast.success("Leave request submitted successfully");
        
        router.push("/LeaveRequests");
      } else {
        toast.error(`${response.error || "Failed to submit leave request"}`);
      }
    } catch (error) {
      console.error("Error creating leave request:", error);
      toast.error("Failed to submit leave request");
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
          onClick={() => router.push("/LeaveRequests")}
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
                onClick={() => router.push("/LeaveRequests")}
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