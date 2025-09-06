export const apiFetcher = async (path: string, options: RequestInit = {}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const URL = `${apiUrl}${path}`;

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const authToken = cookies().get("token")?.value;
    const anonToken = cookies().get("anon_user_token")?.value;
    const token = authToken || anonToken;
    if (token) {
      options.headers = { ...options.headers, Cookie: `token=${token}` };
    }
    console.log("ssr");
    console.log(token);
  } else {
    options.credentials = "include";
    console.log("csr");
  }

  return fetch(URL, options);
};
