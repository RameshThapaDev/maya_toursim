import SectionHeader from "@/components/SectionHeader";

export const metadata = {
  title: "Travel Info | Himalayan Bliss Tours",
  description: "Visas, seasons, and travel tips for Bhutan."
};

export default function TravelInfoPage() {
  return (
    <section className="container-safe space-y-8 py-12">
      <SectionHeader
        eyebrow="Travel info"
        title="Everything you need before arriving in Bhutan"
        description="Visa guidance, seasons, packing tips, and customs."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Visa & permits",
            detail: "We arrange visas, permits, and licensed guides as part of your booking."
          },
          {
            title: "Best seasons",
            detail: "Spring and autumn are ideal; winter offers crisp skies and fewer crowds."
          },
          {
            title: "Packing tips",
            detail: "Bring layers, comfortable shoes, and modest attire for sacred sites."
          },
          {
            title: "Currency & customs",
            detail: "Ngultrum (BTN) is pegged to INR. Respect monastery etiquette and photography rules."
          }
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-white p-6">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
