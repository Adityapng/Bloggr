"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetcher } from "@/lib/apiFetcher";

interface AvatarUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export default function AvatarUploader({
  onUploadSuccess,
}: AvatarUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    // --- Step 1: Go to our backend (the manager) to get the permission slip ---
    const getSignature = async () => {
      const path = "/api/uploads/signature";
      const response = await apiFetcher(path);
      return response.json();
    };
    const { timestamp, signature } = await getSignature();

    // --- Step 2: Prepare the file and permission slip to show the bouncer ---
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);

    // --- Step 3: Go directly to Cloudinary (the bouncer) and upload the file ---
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/profileAvatar/`;
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    // --- Step 4: The file is uploaded! Now we call the success function ---
    onUploadSuccess(data.secure_url);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload} disabled={isLoading || !file}>
        {isLoading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
