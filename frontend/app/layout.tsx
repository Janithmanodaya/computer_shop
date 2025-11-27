import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "WD Computer",
  description: "Modern e-commerce for computer parts and PCs"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4">
          <header className="flex items-center justify-between py-4">
            <div className="text-xl font-semibold tracking-tight">
              WD Computer
            </div>
          </header>
          <main className="flex-1 py-4">{children}</main>
          <footer className="border-t border-slate-800 py-4 text-sm text-slate-400">
            &copy; {new Date().getFullYear()} WD Computer
          </footer>
        </div>
      </body>
    </html>
  );
}