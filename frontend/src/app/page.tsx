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
import { BookmarkPlus, MessageCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type FeedPost = {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  commentCount: number;
  likeCount: number;
  slug: string;
};

const testFilter = "none";

export default function HomePage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
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

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className=" h-screen md:w-1/4  w-0 hidden md:block"></div>
      <div className=" h-screen md:w-1/2 p-4 w-full">
        <div className="md:p-4 ">
          <div className="min-h-[400px]">
            {isLoading ? (
              <p className="text-center">Loading posts...</p>
            ) : (
              <div className="space-y-10">
                {posts.map((data) => {
                  return (
                    <Link href={`/posts/${data.slug}`} key={data._id}>
                      <div
                        key={data._id}
                        className=" w-full flex md:flex-row flex-col p-4 hover:bg-gray-50/5 rounded-3xl min-h-44 gap-2 md:gap-10"
                      >
                        <div className=" md:w-3/4 w-full gap-y-3 flex md:flex-col flex-row">
                          <div className=" w-2/3">
                            <div className="">
                              <p className=" text-lg mb-2 font-bold">
                                {data.title}
                              </p>
                            </div>
                            <div className="">
                              <p className="text-sm md:line-clamp-3 line-clamp-2">
                                {data.content}
                              </p>
                            </div>
                          </div>

                          <div className=" md:flex hidden justify-between my-3">
                            <div className=" flex gap-4">
                              <div className=" flex gap-1 items-center">
                                <ThumbsUp className=" size-5" />{" "}
                                <span>{data.likeCount}</span>
                              </div>
                              <div className=" flex gap-1 items-center">
                                <MessageCircle className=" size-5" />{" "}
                                <span>{data.commentCount}</span>
                              </div>
                            </div>
                            <div>
                              <div>
                                <BookmarkPlus />
                              </div>
                            </div>
                          </div>

                          <div className=" md:hidden block w-1/3   bg-amber-300 relative md:rounded-2xl rounded-sm aspect-4/3 self-start contain-content">
                            <Image
                              alt="ddd"
                              src={data.coverImage}
                              fill
                              priority
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>

                        <div className=" md:w-1/4">
                          <div className=" flex justify-between mt-3 md:hidden">
                            <div className=" flex gap-4">
                              <div>
                                <ThumbsUp className=" size-5" />
                              </div>
                              <div>
                                <MessageCircle className=" size-5" />
                              </div>
                            </div>
                            <div>
                              <div>
                                <BookmarkPlus />
                              </div>
                            </div>
                          </div>

                          <div className=" hidden md:block relative md:rounded-2xl rounded-sm aspect-4/3 self-start contain-content">
                            <Image
                              alt="ddd"
                              src={data.coverImage}
                              fill
                              priority
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
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
      <div className=" h-screen md:w-1/4  w-0 hidden md:block"></div>
    </div>
  );
}
