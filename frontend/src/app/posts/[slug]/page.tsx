import Bookmark from "@/components/interaction/Bookmark";
import Like from "@/components/interaction/Like";
import ShareButton from "@/components/interaction/Share";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApiResponse, handleLoggedInUserData } from "@/lib/api";
import { Blog, blogParsedContent } from "@/lib/BlogFunctionLib";
import { apiFetcher } from "@/lib/apiFetcher";
import { Eye, Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CommentCount, CommentSection } from "@/components/interaction/Comment";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: { [key: string]: string };
}

export const dynamic = "force-dynamic";

async function getPostData(slug: string) {
  try {
    const response = await apiFetcher(`/api/posts/${slug}`);
    if (response.status === 404) {
      return null; // This will immediately stop rendering and show the 404 page
    }
    if (!response.ok) {
      console.error(
        "SERVER responded with an error:",
        response.status,
        response.statusText
      );
      const errorBody = await response.text();
      console.error(
        "SERVER response body:",
        errorBody.substring(0, 200) + "..."
      );
      throw new Error("Server response was not OK");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  const [postData, currentUser]: [Blog, ApiResponse | null] = await Promise.all(
    [getPostData(slug), handleLoggedInUserData()]
  );

  if (!postData) {
    // It's good practice to show a user-friendly message.
    notFound();
  }
  const initialUserHasLiked = postData.likes.includes(
    currentUser?.user?._id ?? ""
  );

  const initialUserHasBookmarked = postData.bookmarks.includes(
    currentUser?.user?._id ?? ""
  );

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

  const shareText = postData.content.substring(0, 100) + "...";

  const PostInteractions = () => {
    return (
      <div className=" flex justify-between w-full border border-x-0 py-4 items-center">
        <div className=" flex gap-8">
          <div>
            <Like
              postId={postData._id}
              initialLikeCount={postData.likeCount}
              initialUserHasLiked={initialUserHasLiked}
            />
          </div>
          <div>
            <CommentCount count={postData.commentCount} />
          </div>
        </div>
        <div className=" flex gap-8 items-center">
          <div>
            <ShareButton title={postData.title} text={shareText} />
          </div>
          <div className=" flex items-center">
            <Bookmark
              postId={postData._id}
              initialUserHasBookmarked={initialUserHasBookmarked}
            />
          </div>
          <div>
            <Ellipsis />
          </div>
        </div>
      </div>
    );
  };
  console.log(postData.readingTime);

  return (
    <div className=" w-full flex justify-center">
      <div className=" w-full lg:w-3/4 sm:w-4/5 max-sm:px-4 max-w-4xl">
        <p className=" font-bold sm:text-5xl text-2xl ">{postData.title}</p>
        <div className="flex flex-col items-center w-full pt-4 justify-between gap-4">
          <div className=" flex flex-wrap-reverse sm:flex-row gap-4 items-center w-full justify-between">
            <div className=" flex items-center gap-2  ">
              <Avatar className=" size-9 ">
                <AvatarImage
                  className=" select-none"
                  src={postData.author.authorAvatar}
                />
                <AvatarFallback className=" bg-amber-300 text-xs">
                  {getInitials(postData)}
                </AvatarFallback>
              </Avatar>
              <p className=" text-sm" key={postData.author.username}>
                {postData.author.firstName}
              </p>
              <Button variant="outline" className=" ml-2 rounded-full">
                Follow
              </Button>
            </div>
            <div className=" flex  gap-4 items-center">
              <div>
                <p className=" text-sm">{postData.readingTime} min read</p>
              </div>
              <div className="flex items-center gap-1">
                <Eye />
                <p className=" text-sm">{postData.readCount}</p>
              </div>
              <div>
                <p className=" text-sm">
                  {formatCommentDate(postData.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <PostInteractions />
        </div>
        <br />
        <div>{blogParsedContent(postData.content)}</div>
        <br />
        <div className=" py-4">
          <p className=" text-xl">Tags</p>
        </div>
        <div className=" flex flex-wrap gap-1">
          {postData.tags &&
            Array.isArray(postData.tags) &&
            postData.tags.map((tag) => (
              <div className="flex items-center" key={`${tag}-selected-tag`}>
                <Badge asChild className=" py-1 px-2">
                  <Link href={`/tags/${tag.slug}`} key={tag._id}>
                    {tag.name}
                  </Link>
                </Badge>
              </div>
            ))}
        </div>
        <br />
        <div>
          <PostInteractions />
        </div>
        <div className=" py-6">
          <CommentSection
            count={postData.commentCount}
            postid={postData._id}
            limit={5}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}
