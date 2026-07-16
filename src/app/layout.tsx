import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ApiInterceptors } from "@/providers/api-interceptors";
import type { Metadata } from "next"
import "./globals.css";

export const metadata: Metadata = {
  title: "Joenize",
  description: "Building formidable digital earnings.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ApiInterceptors />
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
