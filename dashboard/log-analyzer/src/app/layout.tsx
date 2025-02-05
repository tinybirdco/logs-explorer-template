import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Log Analyzer",
  description: "A dashboard for analyzing logs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 