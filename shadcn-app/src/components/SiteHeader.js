import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/travel-info", label: "Travel Info" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-safe flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Himalayan Bliss Tours
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Plan Your Trip
          </Button>
          <Button size="sm">Start Booking</Button>
        </div>
      </div>
    </header>
  );
}
