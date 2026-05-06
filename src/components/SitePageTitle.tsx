import Link from "next/link";

type SitePageTitleProps = {
  /** Text after the linked brand, e.g. "Calendar" or "Standings" */
  pageLabel: string;
  className?: string;
};

export default function SitePageTitle({
  pageLabel,
  className = "text-2xl font-bold tracking-tight transition-colors duration-300 sm:text-4xl",
}: SitePageTitleProps) {
  return (
    <h1 className={className} style={{ color: "var(--text-primary)" }}>
      <Link
        href="/"
        className="rounded-sm transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
        style={{ color: "inherit", textDecoration: "none" }}
        aria-label="F1 2026 — go to calendar home"
      >
        F1 2026
      </Link>{" "}
      {pageLabel}
    </h1>
  );
}
