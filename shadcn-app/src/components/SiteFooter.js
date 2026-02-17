export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-safe grid gap-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold">Himalayan Bliss Tours</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Curated Bhutan journeys with mindful travel, trusted partners, and local expertise.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Thimphu, Bhutan · +975 02 123 456 · hello@himalayanblisstours.com
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Bhutan Tourism Note</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Travel requires a visa and daily tariff. We handle permits, guides, and logistics end-to-end.
          </p>
        </div>
      </div>
    </footer>
  );
}
