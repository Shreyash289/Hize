import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IEEE CS SYP HIZE 2026 | High Impact Zonal Events",
    template: "%s | IEEE CS SYP HIZE 2026"
  },
  description: "Join IEEE Computer Society's flagship High Impact Zonal Events (HIZE) 2026 at SRM Institute. Experience innovation, technology, and academic excellence through hackathons, conferences, workshops, and networking opportunities.",
  keywords: [
    "IEEE Computer Society",
    "HIZE 2026",
    "High Impact Zonal Events",
    "SRM Institute",
    "Technology Conference",
    "Hackathon",
    "Tech Workshops",
    "Student Events",
    "Innovation",
    "Programming Contest",
    "Tech Talks",
    "Networking"
  ],
  authors: [{ name: "IEEE Computer Society SRM" }],
  creator: "IEEE Computer Society SRM",
  publisher: "IEEE Computer Society",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ieeecshize.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ieeecshize.com",
    title: "IEEE CS SYP HIZE 2026 | High Impact Zonal Events",
    description: "Join IEEE Computer Society's flagship High Impact Zonal Events (HIZE) 2026. Experience innovation, technology, and academic excellence.",
    siteName: "IEEE CS SYP HIZE 2026",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IEEE CS SYP HIZE 2026 - High Impact Zonal Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE CS SYP HIZE 2026 | High Impact Zonal Events",
    description: "Join IEEE Computer Society's flagship High Impact Zonal Events (HIZE) 2026. Experience innovation, technology, and academic excellence.",
    images: ["/og-image.jpg"],
    creator: "@ieeecs_srm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // For iPhone X+ safe areas
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ff8c42" },
    { media: "(prefers-color-scheme: dark)", color: "#ff8c42" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preload" href="/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/data/speakers.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/data/events.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/data/student-team.json" as="fetch" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased safe-area-inset" suppressHydrationWarning>
        <div className="min-h-screen min-h-[100dvh] bg-black" style={{ contentVisibility: 'auto' }}>
          {children}
        </div>
      </body>
    </html>
  );
}