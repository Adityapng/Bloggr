"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiFetcher } from "@/lib/apiFetcher";
import { Blog } from "@/lib/BlogFunctionLib";
import { followUser, unfollowUser } from "@/lib/follow";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

interface RenderFollowUIProp {
  // followState: boolean;
  targetUserId: string;
  postData: Blog;
}

export function RenderFollowUI({
  // followState,
  targetUserId,
  postData,
}: RenderFollowUIProp) {
  const [follow, setFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Make sure we have the author's ID before fetching
    if (!postData?.author?._id) return;

    const fetchFollowState = async () => {
      setIsLoading(true);
      try {
        // ✅ FIX 2: Ensure this URL matches your backend route structure EXACTLY.
        // It should be /api/users/:targetId/checkFollowStatus
        const response = await apiFetcher(
          `/api/users/${postData.author._id}/checkFollowStatus`
        );

        if (!response.ok) {
          // If the request fails, we can assume the user is not following.
          setFollow(false);
          throw new Error("Failed to fetch follow status");
        }

        const dataResponse = await response.json();
        setFollow(dataResponse.isFollowing);
      } catch (error) {
        console.error("Failed to fetch follow state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowState();
    // ✅ This dependency array is crucial to prevent infinite loops
  }, [postData?.author?._id]);

  const followController = async () => {
    if (isPending) return;
    console.log("clicked");

    startTransition(async () => {
      // ✅ THE FIX: The entire logic is now inside the transition.
      // We perform the optimistic update first.
      const newFollowState = !follow;
      setFollow(newFollowState);

      try {
        // Now, perform the API call based on the NEW state.
        if (newFollowState) {
          await followUser(targetUserId);
        } else {
          await unfollowUser(targetUserId);
        }
      } catch (error) {
        console.error("Follow/Unfollow action failed:", error);
        // If the API fails, roll back to the original state.
        setFollow(!newFollowState);
      }
    });
  };

  const getInitials = (user: Blog): string => {
    if (!user) {
      return "GU";
    }
    const firstNameInitial = user.author.firstName
      ? user.author.firstName[0]
      : "";
    const lastNameInitial = user.author.lastName ? user.author.lastName[0] : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  if (isLoading) {
    // Render a disabled or placeholder button while we check the follow status
    return (
      <div className="flex items-center gap-2">
        <Link href={`/user/${postData.author.username}`}>
          <div className=" flex items-center gap-2 rounded-full ">
            <Avatar className=" size-9 ">
              <AvatarImage
                className=" select-none"
                src={postData.author.authorAvatar}
              />
              <AvatarFallback className=" bg-amber-300 text-xs">
                {getInitials(postData)}
              </AvatarFallback>
            </Avatar>
            <p className=" text-sm pr-2" key={postData.author.username}>
              {postData.author.username}
            </p>
          </div>
        </Link>
        <Button variant="outline" className="ml-2 rounded-full" disabled>
          ...
        </Button>
      </div>
    );
  }

  return (
    <div className=" flex items-center gap-2  ">
      <Link href={`/user/${postData.author.username}`}>
        <div className=" flex items-center gap-2 rounded-full ">
          <Avatar className=" size-9 ">
            <AvatarImage
              className=" select-none"
              src={postData.author.authorAvatar}
            />
            <AvatarFallback className=" bg-amber-300 text-xs">
              {getInitials(postData)}
            </AvatarFallback>
          </Avatar>
          <p className=" text-sm pr-2" key={postData.author.username}>
            {postData.author.username}
          </p>
        </div>
      </Link>
      <Button
        variant="outline"
        className=" ml-2 rounded-full"
        onClick={followController}
        disabled={isLoading}
      >
        {isLoading ? "..." : follow ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}
