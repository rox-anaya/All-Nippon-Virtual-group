import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./site.css";

export const metadata: Metadata = {
  title: {
    default: "All Nippon Virtual Group | Fly Beyond Borders",
    template: "%s | ANVG",
  },
  description:
    "All Nippon Virtual Group — an independent virtual aviation community operating on Waypoints.",
  applicationName: "All Nippon Virtual Group",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/anvg-mark.svg",
    apple: "/anvg-mark.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#071426",
  width: "device-width",
  initialScale: 1,
};

const preferenceBootstrap = `(()=>{try{const p=JSON.parse(localStorage.getItem('anvg-preferences')||'{}');if(p.theme)document.documentElement.dataset.theme=p.theme;if(p.font)document.documentElement.dataset.font=p.font;}catch(_){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="midnight-aviation" data-font="inter" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: preferenceBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
