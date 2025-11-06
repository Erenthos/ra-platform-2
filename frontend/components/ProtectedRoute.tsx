"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "../lib/auth";

interface ProtectedRouteProps {
  allowedRoles?: ("BUYER" | "SUPPLIER")[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = Auth.getUser();
    const token = Auth.getToken();

    if (!user || !token) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Role not allowed → logout and redirect
      Auth.clear();
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [allowedRoles, router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}

