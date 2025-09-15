"use client";

import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { apiFetcher } from "@/lib/apiFetcher";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { ApiResponse } from "@/lib/api";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import EmojiPopover from "./EmojiPopover";
import { Spinner } from "../ui/spinner";
// import { notFound } from "next/navigation";

interface CommentCountProps {
  count: number;
}

interface CommentFetchProps {
  id?: string;
  count: number;
  postid: string;
  limit: number;
  currentUser: ApiResponse | null;
}

interface FetchedCommentAuthor {
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

interface LikeProps {
  commentId: string;
  initialLikeCount: number;
  initialUserHasLiked: boolean;
}

export interface FetchedCommentData {
  _id: string;
  likeCount: number;

  likes: string[];
  content: string;
  author: FetchedCommentAuthor;
  createdAt: string;
}

interface ExpandableTextareaProps {
  id?: string;
  placeholder?: string;
  collapsedHeight?: number;
  expandedHeight?: number;
  className?: string;
  onSubmit?: (value: string) => Promise<void> | void;
}

function Like({ commentId, initialLikeCount, initialUserHasLiked }: LikeProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);

  const [isPending, startTransition] = useTransition();

  const handleLikeClick = async () => {
    if (isPending) return;

    setUserHasLiked((prev) => !prev);
    setLikeCount((prev) => (userHasLiked ? prev - 1 : prev + 1));

    startTransition(async () => {
      try {
        const path = `/api/posts/comment/${commentId}/like`;
        const options = {
          method: "POST",
        };
        const response = await apiFetcher(path, options);
        // if (response.status === 404) {
        //   notFound(); // This will immediately stop rendering and show the 404 page
        // }
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
    <div className="flex items-center">
      <button
        onClick={handleLikeClick}
        disabled={isPending}
        className="flex flex-col items-center cursor-pointer"
      >
        <Heart
          className={`transition-colors h-5 w-5 ${
            userHasLiked
              ? "text-red-500 fill-red-500"
              : "text-white hover:text-red-400"
          }`}
        />
        <span className="font-medium text-xs">{likeCount}</span>
      </button>
    </div>
  );
}

export function CommentCount({ count }: CommentCountProps) {
  return (
    <div className=" flex items-center gap-2 cursor-pointer ">
      <MessageCircle />
      <span className="font-medium text-sm">{count}</span>
    </div>
  );
}

// TODO continue with comment section
// TODO automatically add comments like to the new comment
const ExpandableTextarea: React.FC<ExpandableTextareaProps> = ({
  id = "expandable-textarea",
  placeholder = "Add a comment",
  // collapsedHeight = 36,
  // expandedHeight = 128,
  className,
  onSubmit,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    setExpanded(false);
    setValue(""); // Clear the text when canceling
  };

  const handleSend = async () => {
    if (!value.trim()) return;

    if (!onSubmit) {
      setExpanded(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(value);
      setValue("");
      setExpanded(false);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelection = (emoji: string) => {
    // Append the emoji to the current comment text
    setValue((prevText) => prevText + emoji);
  };

  return (
    <div className={cn("w-full max-w-xl", className, "")}>
      <div className="rounded-md border-2 dark:bg-input/30">
        <div className=" flex">
          <Textarea
            id={id}
            aria-expanded={expanded}
            onClick={() => setExpanded(true)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting}
            // style={{ height: expanded ? expandedHeight : collapsedHeight }}
            className={cn(
              "resize-none overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-h-9",
              " transition-all duration-500 ease-in-out",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none focus:border-transparent border-0",
              "resize-none overflow-hidden textarea-transition",
              expanded ? "textarea-expanded" : "textarea-collapsed"
            )}
          />
          <EmojiPopover onEmojiSelect={handleEmojiSelection} />
        </div>
        {expanded && (
          <div className="my-2 mr-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSend} disabled={isSubmitting}>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main CommentSection component
export function CommentSection({
  id = "expandable-textarea",
  count,
  postid,
  limit,
  currentUser,
}: CommentFetchProps) {
  const [fetchedCommentData, setFetchedCommentData] = useState<
    FetchedCommentData[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postid) return;

    async function getCommentsData() {
      setIsFetching(true);
      try {
        const response = await apiFetcher(
          `/api/posts/comment/${postid}/?limit=${limit}`
        );
        // if (response.status === 404) {
        //   notFound(); // This will immediately stop rendering and show the 404 page
        // }
        if (!response.ok) {
          console.error("Failed to fetch comments:", await response.text());
          setFetchedCommentData([]);
          return;
        }

        const commentResponse = await response.json();
        if (Array.isArray(commentResponse)) {
          setFetchedCommentData(commentResponse);
        } else {
          console.warn(
            "API did not return an array for comments, setting to empty.",
            commentResponse
          );
          setFetchedCommentData([]);
        }
      } catch (error) {
        console.error("Error fetching comments data:", error);
        setFetchedCommentData([]);
      } finally {
        setIsFetching(false);
      }
    }

    getCommentsData();
  }, [postid, limit]);

  const handlePublishComment = async (comment: string) => {
    if (!comment.trim()) return;

    setError(null);
    try {
      const path = `/api/posts/${postid}/comment`;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      };
      const response = await apiFetcher(path, options);
      // if (response.status === 404) {
      //   notFound(); // This will immediately stop rendering and show the 404 page
      // }
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create comment.");
      }

      setFetchedCommentData((prevComments) => [data, ...prevComments]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error creating comment:", err.message);
      } else {
        setError("An unknown error occurred.");
      }
      throw err; // Re-throw so ExpandableTextarea can handle the error state
    }
  };

  function formatCommentDate(createdAt: string | Date): string {
    const date = new Date(createdAt);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

    if (diffSeconds < 60) {
      return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }
    if (diffHours < 24 && diffDays === 0) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    if (diffDays === 1) {
      return "Yesterday";
    }

    return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const getInitials = (data: FetchedCommentData): string => {
    const author = data.author;
    if (author.firstName && author.lastName) {
      return `${author.firstName.charAt(0)}${author.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return author.username.substring(0, 2).toUpperCase();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center">
        <div className={cn("w-full max-w-xl")}>
          <div className="pb-6 sm:text-2xl text-xl">
            <span>Comments {`(${count})`}</span>
          </div>

          {/* Use the new ExpandableTextarea component */}
          <ExpandableTextarea
            id={id}
            placeholder="Add a comment"
            onSubmit={handlePublishComment}
            className="mb-4"
          />

          {error && (
            <div className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-2">
              {error}
            </div>
          )}

          <div>
            {isFetching ? (
              <div className=" w-full h-full flex items-center justify-center">
                <Spinner className="mr-2 h-12 w-12" />
              </div>
            ) : (
              <div>
                {fetchedCommentData.map((data, index) => {
                  const author = data?.author;
                  if (!author) return null;
                  const initialUserHasLiked = fetchedCommentData[
                    index
                  ].likes.includes(currentUser?.user?._id ?? "");

                  return (
                    <div key={data._id || index} className="my-4 flex">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-9">
                            <AvatarImage
                              className="select-none"
                              src={author.avatarUrl}
                            />
                            <AvatarFallback className="bg-amber-300 text-xs">
                              {getInitials(data)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-semibold text-gray-100">
                            {author.username}
                          </p>
                          <p className="text-xs text-gray-50/50">
                            {formatCommentDate(data.createdAt)}
                          </p>
                        </div>
                        <div className="pl-11 text-md">
                          <p>{data.content}</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center"
                        onClick={() => console.log("like clicked")}
                      >
                        <Like
                          commentId={data._id}
                          initialLikeCount={data.likeCount}
                          initialUserHasLiked={initialUserHasLiked}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
