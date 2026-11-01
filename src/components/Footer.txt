import { ArrowUpRight, Youtube } from "lucide-react";
import type { GlobalSiteSettings } from "@/components/PublicLayout";
import { safeExternalUrl } from "@/lib/urls";

type FooterProps = { currentPath: string; logoUrl: string; settings: GlobalSiteSettings };

export function Footer({ currentPath, logoUrl, settings }: FooterProps) {
  const links = [
    { label: "Waypoints Portal", href: safeExternalUrl(settings.footer_waypoints_url) },
    { label: "Instagram", href: safeExternalUrl(settings.footer_instagram_url) },
    { label: "YouTube", href: safeExternalUrl(settings.footer_youtube_url) },
    { label: "VK", href: safeExternalUrl(settings.footer_vk_url) },
  ].filter((item) => item.href.length > 0);

  return (
    <footer className="site-footer" data-current-path={currentPath}>
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logoUrl} alt="ANVG logo" />
          <div>
            <strong>{settings.site_name.toUpperCase()}</strong>
            <span>OFFICIAL COMMUNITY AIRLINE ON WAYPOINTS</span>
          </div>
        </div>
        <div className="footer-community">
          <span className="eyebrow">COMMUNITY</span>
          <div className="community-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer noopener">
                {link.label === "YouTube" ? <Youtube size={15} /> : null}
                {link.label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 All Nippon Virtual Group — Official Community Airline on Waypoints</p>
        <p className="footer-disclaimer">{settings.footer_disclaimer}</p>
        <div className="regional-credit"><span />{settings.footer_regional_credit}</div>
      </div>
    </footer>
  );
}
