import { fetcher } from "./fetcher";

export const dynamic = "force-dynamic";

interface userData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarURL?: string;
  bio?: string;
  role: string;
}

interface ApiResponse {
  isLoggedIn: boolean;
  user: userData | null;
}

export async function handleLoggedInUserData(): Promise<ApiResponse | null> {
  try {
    const path = "/";
    const response = await fetcher(path);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { isLoggedIn: false, user: null };
  }
}
