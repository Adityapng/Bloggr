import { notFound } from "next/navigation";
import { apiFetcher } from "@/lib/apiFetcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
// import UserPost from "../[username]/FetchPost";
import { Box, Tabs, Text } from "@radix-ui/themes";
import EditProfile from "./editProfile";
import { Link2 } from "lucide-react";
import {
  UserBookmarkedPost,
  UserLikedPost,
  UserPost,
} from "../[username]/FetchPost";

interface ReadMoreProps {
  children: string;
  maxLength?: number;
  className?: string;
}

interface IGLinkProps {
  iglink: string;
}
interface TWLinkProps {
  twlink: string;
}
interface ExternalLinkProp {
  externalLink: string;
}

// interface PageProps {
//   params: { [key: string]: string };
// }

export interface FetchedData {
  _id: string;
  username: string;
  avatarURL: string;
  profilePicturePublicID: string;
  bio: string;
  fullName: string;
  firstName: string;
  lastName: string;
  followerCount: number;
  followingCount: number;
  totalReads: number;
  instagramLink: string;
  twitterLink: string;
  externalLinks: string[];
  about: string;
}

const mockdata = {
  _id: "65fa8def91348f349619b563",
  username: "johndoe",
  avatarURL: "https://example.com/avatars/johndoe.jpg",
  bio: "Developer and open source enthusiast.",
  fullName: "John Doe",
  firstName: "John",
  lastName: "Doe",
  followerCount: 150,
  followingCount: 75,
  totalReads: 1200,
  instagramLink: "https://instagram.com/johndoe",
  twitterLink: "https://twitter.com/johndoe",
  externalLinks: ["https://github.com/johndoe", "https://johndoe.com"],
  about: "Building web apps with MongoDB for fun and impact.",
  profilePicturePublicID: "profilepic_65fa8def91348f349619b563",
};

const getInitials = (user: FetchedData): string => {
  if (!user) {
    return "GU";
  }
  const firstNameInitial = user.firstName ? user.firstName[0] : "";
  const lastNameInitial = user.lastName ? user.lastName[0] : "";
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
};

const fetchUserProfileData = async (): Promise<FetchedData | null> => {
  const path = `/api/users/me`;
  try {
    const response = await apiFetcher(path);
    if (response.status === 404) {
      return null;
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
    return mockdata;
  }
};

function ReadMore({ children, maxLength = 150, className }: ReadMoreProps) {
  const shouldTruncate = children.length > maxLength;
  const truncatedText = shouldTruncate
    ? children.slice(0, maxLength) + "..."
    : children;

  if (!shouldTruncate) {
    return <p className={cn("text-foreground", className)}>{children}</p>;
  }

  return (
    <details className={cn("group", className)}>
      <summary className="cursor-pointer list-none">
        <span className="text-foreground group-open:hidden">
          {truncatedText}
        </span>
        <span className="text-foreground hidden group-open:inline">
          {children}
        </span>
        <span className="ml-2 text-primary hover:text-primary/80 font-medium group-open:hidden">
          Read more
        </span>
        <span className="hidden group-open:inline ml-2 text-primary hover:text-primary/80 font-medium">
          Read less
        </span>
      </summary>
    </details>
  );
}

export const dynamic = "force-dynamic";

const Page = async () => {
  const fetchedUserData = await fetchUserProfileData();
  if (!fetchedUserData) {
    notFound();
  }
  const validExternalLinks =
    fetchedUserData.externalLinks?.filter(Boolean) || [];
  const hasOneLink = validExternalLinks.length === 1;
  const hasMultipleLinks = validExternalLinks.length > 1;

  function Instagram({ iglink }: IGLinkProps) {
    return (
      <Button asChild className="rounded-full flex items-center gap-2">
        <Link href={iglink} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-instagram"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
          </svg>
          Instagram
        </Link>
      </Button>
    );
  }

  function Twitter({ twlink }: TWLinkProps) {
    return (
      <Button asChild className=" rounded-full flex gap2">
        <Link href={twlink} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-twitter-x"
            viewBox="0 0 16 16"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
          </svg>
          Twitter
        </Link>
      </Button>
    );
  }

  function extractDomainName(link: string): string | null {
    if (!link || typeof link !== "string" || !link.startsWith("http")) {
      return "Invalid Link"; // Return a user-friendly string
    }
    try {
      const url = new URL(link);
      const hostname = url.hostname; // e.g., "www.example.com"
      const parts = hostname.split(".");

      // Handle cases like "example.com", "www.example.com", "sub.domain.example.com"
      if (parts.length >= 2) {
        return parts[parts.length - 2]; // "example"
      }

      return null;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }

  function ExternalLink({ externalLink }: ExternalLinkProp) {
    return (
      <Link
        href={externalLink}
        target="_blank"
        // className=" justify-start flex bg-white items-center dark:text-black text-sm gap-4 font-medium p-2"
        className="bg-primary px-3.5 w-full py-2 rounded-full text-primary-foreground shadow-xs hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
      >
        <div className=" -rotate-45 size-4">
          <Link2 />
        </div>
        {extractDomainName(externalLink)}
      </Link>
      // </DropdownMenuItem>
    );
  }

  return (
    <div className=" w-full flex justify-center">
      <div className=" w-full lg:w-3/4 sm:w-4/5 max-sm:p-4 max-w-5xl p-16">
        <div className=" w-full flex sm:justify-between max-sm:gap-2">
          <div className=" w-1/4">
            <div className=" rounded-full size-64">
              <Avatar className=" md:size-64 size-24 ">
                <AvatarImage
                  className=" select-none"
                  src={fetchedUserData.avatarURL}
                />
                <AvatarFallback className=" bg-amber-300 sm:text-8xl text-4xl">
                  {getInitials(fetchedUserData)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className=" p-2  max-w-[500px] w-3/4 sm:mr-24 flex flex-col gap-y-5">
            <div className=" flex flex-wrap items-center justify-between">
              <div>
                <span className=" sm:text-xl text-base">
                  {fetchedUserData.username}
                </span>
              </div>
            </div>
            <div className=" flex gap-4">
              <div className=" sm:px-1.5 flex flex-wrap justify-center gap-1 items-baseline">
                <span className=" sm:text-5xl text-2xl">
                  {fetchedUserData.totalReads}
                </span>
                <span className=" text-gray-50/70">reads</span>
              </div>
              <div className=" sm:px-1.5 flex flex-wrap justify-center gap-1 items-baseline">
                <span className=" sm:text-5xl text-2xl">
                  {fetchedUserData.followerCount}
                </span>
                <span className=" text-gray-50/70">
                  {fetchedUserData.followerCount > 1 ? "followers" : "follower"}
                </span>
              </div>
              <div className=" sm:px-1.5 flex flex-wrap justify-center gap-1 items-baseline">
                <span className=" sm:text-5xl text-2xl">
                  {fetchedUserData.followingCount}
                </span>
                <span className=" text-gray-50/70">following</span>
              </div>
            </div>
            <div>
              <span className=" sm:text-2xl text-lg">
                {fetchedUserData.fullName}
              </span>
            </div>
            <div className="  dark:text-white">
              <ReadMore maxLength={100} className=" text-sm">
                {fetchedUserData.bio}
              </ReadMore>
            </div>
            <div className=" pt-2 flex flex-wrap gap-2.5">
              {fetchedUserData.instagramLink && (
                <Instagram iglink={fetchedUserData.instagramLink} />
              )}
              {fetchedUserData.twitterLink && (
                <Twitter twlink={fetchedUserData.twitterLink} />
              )}
              {hasOneLink && (
                <ExternalLink externalLink={validExternalLinks[0]} />
              )}
              {hasMultipleLinks && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {" "}
                    <Button className=" rounded-full flex gap2">
                      <Link2 className=" -rotate-45" />
                      {"View more"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className=" text-center">
                      External Links
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {fetchedUserData.externalLinks
                      .filter(Boolean)
                      .map((link: string, index: number) => (
                        <DropdownMenuItem key={index}>
                          <ExternalLink externalLink={link} />
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div>
              <EditProfile userdata={fetchedUserData} />
            </div>
          </div>
        </div>
        <div className=" w-full mt-10">
          <Tabs.Root defaultValue="posts">
            <Tabs.List>
              <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
              <Tabs.Trigger value="liked">Liked posts</Tabs.Trigger>
              <Tabs.Trigger value="bookmarked">Bookmarked</Tabs.Trigger>
              <Tabs.Trigger value="about">About</Tabs.Trigger>
            </Tabs.List>

            <Box pt="4">
              <Tabs.Content value="posts">
                <UserPost userid={fetchedUserData._id} />
              </Tabs.Content>
              <Tabs.Content value="liked">
                <UserLikedPost />
              </Tabs.Content>
              <Tabs.Content value="bookmarked">
                <UserBookmarkedPost />
              </Tabs.Content>

              <Tabs.Content value="about">
                <Text size="2">{fetchedUserData.about}</Text>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default Page;
