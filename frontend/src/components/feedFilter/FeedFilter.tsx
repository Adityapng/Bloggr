import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetcher } from "@/lib/apiFetcher";
// import { notFound } from "next/navigation";

interface ScrollableButtonListProps {
  buttons?: string[];
  scrollDistance?: number;
  className?: string;
  sendFilterCategory: (value: string) => void;
  activeButtonId: string | null;
}

export const ScrollableButtonList: React.FC<ScrollableButtonListProps> = ({
  scrollDistance = 200,
  className = "",
  sendFilterCategory,
  activeButtonId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [allCategorizedTags, setAllCategorizedTags] = useState<
    Record<string, string[]>
  >({});
  const [areTagsLoading, setAreTagsLoading] = useState(true);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = (): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 5); // Add small threshold
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Add small threshold
  };

  // Scroll to show more buttons
  const scrollLeft = (): void => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -scrollDistance, behavior: "smooth" });
    }
  };

  const scrollRight = (): void => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: scrollDistance, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100); // Small delay to ensure DOM is ready

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      const resizeObserver = new ResizeObserver(() => {
        setTimeout(checkScrollPosition, 50);
      });
      resizeObserver.observe(container);

      return () => {
        clearTimeout(timeoutId);
        container.removeEventListener("scroll", checkScrollPosition);
        resizeObserver.disconnect();
      };
    }

    return () => clearTimeout(timeoutId);
  }, [allCategorizedTags]); // Re-run when tags change

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiFetcher("/api/tags");
        // if (response.status === 404) {
        //   notFound(); // This will immediately stop rendering and show the 404 page
        // }
        const data = await response.json();
        setAllCategorizedTags(data);
      } catch (error) {
        console.error("Failed to load tags:", error);
      } finally {
        setAreTagsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const categoryNames = Object.keys(allCategorizedTags || {});
  const buttonLabels = ["All", ...categoryNames];

  const getButtonClasses = (buttonId: string): string => {
    const activeClasses = "shadow-[0px_0px_10px_1px] shadow-blue-500";

    return activeButtonId === buttonId ? activeClasses : "";
  };

  return (
    <div>
      {areTagsLoading ? (
        <p>Loading feed filters ...</p>
      ) : (
        <div className={`w-full ${className}`}>
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-zinc-900 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 border dark:border-zinc-600"
                aria-label="Scroll left"
                type="button"
                style={{ marginLeft: "4px" }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide py-3 "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingLeft: canScrollLeft ? "40px" : "8px",
                paddingRight: canScrollRight ? "40px" : "8px",
                transition: "padding 0.2s ease",
              }}
            >
              {buttonLabels.map((label: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => sendFilterCategory(label)}
                  className={`filter-button flex-shrink-0 px-4 py-2 bg-white dark:bg-zinc-950 dark:border-zinc-600 border border-zinc-200 rounded-full text-sm font-medium text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 whitespace-nowrap ${getButtonClasses(
                    label
                  )}`}
                >
                  {label.replace(/_/g, " & ")}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-zinc-900 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 border dark:border-zinc-600"
                aria-label="Scroll right"
                type="button"
                style={{ marginRight: "4px" }}
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>

          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
