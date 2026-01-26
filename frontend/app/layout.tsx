import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Water Quality Monitoring Dashboard",
  description: "IoT water quality monitoring system for wells and deep reservoirs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

