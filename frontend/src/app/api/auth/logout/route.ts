import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("--- LOGOUT API ROUTE: START ---");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log(
      "LOGOUT API ROUTE: No token found. Deleting just in case and exiting."
    );
    cookieStore.delete("token");
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "No token found, cleared locally." });
  }

  try {
    console.log("LOGOUT API ROUTE: Token found. Calling backend API...");
    const response = await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        "LOGOUT API ROUTE: Backend logout failed with status:",
        response.status
      );
    } else {
      console.log("LOGOUT API ROUTE: Backend logout successful.");
    }

    console.log("LOGOUT API ROUTE: Deleting cookie from browser.");
    cookieStore.delete("token");

    console.log("LOGOUT API ROUTE: Revalidating path '/' cache.");
    revalidatePath("/", "layout");

    console.log("--- LOGOUT API ROUTE: END ---");
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("LOGOUT API ROUTE: Uncaught error:", error);
    cookieStore.delete("token");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
