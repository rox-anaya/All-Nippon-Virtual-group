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
        <script dangerouslySetInnerHTML={{ __html: preferenceBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
