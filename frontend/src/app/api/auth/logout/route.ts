import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    cookieStore.delete("token");
    return NextResponse.json({ message: "No token found, cleared locally." });
  }

  try {
    const response = await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok) {
      console.error("Backend logout failed:", await response.text());
    }

    revalidatePath("/", "layout");
    cookieStore.delete("token");

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout API route error:", error);
    cookieStore.delete("token");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
