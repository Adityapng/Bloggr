import { cookies } from "next/headers";

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

export async function getHomePageData(): Promise<ApiResponse | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    //  || "http://localhost:5050";

    const response = await fetch(`${apiUrl}/`, {
      headers: {
        ...(token && { Cookie: `token=${token}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { isLoggedIn: false, user: null };
  }
}
