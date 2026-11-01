"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { navigation } from "@/lib/site";

export function Navigation({ logoUrl, brandName, menuCredit }: { logoUrl: string; brandName: string; menuCredit: { poweredBy: string; developer: string; buttonLabel: string; buttonUrl: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["Operations"]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      document.body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function toggleGroup(label: string) {
    setExpanded((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand-lockup" href="/" aria-label="All Nippon Virtual Group home">
          <img src={logoUrl} alt="ANVG logo" className="brand-logo" />
          <span className="brand-copy">
            <strong>ANVG</strong>
            <span>{brandName}</span>
          </span>
        </Link>
        <div className="header-side">
          <span className="header-status"><span className="status-dot" /> WAYPOINTS COMMUNITY</span>
          <button
            type="button"
            className="menu-trigger"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="anvg-navigation-panel"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>

      <div
        className={`nav-scrim ${open ? "is-visible" : ""}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <aside
        id="anvg-navigation-panel"
        className={`navigation-panel ${open ? "is-open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="panel-heading">
          <div>
            <span className="eyebrow">FLIGHT DECK</span>
            <h2>Navigation</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button"
            aria-label="Close navigation panel"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="panel-nav">
          {navigation.map((item) => {
            if (item.href) {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nav-primary ${active ? "is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span>{item.label}</span>
                  {active ? <span className="active-marker" /> : <ArrowUpRight size={15} />}
                </Link>
              );
            }

            const groupOpen = expanded.includes(item.label);
            const groupActive = item.children?.some((child) => isActive(child.href)) ?? false;
            return (
              <section className="nav-group" key={item.label}>
                <button
                  type="button"
                  className={`nav-primary nav-group-toggle ${groupActive ? "is-active" : ""}`}
                  aria-expanded={groupOpen}
                  onClick={() => toggleGroup(item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown className={groupOpen ? "chevron-open" : ""} size={17} />
                </button>
                <div className={`nav-subitems ${groupOpen ? "is-expanded" : ""}`}>
                  {item.children?.map((child) => {
                    const active = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`nav-secondary ${active ? "is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                        tabIndex={groupOpen ? 0 : -1}
                        onClick={() => setOpen(false)}
                      >
                        <span className="subitem-line" />
                        {child.label}
                        {active ? <span className="active-marker" /> : null}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </nav>

        <div className="menu-credit">
          <span className="menu-credit-label">{menuCredit.poweredBy}</span>
          <div className="developer-credit">
            <span>Developed By</span>
            <strong>{menuCredit.developer}</strong>
          </div>
          {menuCredit.buttonUrl ? (
            <a
              className="menu-credit-button"
              href={menuCredit.buttonUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {menuCredit.buttonLabel}
              <ArrowUpRight size={15} />
            </a>
          ) : (
            <span className="menu-credit-button is-disabled" aria-disabled="true">
              {menuCredit.buttonLabel}
              <ArrowUpRight size={15} />
            </span>
          )}
        </div>
      </aside>
    </>
  );
}
