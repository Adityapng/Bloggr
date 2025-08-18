"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        // 'credentials: include' is ESSENTIAL for sending the httpOnly cookie
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
      alert("Could not connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className=""
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoading}
      size="sm"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
