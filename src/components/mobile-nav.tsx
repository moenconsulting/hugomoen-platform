"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/artikler", label: "Artikler" },
  { href: "/frameworks", label: "Rammeverk" },
  { href: "/emner", label: "Emner" },
  { href: "/om", label: "Om" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Lukk meny" : "Åpne meny"}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-foreground/5 transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          className="transition-transform duration-200"
        >
          {open ? (
            <>
              <line x1="4" y1="4" x2="14" y2="14" />
              <line x1="14" y1="4" x2="4" y2="14" />
            </>
          ) : (
            <>
              <line x1="2" y1="5" x2="16" y2="5" />
              <line x1="2" y1="9" x2="16" y2="9" />
              <line x1="2" y1="13" x2="16" y2="13" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-[57px] z-40 bg-background/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={close}
          />
          <div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigasjon"
            className="fixed inset-x-0 top-[57px] z-50 border-b border-foreground/10 bg-background px-6 pb-6 pt-4"
          >
            <nav>
              <ul className="flex flex-col gap-1">
                {links.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block rounded-md px-3 py-2.5 text-base transition-colors ${
                          active
                            ? "bg-foreground/5 font-medium"
                            : "hover:bg-foreground/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
