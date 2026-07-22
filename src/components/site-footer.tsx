export default function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto max-w-3xl px-6 py-6 text-sm text-foreground/60">
        &copy; {new Date().getFullYear()} Hugo Moen
      </div>
    </footer>
  );
}
