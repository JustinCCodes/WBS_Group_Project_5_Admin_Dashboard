import type { Metadata } from "next";
import "./globals.css";
import { TokenInitializer } from "@/src/shared/components/TokenInitializer";
import { ThemeProvider } from "@/src/shared/context/ThemeContext";
import { ThemeToggle } from "@/src/shared/components/ThemeToggle";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "E-commerce Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Set initial theme before hydration to prevent flash of unstyled content (funny name for that lol)
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('admin-theme');
                  const theme = savedTheme || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased transition-colors duration-300 bg-linear-to-br from-gray-300 via-gray-200 to-amber-100 dark:from-gray-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white min-h-screen">
        <ThemeProvider>
          {/* Static gradient overlay */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-yellow-500/5 dark:from-amber-900/10 dark:via-transparent dark:to-yellow-900/10" />
          </div>

          <TokenInitializer />
          <ThemeToggle />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--toast-bg)",
                color: "var(--toast-color)",
                border: "1px solid var(--toast-border)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
