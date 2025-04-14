// "use client"
// import { useState } from "react";

// import Layout from "@/components/Layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/components/ui/use-toast";
// import { useAuth } from "@/app/context/AuthContext";
// import { createAssignment } from "@/app/lib/mock-data";
// import { ArrowLeftIcon } from "lucide-react";
// import { redirect } from "next/navigation";


// const CreateAssignment = () => {

//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!title.trim() || !description.trim() || !dueDate) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (!user) {
//       toast({
//         title: "Error",
//         description: "You must be logged in to create assignments",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       await createAssignment({
//         title,
//         description,
//         dueDate: new Date(dueDate),
//         teacherId: user.id
//       });
      
//       toast({
//         title: "Success",
//         description: "Assignment created successfully",
//       });
      
//       redirect("/Assignments");
//     } catch (error) {
//       console.error("Error creating assignment:", error);
//       toast({
//         title: "Error",
//         description: "Failed to create assignment",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-2xl mx-auto">
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => redirect("/Assignments")}
//           className="mb-4"
//         >
//           <ArrowLeftIcon size={16} className="mr-2" />
//           Back to Assignments
//         </Button>
        
//         <div className="bg-white p-6 border rounded-md shadow-sm">
//           <h1 className="text-2xl font-bold mb-6">Create Assignment</h1>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 placeholder="Assignment title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 disabled={isSubmitting}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Provide detailed instructions for the assignment"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 disabled={isSubmitting}
//                 rows={6}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="dueDate">Due Date</Label>
//               <Input
//                 id="dueDate"
//                 type="date"
//                 value={dueDate}
//                 onChange={(e) => setDueDate(e.target.value)}
//                 disabled={isSubmitting}
//               />
//             </div>
            
//             <div className="flex justify-end gap-3">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => redirect("/Assignments")}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Creating..." : "Create Assignment"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateAssignment;





"use client"
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/app/actions/mock-data";

const CreateAssignment = () => {
  const { user } = useAuth();
  
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !dueDate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create assignments");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", new Date(dueDate).toISOString());
      formData.append("teacherId", user.id);

      const result = await createAssignment(formData);
      
      if (result?.success) {
        toast.success("Assignment created successfully");
        router.push("/Assignments");
      } else {
        throw new Error(result?.error || "Failed to create assignment");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast(`${error instanceof Error ? error.message : "Failed to create assignment"}`);
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
          onClick={() => router.push("/Assignments")}
          className="mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Assignments
        </Button>
        
        <div className="bg-white p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Create Assignment</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed instructions for the assignment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/Assignments")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Assignment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAssignment;