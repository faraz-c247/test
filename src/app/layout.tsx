import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { QueryProvider } from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";

// Import JWT blacklist manager for debugging (only in development)
if (process.env.NODE_ENV === "development") {
  import("@/lib/jwtBlacklist");
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentIntel - Property Management Platform",
  description: "Modern property management and rental intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
