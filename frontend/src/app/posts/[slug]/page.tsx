import Bookmark from "@/components/interaction/Bookmark";
import Like from "@/components/interaction/Like";
import ShareButton from "@/components/interaction/Share";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApiResponse, handleLoggedInUserData } from "@/lib/api";
import { Blog, blogParsedContent } from "@/lib/BlogFunctionLib";
import { fetcher } from "@/lib/fetcher";
import { Eye, Ellipsis } from "lucide-react";

import { CommentCount, CommentSection } from "@/components/interaction/Comment";

interface PageProps {
  params: { [key: string]: string };
}

export const dynamic = "force-dynamic";

async function getPostData(slug: string) {
  try {
    const response = await fetcher(`/api/posts/${slug}`);
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
    /* ... not found ... */
  }
  const initialUserHasLiked = postData.likes.includes(
    currentUser?.user?._id ?? ""
  );

  const initialUserHasBookmarked = postData.bookmarks.includes(
    currentUser?.user?._id ?? ""
  );

  // console.log(postData._id);
  // console.log(postData.likeCount);
  // console.log(initialUserHasLiked);

  const GetXDaysAgo: React.FC<{ date: string }> = ({ date }) => {
    const getDaysAgo = (dateString: string) => {
      const dateObj = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - dateObj.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    };
    return <span>{getDaysAgo(date)}</span>;
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
                  <GetXDaysAgo date={postData.createdAt} />{" "}
                </p>
              </div>
            </div>
          </div>
          <PostInteractions />
        </div>
        <br />
        <div>{blogParsedContent(postData.content)}</div>
        <br />
        <div>
          <PostInteractions />
        </div>
        <div>
          <CommentSection count={postData.commentCount} />
        </div>
      </div>
    </div>
  );
}
