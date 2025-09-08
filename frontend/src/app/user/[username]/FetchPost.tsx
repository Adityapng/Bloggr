"use client";
import Image from "next/image";
import { notFound } from "next/navigation";
import useSWR from "swr";

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

export const dynamic = "force-dynamic";

interface UserPostFeedProps {
  userid: string;
}

export function UserPost({ userid }: UserPostFeedProps) {
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
    return <span>Couldn&apos;t fetch data</span>;
  }

  if (error) return notFound();

  const posts: Blog[] = data || [];

  return (
    <div className=" w-full">
      {isLoading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="space-y-10 w-full flex flex-col items-center">
          {posts.map((data) => {
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
          })}
        </div>
      )}
    </div>
  );
}

export function UserBookmarkedPost() {
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
    `/api/users/me/bookmarks`,
    swrFetcher,
    { dedupingInterval: 300000, revalidateOnFocus: false }
  );
  if (!data) {
    return <span>Couldn&apos;t fetch data</span>;
  }

  if (error) return notFound();

  const posts: Blog[] = data || [];

  return (
    <div className=" w-full">
      {isLoading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="space-y-10 w-full flex flex-col items-center">
          {posts.map((data) => {
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
          })}
        </div>
      )}
    </div>
  );
}

export function UserLikedPost() {
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

  const { data, error, isLoading } = useSWR(`/api/users/me/likes`, swrFetcher, {
    dedupingInterval: 300000,
    revalidateOnFocus: false,
  });
  if (!data) {
    return <span>Couldn&apos;t fetch data</span>;
  }

  if (error) return notFound();

  const posts: Blog[] = data || [];

  return (
    <div className=" w-full">
      {isLoading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="space-y-10 w-full flex flex-col items-center">
          {posts.map((data) => {
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
          })}
        </div>
      )}
    </div>
  );
}
