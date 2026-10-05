import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "EduPortal Academy - Excellence in Education",
  description:
    "EduPortal Academy is a leading educational institution offering quality programs in various disciplines. Apply now for admission.",
  keywords: "education, university, college, school, admission, courses, programs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Inter – clean & modern */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-slate-800 antialiased min-h-screen">
        <LoadingScreen />
        {children}
        <AccessibilityPanel />
      </body>
    </html>
  );
}
