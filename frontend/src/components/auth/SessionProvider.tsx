"use client";

import { createContext, useContext, ReactNode } from "react";
import { ApiResponse } from "@/lib/api";

// Create the Context
const SessionContext = createContext<ApiResponse | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: ApiResponse | null;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

// 2. Export the custom hook
export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
