"use client";

import { useState, useTransition } from "react";
import { apiFetcher } from "@/lib/apiFetcher";
import { Bookmark as BookmarkIcon } from "lucide-react";
// import { notFound } from "next/navigation";

interface BookmarkProps {
  postId: string;
  initialUserHasBookmarked: boolean;
}

export default function Bookmark({
  postId,
  initialUserHasBookmarked,
}: BookmarkProps) {
  const [userHasBookmarked, setUserHasBookmarked] = useState(
    initialUserHasBookmarked
  );
  const [isPending, startTransition] = useTransition();

  const handleBookmarkClick = () => {
    if (isPending) return;

    setUserHasBookmarked((prev) => !prev);

    startTransition(async () => {
      try {
        const response = await apiFetcher(`/api/posts/${postId}/bookmark`, {
          method: "POST",
        });
        // if (response.status === 404) {
        //   notFound(); // This will immediately stop rendering and show the 404 page
        // }

        const data = await response.json();

        if (!response.ok) {
          setUserHasBookmarked(initialUserHasBookmarked);
          console.error(
            "Bookmark action failed:",
            data.error || "Server error"
          );
          return;
        }

        setUserHasBookmarked(data.userHasBookmarked);
      } catch (error) {
        console.error("Bookmark network request failed:", error);
        setUserHasBookmarked(initialUserHasBookmarked);
      }
    });
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isPending}
      className="cursor-pointer"
      aria-label={
        userHasBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
      }
    >
      <BookmarkIcon
        className={`h-6 w-6 transition-colors ${
          userHasBookmarked
            ? "text-blue-500 fill-blue-500"
            : "text-gray-500 hover:text-blue-400"
        }`}
      />
    </button>
  );
}
