import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { useAuth, LANDING } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function NotAllowed() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <ShieldX className="mx-auto size-10 text-muted-foreground" aria-hidden />
        <h1 className="mt-4 text-2xl">Not allowed</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have access to this page.</p>
        <Button asChild className="mt-6">
          <Link to={user ? LANDING[user.role] : "/login"}>Go to my start page</Link>
        </Button>
      </div>
    </div>
  );
}
