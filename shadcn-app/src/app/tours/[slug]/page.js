import { notFound } from "next/navigation";
import { tours } from "@/data/tours";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TourDetailPage({ params }) {
  const tour = tours.find((item) => item.slug === params.slug);
  if (!tour) return notFound();

  return (
    <section className="container-safe space-y-10 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{tour.durationDays} days</Badge>
            <Badge variant="outline">{tour.difficulty}</Badge>
            {tour.theme.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-semibold">{tour.title}</h1>
          <p className="text-muted-foreground">{tour.summary}</p>
          <Button size="lg">Start booking</Button>
        </div>
        <div className="rounded-3xl border border-border bg-white p-3 shadow-soft">
          <img src={tour.image} alt={tour.title} className="h-80 w-full rounded-2xl object-cover" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-muted-foreground">{tour.overview}</p>
          <h3 className="text-xl font-semibold">Itinerary</h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            {tour.itinerary.map((item, index) => (
              <li key={item} className="rounded-lg border border-border bg-white px-4 py-3">
                <span className="font-semibold text-foreground">Day {index + 1}:</span> {item}
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-4 rounded-2xl border border-border bg-muted p-6">
          <h3 className="text-xl font-semibold">What’s included</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Boutique stays & breakfast</li>
            <li>• Private guide + driver</li>
            <li>• All permits & transfers</li>
            <li>• Cultural immersion sessions</li>
          </ul>
          <h3 className="text-xl font-semibold">Need help?</h3>
          <p className="text-sm text-muted-foreground">
            Chat with our Bhutan experts to tailor this itinerary to your preferences.
          </p>
          <Button variant="outline">Talk to an expert</Button>
        </div>
      </div>
    </section>
  );
}
