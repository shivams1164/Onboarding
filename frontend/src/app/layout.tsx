import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HRMS - Employee Management System",
  description: "Modern Employee Management System UI with enterprise HRMS look",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
