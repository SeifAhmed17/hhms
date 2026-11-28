import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LANDING, useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const { user, ready } = useAuth();
  if (!ready)
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate to={user.mustChangePassword ? "/change-password" : LANDING[user.role]} replace />
  );
}
