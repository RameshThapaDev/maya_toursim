import HeroSection from "@/components/HeroSection";
import SectionHeader from "@/components/SectionHeader";
import TourCard from "@/components/TourCard";
import DestinationCard from "@/components/DestinationCard";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="container-safe space-y-8 py-14">
        <SectionHeader
          eyebrow="Featured tours"
          title="Handcrafted journeys across Bhutan’s valleys"
          description="Choose from curated itineraries designed by local experts."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-safe grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Why Bhutan"
              title="A journey into living heritage and mindful landscapes"
              description="Bhutan blends sacred monasteries, pristine nature, and a philosophy of Gross National Happiness."
            />
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Boutique lodges, farm stays, and wellness sanctuaries.</li>
              <li>• Private guide and driver for seamless, safe travel.</li>
              <li>• Curated rituals, festivals, and cultural immersion.</li>
            </ul>
            <Button variant="outline">Learn about travel logistics</Button>
          </div>
          <div className="rounded-3xl border border-border bg-muted p-6 shadow-soft">
            <div className="space-y-4 rounded-2xl bg-white p-6">
              <Badge variant="solid">Traveler stories</Badge>
              <p className="text-lg font-semibold">
                “Every detail was taken care of. The guides were warm, professional, and the views were unreal.”
              </p>
              <p className="text-sm text-muted-foreground">— Maya L., Singapore</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-safe space-y-8 py-14">
        <SectionHeader
          eyebrow="Destinations"
          title="Explore Bhutan’s most beloved valleys"
          description="Each destination is layered with history, culture, and Himalayan beauty."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-safe grid gap-6 md:grid-cols-3">
          {[
            { label: "Certified partners", value: "Bhutan Tourism Council" },
            { label: "Local guides", value: "100% Bhutanese expertise" },
            { label: "Support", value: "24/7 concierge on trip" }
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
