import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from 'next/headers';
import { TinybirdProvider } from "./providers/TinybirdProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const headersList = await headers();
  const token = headersList.get('x-tinybird-token') || process.env.NEXT_PUBLIC_TINYBIRD_API_KEY || '';
  const orgName = headersList.get('x-org-name') || '';

  // If Clerk is not configured, render without ClerkProvider
  if (!publishableKey) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <TinybirdProvider initialToken={token} initialOrgName={orgName}>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </TinybirdProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider publishableKey={publishableKey}>
          <TinybirdProvider initialToken={token} initialOrgName={orgName}>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </TinybirdProvider>
        </ClerkProvider>
      </body>
    </html>
  );
} 