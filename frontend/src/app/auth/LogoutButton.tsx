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
      const response = await fetch(`/api/auth/logout`, {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      // ...
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="mr-1 h-4 w-4" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
