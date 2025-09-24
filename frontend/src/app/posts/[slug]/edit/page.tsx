"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tags, X } from "lucide-react";
import { apiFetcher } from "@/lib/apiFetcher";
import { Blog } from "@/lib/BlogFunctionLib"; // Assuming this is your detailed post type
// import { CloudinaryUploadResult } from "@/lib/cloudinaryUpload";

// Props from the dynamic route
interface EditPageProps {
  params: {
    slug: string;
  };
}

// Main Component
export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const { slug } = params;

  // --- State Management ---
  // A single state object for all form data
  const [formData, setFormData] = useState<Partial<Blog>>({});

  // Separate state for the editor's content, as it updates frequently
  const [content, setContent] = useState("");

  const [wordCount, setWordCount] = useState(0);

  // State for the tag selection UI
  const [tagInput, setTagInput] = useState("");
  const [tagSearchResult, setTagSearchResult] = useState<string[]>([]);
  const [allCategorizedTags, setAllCategorizedTags] = useState<
    Record<string, string[]>
  >({});

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false); // For submitting updates
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchInitialData = async () => {
      // Reset state in case we navigate between edit pages
      setIsFetchingInitialData(true);
      setError(null);

      try {
        const [postResponse, tagsResponse] = await Promise.all([
          apiFetcher(`/api/posts/${slug}`),
          apiFetcher("/api/tags"),
        ]);

        if (!postResponse.ok)
          throw new Error(
            "Post not found or you are not authorized to edit it."
          );
        if (!tagsResponse.ok) throw new Error("Failed to fetch tags.");

        const postData: Blog = await postResponse.json();

        const tagsData = await tagsResponse.json();

        // Populate all state from the fetched data
        setFormData(postData);
        console.log(postData.tags);

        setContent(postData.content);
        // The API populates tags as an array of objects, we need just the names
        setAllCategorizedTags(tagsData);
      } catch (err: Error | unknown) {
        const error =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(error);
      } finally {
        setIsFetchingInitialData(false);
      }
    };

    fetchInitialData();
  }, [slug]);

  // Create a flattened list of all tag names for searching
  const allTagsFlat = useMemo(() => {
    return Object.values(allCategorizedTags).flat();
  }, [allCategorizedTags]);

  // --- Event Handlers ---

  const handleInputChange = (field: keyof Blog, value: Blog[keyof Blog]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagSearch = (searchValue: string) => {
    setTagInput(searchValue);
    if (!searchValue.trim()) {
      setTagSearchResult([]);
      return;
    }
    const matches = allTagsFlat.filter(
      (tag) =>
        tag.toLowerCase().includes(searchValue.toLowerCase()) &&
        !formData.tags?.some((t) => t.name === tag)
    );
    setTagSearchResult(matches.slice(0, 5)); // Limit results
  };

  const handleAddTag = (tagToAdd: string) => {
    if (!formData.tags?.some((t) => t.name === tagToAdd)) {
      // Create a mock tag object to add to the UI with a temporary ID
      const newTag = {
        _id: `temp-${Date.now()}`,
        name: tagToAdd,
        slug: tagToAdd.toLowerCase().replace(/\s+/g, "-"),
        category: "Uncategorized",
      };
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
    }
    setTagSearchResult([]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag.name !== tagToRemove),
    }));
  };

  const handleUpdatePost = async (e: FormEvent, postStatus: string) => {
    e.preventDefault();
    if (!formData._id) return;

    setIsLoading(true);
    setError(null);

    const postDataToUpdate = {
      title: formData.title,
      content: content,
      // We send back an array of names. The backend will convert them to IDs.
      tags: formData.tags?.map((tag) => tag.name),
      status: postStatus,
      wordCount,
    };

    try {
      const response = await apiFetcher(`/api/posts/${formData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postDataToUpdate),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update post.");

      toast.success("Post updated successfully!");
      router.push(`/posts/${data.slug}`);
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update post.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Logic ---

  if (isFetchingInitialData) {
    // You can replace this with a dedicated skeleton component
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
        <p className="ml-4">Loading editor...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!formData._id) {
    // This case handles if the post wasn't found but didn't throw an error
    return <div>Post could not be loaded.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-black flex flex-col items-center p-4">
      <form
        onSubmit={(e) => handleUpdatePost(e, formData.status || "draft")}
        className="w-full lg:w-1/2 max-w-4xl space-y-6"
      >
        {error && <div className="mt-4 text-red-600 ...">{error}</div>}
        <div className="flex justify-between items-center">
          <h1 className="md:text-3xl text-2xl font-bold">Edit Post</h1>
          <div className="flex gap-0.5">
            <Button
              type="button"
              onClick={(e) => handleUpdatePost(e, "draft")}
              disabled={isLoading}
              className=" rounded-l-3xl rounded-r-xs  bg-green-700 hover:bg-green-800 text-white"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className=" rounded-r-3xl rounded-l-xs bg-green-700 hover:bg-green-800 text-white"
            >
              Publish Changes
            </Button>
          </div>
        </div>

        <Input
          placeholder="Enter your title here..."
          value={formData.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          disabled={isLoading}
        />

        <div className="relative h-[70vh] w-full border rounded-lg overflow-hidden">
          <SimpleEditor
            onUpdate={setContent}
            initialContent={formData.content}
            onWordCountChange={setWordCount}
          />
        </div>

        <div>
          <div className="space-y-2">
            <Label htmlFor="tag" className=" text-lg pl-1">
              Tags
            </Label>
            <div className="relative">
              <Tags className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="tag"
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => handleTagSearch(e.target.value)}
                className={`pl-10`}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
            {/* Tag search result section */}
            <div className="flex flex-wrap gap-2">
              {tagSearchResult &&
                tagSearchResult.map((tag) => (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2 capitalize"
                    key={`${tag}-search-results`}
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
          {/* Selected tag display section */}
          <div className=" flex gap-2 w-full flex-wrap py-4">
            {formData.tags?.map((tag) => (
              <div
                className="py-2 px-2  bg-green-700 rounded-4xl flex items-center gap-2"
                key={`${tag.name}-selected-tag`}
              >
                <p className=" capitalize pl-2"> {tag.name}</p>
                <button
                  className="bg-green-700 hover:bg-green-800 rounded-full p-2 "
                  onClick={() => {
                    handleRemoveTag(tag.name);
                  }}
                >
                  <X className=" size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
