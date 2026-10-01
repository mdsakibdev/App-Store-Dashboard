import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phone Store Admin",
  
  description: "Modern phone store management dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
