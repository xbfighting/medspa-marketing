'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ToastProvider } from "@/components/providers/toast-provider";
import { GlobalShortcuts } from "@/components/layout/global-shortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is login
  const isLoginPage = pathname === '/login';

  // If login page, render without layout
  if (isLoginPage) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <ToastProvider />
        </body>
      </html>
    );
  }

  // Normal layout with sidebar and header
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <Sidebar />
          </div>

          {/* Mobile Navigation */}
          <MobileNav 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        <ToastProvider />
        <GlobalShortcuts />
      </body>
    </html>
  );
}