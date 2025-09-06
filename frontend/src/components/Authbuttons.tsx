"use client"; // This directive is crucial for this component

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex items-center md:gap-4 gap-1">
      <Button onClick={() => router.push("/auth/signup")}>Get started</Button>
      <Button variant="outline" onClick={() => router.push("/auth/signin")}>
        Sign In
      </Button>
    </div>
  );
}
