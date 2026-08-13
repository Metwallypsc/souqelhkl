import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سوق الحقل",
  description: "سوق زراعي متعدد البائعين في مصر",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
