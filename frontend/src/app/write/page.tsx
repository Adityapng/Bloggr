"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tags, X } from "lucide-react";
import { CloudinaryUploadResult } from "@/lib/cloudinaryUpload";
import { apiFetcher } from "@/lib/apiFetcher";
import { Spinner } from "@/components/ui/spinner";

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagSearchResult, setTagSearchResult] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    CloudinaryUploadResult[]
  >([]);
  const [wordCount, setWordCount] = useState(0);

  const [allCategorizedTags, setAllCategorizedTags] = useState<
    Record<string, string[]>
  >({});
  const [areTagsLoading, setAreTagsLoading] = useState(true);

  const MAX_WORDS = 10000;

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

  const allTagsFlat = useMemo(() => {
    return Object.values(allCategorizedTags).flat();
  }, [allCategorizedTags]);

  const handleAddTag = (tagToAdd: string) => {
    if (!selectedTags.includes(tagToAdd)) {
      setSelectedTags((prevTags) => [...prevTags, tagToAdd]);
    }

    setTagSearchResult([]);

    const inputElement = document.getElementById("tag") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagSearch = (searchValue: string) => {
    if (!searchValue.trim()) {
      setTagSearchResult([]);
      return;
    }
    const matches = allTagsFlat.filter(
      (blogTag: string) =>
        blogTag.toLowerCase().includes(searchValue.toLowerCase()) &&
        !selectedTags.includes(blogTag)
    );
    setTagSearchResult(matches);
  };

  const handleImageUploadCallback = (imageData: CloudinaryUploadResult) => {
    setUploadedImages((prevImages) => [...prevImages, imageData]);
  };

  const handleCreatePost = async (postStatus: string) => {
    setIsLoading(true);
    setError(null);

    if (selectedTags.length == 0) {
      setError("Atleast one tag is required");
      return;
    }

    if (wordCount > MAX_WORDS) {
      setError(
        `Your post is too long! Please keep it under ${MAX_WORDS} words.`
      );
      return;
    }

    const coverimageurl =
      (uploadedImages[0] && uploadedImages[0].secure_url) || "";

    const postData = {
      title: title,
      content: content,
      coverImage: coverimageurl,
      tags: selectedTags,
      status: postStatus,
      wordCount: wordCount,
    };
    try {
      const path = "/api/posts";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      };
      const response = await apiFetcher(path, options);
      if (response.status === 404) {
        return null;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create post.");

      if (postStatus === "published") {
        router.push(`/posts/${data.slug}`);
      } else if (postStatus === "draft") {
        router.push(`/`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraftClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleCreatePost("draft");
  };

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleCreatePost("published");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-black flex flex-col items-center p-4">
      {isLoading ? (
        <div className=" w-full h-full flex items-center justify-center">
          <Spinner className="mr-2 h-12 w-12" />
        </div>
      ) : (
        <div className="w-full lg:w-1/2 max-w-4xl space-y-6">
          {error && (
            <div className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-2">
              {error}
            </div>
          )}
          <div className=" flex justify-between">
            <h1 className="text-3xl font-bold">Create Post</h1>
            <div className=" flex gap-0.5">
              <Button
                onClick={handleSaveDraftClick}
                disabled={isLoading}
                className=" rounded-l-3xl rounded-r-xs  bg-green-700 hover:bg-green-800 text-white"
              >
                {isLoading ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={handlePublishClick}
                disabled={isLoading}
                className=" rounded-r-3xl rounded-l-xs bg-green-700 hover:bg-green-800 text-white"
              >
                {isLoading ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </div>
          <Input
            placeholder="Enter your title here..."
            className="text-2xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => e.stopPropagation()}
            disabled={isLoading}
          />
          <div className="relative  w-full border rounded-lg overflow-hidden">
            <SimpleEditor
              onUpdate={setContent}
              onImageUpload={handleImageUploadCallback}
              onWordCountChange={setWordCount}
            />
          </div>

          <div>
            {areTagsLoading ? (
              <p>Loading Tags...</p>
            ) : (
              <div>
                <div className=" space-y-2">
                  <Label htmlFor="tag" className=" text-lg pl-1">
                    Tags
                  </Label>
                  <div className="relative">
                    <Tags className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    {/* search tag */}
                    <Input
                      id="tag"
                      type="text"
                      placeholder="Add a tag..."
                      onChange={(e) => handleTagSearch(e.target.value)}
                      onFocus={(e) => e.stopPropagation()}
                      className={`pl-10`}
                      disabled={isLoading}
                    />
                  </div>
                  {/* tag search result section */}
                  <div className=" flex flex-wrap gap-2">
                    {tagSearchResult &&
                      tagSearchResult.map((tag) => (
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 rounded-full p-2 capitalize"
                          key={`${tag}-search-results`}
                          onClick={() => handleAddTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
                {/* selected tag display section */}
                <div className=" flex gap-2 w-full flex-wrap p-4">
                  {selectedTags.map((tag) => (
                    <div
                      className="py-2 px-2  bg-green-700 hover:bg-green-800 rounded-4xl flex items-center gap-2"
                      key={`${tag}-selected-tag`}
                    >
                      <p className=" capitalize"> {tag}</p>
                      <button
                        className="bg-green-700 hover:bg-green-800 rounded-full "
                        onClick={() => {
                          handleRemoveTag(tag);
                        }}
                      >
                        <X />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
