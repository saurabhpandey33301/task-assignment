"use client"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { getSchedules, getSchedulesByTeacher } from "@/app/lib/mock-data";
import { Schedule } from "@/app/types";
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


const Schedules = () => {
  const { user } = useAuth();
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === "TEACHER") {
          const teacherSchedules = await getSchedulesByTeacher(user.id);
          setSchedules(teacherSchedules);
        } else {
          const allSchedules = await getSchedules();
          setSchedules(allSchedules);
        }
      } catch (error) {
        console.error("Error loading schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString();
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
          <h1 className="text-2xl font-bold">Class Schedules</h1>
          
          {user?.role === "TEACHER" && (
            <Button onClick={() => redirect("/CreateSchedule")}>
              <PlusIcon size={16} className="mr-2" />
              New Schedule
            </Button>
          )}
        </div>

        {schedules.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  {user?.role === "STUDENT" && <TableHead>Teacher</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.title}</TableCell>
                    <TableCell className="max-w-sm truncate">{schedule.description}</TableCell>
                    <TableCell>{formatDateTime(schedule.startTime)}</TableCell>
                    <TableCell>{formatDateTime(schedule.endTime)}</TableCell>
                    {user?.role === "STUDENT" && schedule.teacher && (
                      <TableCell>{schedule.teacher.name}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md bg-gray-50">
            <p className="text-gray-500">No schedules found</p>
            {user?.role === "TEACHER" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => redirect("/Schedules/create")}
              >
                Create your first schedule
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Schedules;
