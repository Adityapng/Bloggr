import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming Shadcn Button

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Go back to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
