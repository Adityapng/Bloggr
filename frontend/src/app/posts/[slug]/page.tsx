import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Blog, blogParsedContent } from "@/lib/BlogFunctionLib";

interface PageProps {
  params: { [key: string]: string };
}

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const finalURL = `${apiUrl}/api/posts/${slug}`;

  const response = await fetch(finalURL);

  if (!response.ok) {
    console.error(
      "SERVER responded with an error:",
      response.status,
      response.statusText
    );
    const errorBody = await response.text();
    console.error("SERVER response body:", errorBody.substring(0, 200) + "...");
    throw new Error("Server response was not OK");
  }

  const postData: Blog = await response.json();

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
          <div className=" flex gap-4">
            <div className=" flex items-center gap-2">
              <Avatar className=" size-5 ">
                <AvatarImage
                  className=" select-none"
                  src={postData.author.authorAvatar}
                />
                <AvatarFallback className=" bg-amber-300 text-xs">
                  {getInitials(postData)}
                </AvatarFallback>
              </Avatar>
              <p className=" text-sm" key={postData.author.username}>
                {postData.author.username}
              </p>
            </div>

            <p className=" text-sm">{postData.readingTime} min read</p>

            {/* <p className=" text-sm">{postData.reads}</p>s */}
          </div>
          <div>
            <p className=" text-sm">
              <GetXDaysAgo date={postData.createdAt} />{" "}
            </p>
          </div>
        </div>
        <br />
        {blogParsedContent(postData.content)}
      </div>
    </div>
  );
}
