"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn Button

// We can get the current URL from within the component
interface ShareButtonProps {
  title: string; // The title of the post to share
  text?: string; // Optional descriptive text
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  // State to give feedback to the user (e.g., "Link Copied!")
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleShare = async () => {
    // 1. Construct the data to be shared
    const shareData = {
      title: title,
      text: text || "Check out this interesting blog post!",
      url: window.location.href, // Get the current page URL
    };

    // 2. Check if the Web Share API is available in the browser
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        // --- NATIVE SHARE ---
        // This opens the device's native share dialog
        await navigator.share(shareData);
        console.log("Post shared successfully!");
      } catch (error) {
        console.error("Error using Web Share API:", error);
      }
    } else {
      // --- FALLBACK: COPY LINK ---
      // This runs on desktop browsers or if the share fails
      try {
        await navigator.clipboard.writeText(shareData.url);
        setFeedbackMessage("Link Copied!");

        // Clear the feedback message after a few seconds
        setTimeout(() => setFeedbackMessage(""), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
        setFeedbackMessage("Failed to copy");
        setTimeout(() => setFeedbackMessage(""), 2000);
      }
    }
  };

  return (
    <div className="relative flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        aria-label="Share this post"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      {/* Feedback message for the "Copy Link" fallback */}
      {feedbackMessage && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded-md transition-opacity duration-300">
          {feedbackMessage}
        </span>
      )}
    </div>
  );
}
