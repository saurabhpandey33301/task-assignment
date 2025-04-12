"use client"
import { Button } from "@/components/ui/button";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const Index = () => {
 
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      redirect("/Dashboard");
    }
  }, [user, isLoading]);

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-3xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-red-400  mb-6" >Leave & Assignment Tracker</h1>
        <p className="text-lg text-gray-600 mb-8">
          A platform for teachers and students to manage assignments, schedules, and leave requests efficiently.
        </p>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-black">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-2 text-left list-disc list-inside">
              <li>Role-based authentication for teachers and students</li>
              <li>Assignment creation and submission</li>
              <li>Class scheduling system</li>
              <li>Leave request management</li>
              <li>Secure and responsive interface</li>
            </ul>
          </div>
          <Button className="text-black border-2 border-gray-400 hover:bg-gray-200 hover:border-black" size="lg" onClick={() => redirect("/Login")}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
