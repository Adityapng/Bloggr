"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the props the component will accept
interface EmojiPopoverProps {
  // A callback function to send the selected emoji back to the parent
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPopover({ onEmojiSelect }: EmojiPopoverProps) {
  // State to control the visibility of the picker
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // A ref to the main wrapper div of the component
  const wrapperRef = useRef<HTMLDivElement>(null);

  // This effect handles the "click outside to close" logic
  useEffect(() => {
    // Only add the event listener if the picker is visible
    if (!isPickerVisible) return;

    function handleClickOutside(event: MouseEvent) {
      // Check if the ref is set and if the clicked element is not inside the wrapper
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsPickerVisible(false);
      }
    }

    // Add the event listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);

    // Crucial cleanup: remove the event listener when the component unmounts
    // or when the picker is hidden.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPickerVisible]); // The effect re-runs whenever isPickerVisible changes

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    // Call the parent's onEmojiSelect function with the chosen emoji
    onEmojiSelect(emojiData.emoji);
    // Hide the picker after an emoji is selected
    setIsPickerVisible(false);
  };

  return (
    // The ref is attached here. `relative` is ESSENTIAL for positioning the picker.
    <div className="relative" ref={wrapperRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPickerVisible((prev) => !prev)} // Toggle visibility on click
        aria-label="Open emoji picker"
      >
        <Smile className="h-6 w-6 text-gray-500" />
      </Button>

      {isPickerVisible && (
        // The picker is positioned absolutely relative to the wrapper div.
        <div className="absolute bottom-full right-0 mb-2 z-10">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            // Optional: for better performance
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
}
