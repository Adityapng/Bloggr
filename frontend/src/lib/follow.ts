import { apiFetcher } from "./apiFetcher";

export const followUser = async (userId: string) => {
  // ✅ FIX 3: The user ID goes in the URL path. The body is empty.
  const response = await apiFetcher(`/api/users/${userId}/follow`, {
    method: "PATCH",
    // No headers or body are needed for this specific action
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to follow user.");
  }

  return response.json();
};

export const unfollowUser = async (userId: string) => {
  // ✅ FIX 3: The user ID goes in the URL path. The body is empty.
  const response = await apiFetcher(`/api/users/${userId}/unfollow`, {
    method: "PATCH",
    // No headers or body needed here either
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unfollow user.");
  }

  return response.json();
};
