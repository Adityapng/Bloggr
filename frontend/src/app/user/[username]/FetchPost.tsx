"use client";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

import { BookmarkPlus, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  blogParsedContent,
  Blog,
  getInitials,
  GetXDaysAgo,
} from "@/lib/BlogFunctionLib";
import { apiFetcher } from "@/lib/apiFetcher";
import { useSession } from "@/components/auth/SessionProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

interface UserPostFeedProps {
  userid: string;
}

export function UserPost({ userid }: UserPostFeedProps) {
  const session = useSession();
  const router = useRouter();
  const swrFetcher = async (path: string) => {
    const response = await apiFetcher(path);
    if (response.status === 404) {
      return null; // This will immediately stop rendering and show the 404 page
    }

    if (!response.ok) {
      const errorInfo = await response
        .json()
        .catch(() => ({ error: "An unknown error occurred." }));
      const error = new Error(errorInfo.error || "Failed to fetch data");
      // error.status = response.status;
      throw error;
    }
    return response.json();
  };

  const { data, error, isLoading } = useSWR(
    `/api/users/${userid}/posts`,
    swrFetcher,
    { dedupingInterval: 300000, revalidateOnFocus: false }
  );
  if (!data) {
    router.refresh();
  }

  if (error) return notFound();

  const posts: Blog[] = data || [];

  const profileLink = (postAuthor: string) => {
    if (session.user?.username === postAuthor) {
      return "/user/me";
    } else {
      return `/user/${postAuthor}`;
    }
  };

  const NoPostInformation = () => {
    return session.user?._id === userid ? (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <div className="text-5xl mb-4">✍️</div>
        <h2 className="text-2xl font-semibold mb-2">
          You haven&apos;t posted anything yet
        </h2>
        <p className="text-sm text-gray-400 max-w-md">
          Share your thoughts and ideas with the community by writing your first
          post.
        </p>
        <Link href="/write" className="mt-6 text-sm text-blue-500 underline">
          Write your first post
        </Link>
      </div>
    ) : (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
        <p className="text-sm text-gray-400 max-w-md">
          This user hasn&apos;t published any posts yet. When they do,
          you&apos;ll see them here.
        </p>
      </div>
    );
  };

  return (
    <div className=" w-full">
      {isLoading ? (
        <div className="space-y-10 w-full flex flex-col items-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full sm:p-4 rounded-3xl min-h-44 gap-2 md:gap-10"
            >
              <div className="w-full flex flex-col">
                {/* Author Skeleton */}
                <div className="flex items-center gap-2 pb-3">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Post Content Skeleton */}
                <div className="w-full flex gap-5 h-full">
                  <div className="lg:w-3/4 md:w-2/3 w-full space-y-3">
                    <Skeleton className="h-6 w-5/6 rounded-md" /> {/* Title */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                  </div>

                  <div className="lg:w-1/4 md:w-1/3 w-full aspect-[4/3]">
                    <Skeleton className="w-full h-full rounded-3xl" />
                  </div>
                </div>

                {/* Interaction Bar Skeleton */}
                <div className="flex justify-between pt-4">
                  <div className="flex gap-4 text-xs items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="size-5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10 w-full flex flex-col items-center">
          {posts.length === 0 ? (
            <NoPostInformation />
          ) : (
            posts.map((data) => {
              return (
                <div
                  key={data._id}
                  className=" w-full  sm:p-4 hover:bg-gray-50/5 rounded-3xl min-h-44 gap-2 md:gap-10"
                >
                  <div className="w-full flex flex-col">
                    <Link
                      href={profileLink(data.author.username)}
                      key={data.author.username}
                    >
                      <div className=" flex items-center gap-2 pb-3">
                        <Avatar className=" size-7 ">
                          <AvatarImage
                            className=" select-none"
                            src={data.author.authorAvatar}
                          />
                          <AvatarFallback className=" bg-amber-300 text-xs">
                            {getInitials(data)}
                          </AvatarFallback>
                        </Avatar>
                        <p className=" text-sm" key={data.author.username}>
                          {data.author.username}
                        </p>
                      </div>
                    </Link>
                    <Link href={`/posts/${data.slug}`} key={data._id}>
                      <div className=" w-full flex gap-5 h-full">
                        <div className=" lg:w-3/4 md:w-2/3 w-full ">
                          <div className="">
                            <p className=" sm:text-xl text-lg font-bold ">
                              {data.title}
                            </p>
                          </div>
                          <div className="">
                            <p className=" line-clamp-3 sm:text-md text-sm text-muted">
                              {blogParsedContent(data.content)}
                            </p>
                          </div>
                        </div>
                        <div className=" lg:w-1/4 md:w-1/3 w-full sm:h-full h-2/3 contain-content aspect-[4/3] rounded-3xl">
                          <Image
                            alt="ddd"
                            src={data.coverImage}
                            fill
                            priority
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className=" flex justify-between pt-4 ">
                      <div className=" flex gap-4 text-xs items-center">
                        <p key={data.createdAt}>
                          <GetXDaysAgo date={data.createdAt} />{" "}
                        </p>

                        <span className=" flex gap-2 items-center">
                          <Heart className=" size-5" />{" "}
                          <span>{data.likeCount}</span>
                        </span>

                        <span className="flex gap-2 items-center ">
                          <MessageCircle className=" size-5" />{" "}
                          <span>{data.commentCount}</span>
                        </span>
                      </div>
                      <div>
                        <button className=" cursor-pointer">
                          <BookmarkPlus className=" size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function UserBookmarkedPost() {
  const swrFetcher = async (path: string) => {
    const response = await apiFetcher(path);
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorInfo = await response
        .json()
        .catch(() => ({ error: "An unknown error occurred." }));
      const error = new Error(errorInfo.error || "Failed to fetch data");
      throw error;
    }
    return response.json();
  };

  const { data, error, isLoading } = useSWR(
    `/api/users/me/bookmarks`,
    swrFetcher,
    { dedupingInterval: 300000, revalidateOnFocus: false }
  );
  const [showRetrying, setShowRetrying] = useState(false);

  useEffect(() => {
    if (!data && !isLoading) {
      const timer = setTimeout(() => {
        setShowRetrying(true);
        mutate(`/api/users/me/bookmarks`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data, isLoading]);

  if (!data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold mb-2">
          Couldn&apos;t fetch data
        </h2>
        <p className="text-sm text-gray-400 max-w-md">
          No data was returned from the server.
        </p>
        {showRetrying && (
          <>
            <p className="text-base mb-4">Retrying...</p>
            <Spinner className="size-5 mx-auto" />
          </>
        )}
      </div>
    );
  }

  if (error) return notFound();

  const posts: Blog[] = data || [];

  return (
    <div className=" w-full">
      {isLoading ? (
        <div className="space-y-10 w-full flex flex-col items-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full sm:p-4 rounded-3xl min-h-44 gap-2 md:gap-10"
            >
              <div className="w-full flex flex-col">
                {/* Author Skeleton */}
                <div className="flex items-center gap-2 pb-3">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Post Content Skeleton */}
                <div className="w-full flex gap-5 h-full">
                  <div className="lg:w-3/4 md:w-2/3 w-full space-y-3">
                    <Skeleton className="h-6 w-5/6 rounded-md" /> {/* Title */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                  </div>

                  <div className="lg:w-1/4 md:w-1/3 w-full aspect-[4/3]">
                    <Skeleton className="w-full h-full rounded-3xl" />
                  </div>
                </div>

                {/* Interaction Bar Skeleton */}
                <div className="flex justify-between pt-4">
                  <div className="flex gap-4 text-xs items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="size-5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10 w-full flex flex-col items-center">
          {posts.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <div className="text-5xl mb-4">🔖</div>
              <h2 className="text-2xl font-semibold mb-2">No bookmarks yet</h2>
              <p className="text-sm text-gray-400 max-w-md">
                You haven&apos;t bookmarked any posts yet. Save posts you like
                to read them later.
              </p>
            </div>
          ) : (
            posts.map((data) => {
              return (
                <div
                  key={data._id}
                  className=" w-full  sm:p-4 hover:bg-gray-50/5 rounded-3xl min-h-44 gap-2 md:gap-10"
                >
                  <div className="w-full flex flex-col">
                    <Link
                      href={`/user/${data.author.username}`}
                      key={data.author.username}
                    >
                      <div className=" flex items-center gap-2 pb-3">
                        <Avatar className=" size-7 ">
                          <AvatarImage
                            className=" select-none"
                            src={data.author.authorAvatar}
                          />
                          <AvatarFallback className=" bg-amber-300 text-xs">
                            {getInitials(data)}
                          </AvatarFallback>
                        </Avatar>
                        <p className=" text-sm" key={data.author.username}>
                          {data.author.username}
                        </p>
                      </div>
                    </Link>
                    <Link href={`/posts/${data.slug}`} key={data._id}>
                      <div className=" w-full flex gap-5 h-full">
                        <div className=" lg:w-3/4 md:w-2/3 w-full ">
                          <div className="">
                            <p className=" sm:text-xl text-lg font-bold ">
                              {data.title}
                            </p>
                          </div>
                          <div className="">
                            <p className=" line-clamp-3 sm:text-md text-sm text-muted">
                              {blogParsedContent(data.content)}
                            </p>
                          </div>
                        </div>
                        <div className=" lg:w-1/4 md:w-1/3 w-full sm:h-full h-2/3 contain-content aspect-[4/3] rounded-3xl">
                          <Image
                            alt="ddd"
                            src={data.coverImage}
                            fill
                            priority
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className=" flex justify-between pt-4 ">
                      <div className=" flex gap-4 text-xs items-center">
                        <p key={data.createdAt}>
                          <GetXDaysAgo date={data.createdAt} />{" "}
                        </p>

                        <span className=" flex gap-2 items-center">
                          <Heart className=" size-5" />{" "}
                          <span>{data.likeCount}</span>
                        </span>

                        <span className="flex gap-2 items-center ">
                          <MessageCircle className=" size-5" />{" "}
                          <span>{data.commentCount}</span>
                        </span>
                      </div>
                      <div>
                        <button className=" cursor-pointer">
                          <BookmarkPlus className=" size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function UserLikedPost() {
  const swrFetcher = async (path: string) => {
    const response = await apiFetcher(path);
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorInfo = await response
        .json()
        .catch(() => ({ error: "An unknown error occurred." }));
      const error = new Error(errorInfo.error || "Failed to fetch data");
      throw error;
    }
    return response.json();
  };

  const { data, error, isLoading } = useSWR(`/api/users/me/likes`, swrFetcher, {
    dedupingInterval: 300000,
    revalidateOnFocus: false,
  });
  const [showRetrying, setShowRetrying] = useState(false);

  useEffect(() => {
    if (!data && !isLoading) {
      const timer = setTimeout(() => {
        setShowRetrying(true);
        mutate(`/api/users/me/likes`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data, isLoading]);

  if (!data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold mb-2">
          Couldn&apos;t fetch data
        </h2>
        <p className="text-sm text-gray-400 max-w-md">
          No data was returned from the server.
        </p>
        {showRetrying && (
          <>
            <p className="text-base mb-4">Retrying...</p>
            <Spinner className="size-5 mx-auto" />
          </>
        )}
      </div>
    );
  }
  if (error) return notFound();

  const posts: Blog[] = data || [];

  return (
    <div className=" w-full">
      {isLoading ? (
        <div className="space-y-10 w-full flex flex-col items-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full sm:p-4 rounded-3xl min-h-44 gap-2 md:gap-10"
            >
              <div className="w-full flex flex-col">
                {/* Author Skeleton */}
                <div className="flex items-center gap-2 pb-3">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Post Content Skeleton */}
                <div className="w-full flex gap-5 h-full">
                  <div className="lg:w-3/4 md:w-2/3 w-full space-y-3">
                    <Skeleton className="h-6 w-5/6 rounded-md" /> {/* Title */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                  </div>

                  <div className="lg:w-1/4 md:w-1/3 w-full aspect-[4/3]">
                    <Skeleton className="w-full h-full rounded-3xl" />
                  </div>
                </div>

                {/* Interaction Bar Skeleton */}
                <div className="flex justify-between pt-4">
                  <div className="flex gap-4 text-xs items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="size-5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10 w-full flex flex-col items-center">
          {posts.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <div className="text-5xl mb-4">❤️</div>
              <h2 className="text-2xl font-semibold mb-2">No likes yet</h2>
              <p className="text-sm text-gray-400 max-w-md">
                You haven&apos;t liked any posts yet. Tap the heart icon on
                posts you enjoy.
              </p>
            </div>
          ) : (
            posts.map((data) => {
              return (
                <div
                  key={data._id}
                  className=" w-full  sm:p-4 hover:bg-gray-50/5 rounded-3xl min-h-44 gap-2 md:gap-10"
                >
                  <div className="w-full flex flex-col">
                    <Link
                      href={`/user/${data.author.username}`}
                      key={data.author.username}
                    >
                      <div className=" flex items-center gap-2 pb-3">
                        <Avatar className=" size-7 ">
                          <AvatarImage
                            className=" select-none"
                            src={data.author.authorAvatar}
                          />
                          <AvatarFallback className=" bg-amber-300 text-xs">
                            {getInitials(data)}
                          </AvatarFallback>
                        </Avatar>
                        <p className=" text-sm" key={data.author.username}>
                          {data.author.username}
                        </p>
                      </div>
                    </Link>
                    <Link href={`/posts/${data.slug}`} key={data._id}>
                      <div className=" w-full flex gap-5 h-full">
                        <div className=" lg:w-3/4 md:w-2/3 w-full ">
                          <div className="">
                            <p className=" sm:text-xl text-lg font-bold ">
                              {data.title}
                            </p>
                          </div>
                          <div className="">
                            <p className=" line-clamp-3 sm:text-md text-sm text-muted">
                              {blogParsedContent(data.content)}
                            </p>
                          </div>
                        </div>
                        <div className=" lg:w-1/4 md:w-1/3 w-full sm:h-full h-2/3 contain-content aspect-[4/3] rounded-3xl">
                          <Image
                            alt="ddd"
                            src={data.coverImage}
                            fill
                            priority
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className=" flex justify-between pt-4 ">
                      <div className=" flex gap-4 text-xs items-center">
                        <p key={data.createdAt}>
                          <GetXDaysAgo date={data.createdAt} />{" "}
                        </p>

                        <span className=" flex gap-2 items-center">
                          <Heart className=" size-5" />{" "}
                          <span>{data.likeCount}</span>
                        </span>

                        <span className="flex gap-2 items-center ">
                          <MessageCircle className=" size-5" />{" "}
                          <span>{data.commentCount}</span>
                        </span>
                      </div>
                      <div>
                        <button className=" cursor-pointer">
                          <BookmarkPlus className=" size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
