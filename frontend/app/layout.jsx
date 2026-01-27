import "./globals.css";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Water Quality Monitoring Dashboard",
  description: "IoT water quality monitoring system for wells and deep reservoirs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}

