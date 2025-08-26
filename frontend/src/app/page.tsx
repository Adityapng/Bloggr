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
import { BookmarkPlus, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  blogParsedContent,
  Blog,
  getInitials,
  GetXDaysAgo,
} from "@/lib/BlogFunctionLib";

export const dynamic = "force-dynamic";

const testFilter = "none";

export default function HomePage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const finalURL = `${apiUrl}/api/posts?page=${currentPage}&tag=${testFilter}`;

        console.log("FRONTEND: Attempting to fetch from URL:", finalURL);

        const response = await fetch(finalURL);

        if (!response.ok) {
          console.error(
            "FRONTEND: Response not OK. Status:",
            response.status,
            response.statusText
          );
        }

        const dataResponse = await response.json();
        console.log(dataResponse);
        setPosts(dataResponse.posts || []);
        setTotalPages(dataResponse.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

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

  //TODO add conditional filtering option to filter posts in feed
  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className=" h-screen xl:w-1/4 lg:w-1/5  w-0 hidden md:block"></div>
      <div className=" h-screen xl:w-1/2 lg:w-3/5 p-4 w-full">
        <div className="md:p-4 w-full ">
          <div className="min-h-[400px] w-full">
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
                        <div className=" flex items-center gap-2 pb-3">
                          <Avatar className=" size-5 ">
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
      <div className=" h-screen xl:w-1/4 lg:w-1/5  w-0 hidden md:block"></div>
    </div>
  );
}
