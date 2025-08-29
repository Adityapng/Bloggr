"use client";

import { fetcher } from "@/lib/fetcher";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";

interface LikeProps {
  postId: string;
  initialLikeCount: number;
  initialUserHasLiked: boolean;
}

export default function Like({
  postId,
  initialLikeCount,
  initialUserHasLiked,
}: LikeProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);

  const [isPending, startTransition] = useTransition();

  const handleLikeClick = async () => {
    if (isPending) return;

    setUserHasLiked((prev) => !prev);
    setLikeCount((prev) => (userHasLiked ? prev - 1 : prev + 1));

    startTransition(async () => {
      try {
        const response = await fetcher(`/api/posts/${postId}/like`, {
          method: "POST",
        });

        if (!response.ok) {
          setUserHasLiked(initialUserHasLiked);
          setLikeCount(initialLikeCount);
          console.error("Like action failed on the server.");
          return;
        }

        const data = await response.json();
        setLikeCount(data.likeCount);
        setUserHasLiked(data.userHasLiked);
      } catch (error) {
        console.error("Like action failed:", error);
        setUserHasLiked(initialUserHasLiked);
        setLikeCount(initialLikeCount);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLikeClick}
        disabled={isPending}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Heart
          className={`transition-colors ${
            userHasLiked
              ? "text-red-500 fill-red-500"
              : "text-white hover:text-red-400"
          }`}
        />
        <span className="font-medium text-sm">{likeCount}</span>
      </button>
    </div>
  );
}
