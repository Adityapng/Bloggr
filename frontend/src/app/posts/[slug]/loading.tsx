import { Skeleton } from "@/components/ui/skeleton"; // Assuming you added Shadcn's Skeleton component

export default function PostLoadingSkeleton() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-3/4 sm:w-4/5 max-sm:px-4 max-w-4xl">
        {/* Skeleton for the Title */}
        <Skeleton className="h-12 w-3/4 mb-4" />

        <div className="flex flex-col items-center w-full pt-4 justify-between gap-4">
          <div className="flex flex-wrap-reverse sm:flex-row gap-4 items-center w-full justify-between">
            {/* Skeleton for the Author section */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Skeleton for the metadata */}
            <div className="flex gap-4 items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          {/* Skeleton for the interaction bar */}
          <Skeleton className="h-10 w-full mt-4" />
        </div>

        <br />

        {/* Skeleton for the main content */}
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <br />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    </div>
  );
}
