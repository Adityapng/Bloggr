import TiptapRenderer from "@/components/blog/parseHtmlString";

export type authorObject = {
  username: string;
  authorAvatar: string;
  firstName: string;
  lastName: string;
};

export type Blog = {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  commentCount: number;
  likeCount: number;
  slug: string;

  author: authorObject;

  createdAt: string;
  readingTime: number;
  readCount: number;
};

export const blogParsedContent = (data: string) => {
  const parsedString = JSON.parse(data);
  const stringCont = JSON.stringify(parsedString);

  return <TiptapRenderer content={stringCont} />;
};

export const GetXDaysAgo: React.FC<{ date: string }> = ({ date }) => {
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

export const getInitials = (user: Blog): string => {
  if (!user) {
    return "GU";
  }
  const firstNameInitial = user.author.firstName
    ? user.author.firstName[0]
    : "";
  const lastNameInitial = user.author.lastName ? user.author.lastName[0] : "";
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
};
