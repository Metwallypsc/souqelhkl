import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سوق الحقل",
  description: "سوق زراعي متعدد البائعين في مصر"
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
