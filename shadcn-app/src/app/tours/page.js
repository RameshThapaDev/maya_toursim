import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import SectionHeader from "@/components/SectionHeader";

export const metadata = {
  title: "Tours | Himalayan Bliss Tours",
  description: "Browse curated Bhutan tour packages."
};

export default function ToursPage() {
  return (
    <section className="container-safe space-y-8 py-12">
      <SectionHeader
        eyebrow="Tours"
        title="Curated Bhutan tours for every travel style"
        description="Filter by interest, duration, and pace with handcrafted itineraries."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </section>
  );
}
