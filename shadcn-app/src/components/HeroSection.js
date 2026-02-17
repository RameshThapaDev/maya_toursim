import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(60,95,78,0.25),_transparent_55%)]" />
      <div className="container-safe relative grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge>Bhutan Travel Specialists</Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Curated Bhutan journeys with soul, comfort, and authenticity.
          </h1>
          <p className="text-lg text-muted-foreground">
            Himalayan Bliss Tours designs mindful itineraries across Paro, Thimphu, Punakha, and Bumthang with
            boutique stays, private guides, and seamless logistics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Explore tours</Button>
            <Button variant="outline" size="lg">
              Design a custom trip
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">4.9/5</p>
              <p>Traveler satisfaction</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">15+</p>
              <p>Handpicked journeys</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">24/7</p>
              <p>Local concierge</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-3xl border border-border bg-white p-3 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
              alt="Bhutan landscape"
              className="h-[360px] w-full rounded-2xl object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-4 shadow-soft">
            <p className="text-sm font-semibold">Upcoming festival</p>
            <p className="text-xs text-muted-foreground">Paro Tsechu · April</p>
          </div>
        </div>
      </div>
    </section>
  );
}
