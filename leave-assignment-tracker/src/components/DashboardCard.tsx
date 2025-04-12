
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/app/lib/utils"

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard = ({
  title,
  description,
  children,
  className,
}: DashboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gray-50">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
