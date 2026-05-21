import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";
import { globalKeywords, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const sans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "BAKSAL BEAUTY Plastic Surgery",
  description:
    "개인별 구조 진단, 자연스러운 변화, 회복 중심 케어를 안내하는 프리미엄 성형외과 미용의학 브랜드입니다.",
  keywords: globalKeywords,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: "LUDGI Inc.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName,
    title: "BAKSAL BEAUTY Plastic Surgery",
    description:
      "Structure-led aesthetic consultation, refined plastic surgery planning, and recovery-aware care.",
    url: "/ko",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BAKSAL BEAUTY Plastic Surgery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAKSAL BEAUTY Plastic Surgery",
    description:
      "Structure-led aesthetic consultation, refined plastic surgery planning, and recovery-aware care.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${sans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
