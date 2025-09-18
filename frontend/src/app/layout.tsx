import type { Metadata } from "next";
import { ApiResponse, handleLoggedInUserData } from "@/lib/api";
import { Noto_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "@/components/auth/SessionProvider";

const notoSans = Noto_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloggr",
  description: "Social media for blogging",
  icons: {
    icon: "/bloggr.svg",
  },
};

export interface LoggedInUserData {
  isLoggedIn: boolean;
  user: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarURL?: string;
    bio?: string;
    fullName: string;
    role: string;
  } | null;
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data: ApiResponse | null = await handleLoggedInUserData();

  const navbarData: ApiResponse = data || {
    isLoggedIn: false,
    user: null,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.className} antialiased  dark:bg-[#121212]`}>
        <SessionProvider session={navbarData}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="md:px-10 px-5 py-5 sticky top-0 z-50 backdrop-blur-sm ">
              <Navbar />
            </header>{" "}
            <Theme accentColor="gray">{children}</Theme>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
