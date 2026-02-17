import SectionHeader from "@/components/SectionHeader";

export const metadata = {
  title: "About | Himalayan Bliss Tours",
  description: "Learn about our Bhutan travel philosophy."
};

export default function AboutPage() {
  return (
    <section className="container-safe space-y-8 py-12">
      <SectionHeader
        eyebrow="Our story"
        title="Travel crafted with care, culture, and community."
        description="We partner with local communities to deliver thoughtful, low-impact journeys across Bhutan."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="text-xl font-semibold">Mission</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            We design journeys that honor Bhutanese heritage, support local livelihoods, and nurture mindful
            travel experiences.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="text-xl font-semibold">Eco-tourism</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Our itineraries prioritize sustainable stays, low-impact activities, and cultural preservation.
          </p>
        </div>
      </div>
    </section>
  );
}
