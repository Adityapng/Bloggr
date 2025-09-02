"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Settings, SquarePen } from "lucide-react";

export function GoToProfile() {
  const router = useRouter();

  const getProfile = () => {
    router.push("/");
  };
  return (
    <Button className="" variant="ghost" onClick={getProfile} size="sm">
      <User className="mr-2 h-4 w-4" />
      Account
    </Button>
  );
}

export function GoToSettings() {
  const router = useRouter();

  const getSettings = () => {
    router.push("/");
  };
  return (
    <Button className="" variant="ghost" onClick={getSettings} size="sm">
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </Button>
  );
}

export function GoToCreatePost() {
  const router = useRouter();

  const getCreatePost = () => {
    router.push("/write");
  };
  return (
    <Button
      className=" dark:bg-transparent dark:text-white border dark:border-zinc-600 border-zinc-200 bg-white text-black"
      onClick={getCreatePost}
      size="sm"
    >
      <SquarePen />
      <span>Write</span>
    </Button>
  );
}
