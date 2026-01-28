import "./globals.css";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { AppearanceProvider } from "@/contexts/AppearanceContext";

export const metadata = {
  title: "Water Quality Monitoring Dashboard",
  description: "IoT water quality monitoring system for wells and deep reservoirs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <AppearanceProvider>
            <Layout>{children}</Layout>
          </AppearanceProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

