import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Blog, blogParsedContent } from "@/lib/BlogFunctionLib";
import { fetcher } from "@/lib/fetcher";
import { Eye } from "lucide-react";

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

  const postData: Blog = await getPostData(slug);

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

  return (
    <div className=" w-full flex justify-center">
      <div className=" w-full lg:w-3/4 sm:w-4/5 max-sm:px-4 max-w-4xl">
        <p className=" font-bold text-5xl">{postData.title}</p>
        <div className=" flex items-center pt-4 justify-between">
          <div className=" flex gap-4 items-center">
            <div className=" flex items-center gap-2">
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
            </div>
            <span>&#11825;</span>
            <div>
              <p className=" text-sm">{postData.readingTime} min read</p>
            </div>
            <span>&#11825;</span>
            <div className="flex items-center gap-1">
              <Eye />
              <p className=" text-sm">{postData.readCount}</p>
            </div>
            <span>&#11825;</span>
            <div>
              <p className=" text-sm">
                <GetXDaysAgo date={postData.createdAt} />{" "}
              </p>
            </div>
          </div>
        </div>
        <br />
        {blogParsedContent(postData.content)}
      </div>
    </div>
  );
}
