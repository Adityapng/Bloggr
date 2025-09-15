import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="w-full flex justify-center">
      <div className="h-screen xl:w-1/4 lg:w-1/5 w-0 hidden md:block"></div>
      <div className="h-screen xl:w-1/2 lg:w-3/5 p-4 w-full">
        <>
          {/* Skeleton for the Filter Button List */}
          <div className="w-full flex justify-center py-4">
            <div className="flex gap-4 overflow-x-auto p-2">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>

          {/* Skeleton for the Post Feed */}
          <div className="min-h-[400px] w-full">
            <div className="space-y-10 w-full flex flex-col items-center">
              {/* 
            Create an array of a fixed size (e.g., 3-5) to render
            multiple post card skeletons. This mimics the paginated feed.
          */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="w-full sm:p-4 rounded-3xl min-h-44 gap-2 md:gap-10">
                    <div className="w-full flex flex-col">
                      {/* Author Skeleton */}
                      <div className="flex items-center gap-2 pb-3">
                        <Skeleton className="size-7 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      <div className="w-full flex gap-5 h-full">
                        {/* Text Content Skeleton */}
                        <div className="lg:w-3/4 md:w-2/3 w-full space-y-3">
                          <Skeleton className="h-6 w-5/6" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>

                        {/* Image Skeleton */}
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
                        <div>
                          <Skeleton className="size-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      </div>
      <div className="h-screen xl:w-1/4 lg:w-1/5 w-0 hidden md:block"></div>
    </div>
  );
}
