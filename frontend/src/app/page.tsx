"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  blogParsedContent,
  Blog,
  getInitials,
  GetXDaysAgo,
} from "@/lib/BlogFunctionLib";
import { apiFetcher } from "@/lib/apiFetcher";
import { ScrollableButtonList } from "@/components/feedFilter/FeedFilter";
// import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/components/auth/SessionProvider";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const session = useSession();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetcher(
          `/api/posts?page=${currentPage}&filter=${filterValue}`
        );
        if (response.status === 404) {
          return null;
        }

        if (!response.ok) {
          console.error(
            "FRONTEND: Response not OK. Status:",
            response.status,
            response.statusText
          );
        }

        const dataResponse = await response.json();
        setPosts(dataResponse.posts || null);
        setTotalPages(dataResponse.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, filterValue]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      pageNumbers.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  const filterFeed = (value: string) => {
    setFilterValue(value);
  };

  const profileLink = (postAuthor: string) => {
    if (session.user?.username === postAuthor) {
      return "/user/me";
    } else {
      return `/user/${postAuthor}`;
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="  xl:w-1/4 lg:w-1/5  w-0 hidden md:block"></div>
      <div className="  xl:w-1/2 lg:w-3/5 p-4 w-full">
        <div className="md:p-4 w-full ">
          <div className=" w-full ">
            <ScrollableButtonList
              sendFilterCategory={filterFeed}
              activeButtonId={filterValue}
            />
            {/* <p>{filterValue}</p> */}
          </div>
          <div className="min-h-[400px] w-full">
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
                          <Skeleton className="h-6 w-5/6 rounded-md" />{" "}
                          {/* Title */}
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
                {posts.length > 0 ? (
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
                              <p
                                className=" text-sm"
                                key={data.author.username}
                              >
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
                                <Bookmark className=" size-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-20 text-center text-muted">
                    <div className="text-4xl mb-4">😕</div>
                    <h2 className="text-2xl font-semibold mb-2">
                      No posts found
                    </h2>
                    <p className="text-sm text-gray-400 max-w-md">
                      Looks like there are no posts in this category yet. Check
                      back later or explore other topics.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.max(currentPage - 1, 1));
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none text-muted-foreground"
                      : ""
                  }
                />
              </PaginationItem>

              {renderPageNumbers()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.min(currentPage + 1, totalPages));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none text-muted-foreground"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className=" w-full flex flex-col gap-4"></div>
      </div>
      <div className="  xl:w-1/4 lg:w-1/5  w-0 hidden md:block"></div>
    </div>
  );
}
