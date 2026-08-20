import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { APP_CONFIG } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} | ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    "Skill verification",
    "Proof of skill",
    "Developer assessment",
    "AI code review",
    "Technical hiring",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "LifeProof Team" }],
  metadataBase: new URL("https://lifeproof.dev"),
  openGraph: {
    title: `${APP_CONFIG.name} | ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    url: "https://lifeproof.dev",
    siteName: APP_CONFIG.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-background text-foreground bg-grid-pattern selection:bg-indigo-100 selection:text-indigo-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <AuthRequiredModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
