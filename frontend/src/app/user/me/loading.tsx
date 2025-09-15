import { Skeleton } from "@/components/ui/skeleton";
import { Box, Tabs } from "@radix-ui/themes";

export default function ProfilePageSkeleton() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-3/4 sm:w-4/5 max-sm:p-4 max-w-5xl p-16">
        {/* Top Profile Section */}
        <div className="w-full flex sm:justify-between max-sm:gap-2">
          {/* Avatar Skeleton */}
          <div className="w-1/4">
            <Skeleton className="md:size-64 size-24 rounded-full" />
          </div>

          {/* User Info Skeleton */}
          <div className="p-2 max-w-[500px] w-3/4 sm:mr-24 flex flex-col gap-y-5">
            {/* Username and Edit Button */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Stats Section */}
            <div className="flex gap-4">
              <div className="sm:px-1.5 flex flex-col items-center gap-1">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="sm:px-1.5 flex flex-col items-center gap-1">
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="sm:px-1.5 flex flex-col items-center gap-1">
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Full Name Skeleton */}
            <div>
              <Skeleton className="h-8 w-48" />
            </div>

            {/* Bio Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Links Skeleton */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tabs Section Skeleton */}
        <div className="w-full mt-10">
          <Tabs.Root defaultValue="posts">
            {/* Tab Triggers */}
            <div className="flex border-b">
              <Skeleton className="h-10 w-20 mr-4" />
              <Skeleton className="h-10 w-28 mr-4" />
              <Skeleton className="h-10 w-32 mr-4" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Tab Content Area */}
            <Box pt="4">
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </Box>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
