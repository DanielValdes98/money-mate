import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Display } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansDisplay = Noto_Sans_Display({
  variable: "--font-noto-sans-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoneyMate",
  description: "Gestión de finanzas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
    //   <html lang="es">
    //     <body>
    //       <SignedOut>
    //         <SignInButton />
    //       </SignedOut>
    //       <SignedIn>
    //         <UserButton />
    //       </SignedIn>
    //       {children}
    //     </body>
    //   </html>
    // </ClerkProvider>

    <ClerkProvider>
    <html lang="en">
      <body>{children}</body>
    </html>
    </ClerkProvider>
  )
}