import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import SectionHeader from "@/components/SectionHeader";

export const metadata = {
  title: "Destinations | Himalayan Bliss Tours",
  description: "Explore Bhutan destinations and highlights."
};

export default function DestinationsPage() {
  return (
    <section className="container-safe space-y-8 py-12">
      <SectionHeader
        eyebrow="Destinations"
        title="Bhutan’s most inspiring valleys"
        description="Discover the heart of Bhutan with immersive stays and cultural highlights."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <DestinationCard key={destination.slug} destination={destination} />
        ))}
      </div>
    </section>
  );
}
