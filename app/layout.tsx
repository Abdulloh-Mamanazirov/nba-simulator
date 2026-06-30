import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neurochemical Bandwidth Audit",
  description:
    "A diagnostic tool that maps your daily habits onto 12 neurochemical systems, reveals how many you've neglected, and generates a personalized prescription to expand your range.",
  keywords: [
    "neurochemistry",
    "self-assessment",
    "dopamine",
    "cortisol",
    "bandwidth",
    "brain health",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
