"use client";

import { useCallback } from "react";

import { CommentCount } from "@/components/interaction/Comment";
import Like from "@/components/interaction/Like";
import ShareButton from "@/components/interaction/Share";
import Bookmark from "@/components/interaction/Bookmark";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface PostInteractionsClientProps {
  onScrollToComments: () => void;
  initialUserHasLiked: boolean;
  initialUserHasBookmarked: boolean;
  likeCount: number;
  commentCount: number;
  postId: string;
  postSlug: string;
  shareTitle: string;
  shareText: string;
}

interface ScrollWrapperProps {
  postId: string;
  postSlug: string;
  initialUserHasLiked: boolean;
  initialUserHasBookmarked: boolean;
  likeCount: number;
  commentCount: number;
  shareTitle: string;
  shareText: string;
}

function PostInteractionsClient({
  onScrollToComments,
  initialUserHasLiked,
  initialUserHasBookmarked,
  likeCount,
  commentCount,
  postId,
  postSlug,
  shareTitle,
  shareText,
}: PostInteractionsClientProps) {
  return (
    <div className=" flex justify-between w-full border border-x-0 py-4 items-center">
      <div className=" flex gap-8">
        <Like
          postId={postId}
          initialLikeCount={likeCount}
          initialUserHasLiked={initialUserHasLiked}
        />
        <div onClick={onScrollToComments} className="cursor-pointer">
          <CommentCount count={commentCount} />
        </div>
      </div>
      <div className=" flex gap-8 items-center">
        <ShareButton title={shareTitle} text={shareText} />
        <Bookmark
          postId={postId}
          initialUserHasBookmarked={initialUserHasBookmarked}
        />
        <Button variant="ghost" title="Edit Post" asChild>
          <Link href={`/posts/${postSlug}/edit`}>
            <Pencil />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ScrollWrapper(props: ScrollWrapperProps) {
  const scrollToComments = useCallback(() => {
    const section = document.getElementById("comment-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <PostInteractionsClient {...props} onScrollToComments={scrollToComments} />
  );
}
