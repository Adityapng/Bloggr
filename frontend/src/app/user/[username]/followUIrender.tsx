"use client";
import { Button } from "@/components/ui/button";
import { apiFetcher } from "@/lib/apiFetcher";
import { followUser, unfollowUser } from "@/lib/follow";
import { useEffect, useState, useTransition } from "react";

interface RenderFollowUIProp {
  // followState: boolean;
  targetUserId: string;
}

export function FollowButton({
  // followState,
  targetUserId,
}: RenderFollowUIProp) {
  const [follow, setFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Make sure we have the author's ID before fetching
    if (!targetUserId) return;

    const fetchFollowState = async () => {
      setIsLoading(true);
      try {
        // ✅ FIX 2: Ensure this URL matches your backend route structure EXACTLY.
        // It should be /api/users/:targetId/checkFollowStatus
        const response = await apiFetcher(
          `/api/users/${targetUserId}/checkFollowStatus`
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
  }, [targetUserId]);

  const followController = async () => {
    if (isPending) return;
    console.log("clicked");

    startTransition(async () => {
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

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Button className="rounded-full" disabled>
          ...
        </Button>
      ) : (
        <Button
          variant={follow ? "outline" : "default"}
          className="rounded-full "
          onClick={followController}
          disabled={isLoading}
        >
          <span className=" ">
            {isLoading ? "..." : follow ? "Unfollow" : "Follow"}
          </span>
        </Button>
      )}
    </div>
  );
}
