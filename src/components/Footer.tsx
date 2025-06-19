"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const Footer = ({ isFullWidth }: { isFullWidth: boolean }) => {
  const links = [
    {
      label: "Twitter",
      href: "https://x.com/gauravnadkarni",
      icon: (
        <FontAwesomeIcon icon={faXTwitter} size="lg" className="text-current" />
      ),
    },
  ];
  const footerTranslations = useTranslations("landingPage.footer");
  return (
    <footer className="w-full border-t border-border border-secondary mt-auto">
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          isFullWidth && "w-full",
          !isFullWidth && "max-w-6xl"
        )}
      >
        <div className="flex items-center justify-between h-16">
          <div className="text-sm text-muted-foreground">
            {footerTranslations("copyright", {
              year: new Date().getFullYear(),
            })}
          </div>
          <div className="flex items-center space-x-4">
            {links.length > 0 &&
              links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
