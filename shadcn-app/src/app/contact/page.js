import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contact | Himalayan Bliss Tours",
  description: "Plan your Bhutan trip with our team."
};

export default function ContactPage() {
  return (
    <section className="container-safe space-y-8 py-12">
      <SectionHeader
        eyebrow="Plan your trip"
        title="Tell us about your Bhutan dream journey"
        description="We respond within 24 hours with a personalized proposal."
      />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-soft">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" />
          <Input placeholder="Travel dates" />
          <Textarea placeholder="Tell us about your interests and group size" />
          <Button>Send inquiry</Button>
        </form>
        <div className="space-y-4 rounded-2xl border border-border bg-muted p-6">
          <h3 className="text-xl font-semibold">Live chat & WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Message our concierge team for quick guidance on visas, SDF, and itineraries.
          </p>
          <Button variant="outline">Open WhatsApp</Button>
          <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Office hours</p>
            <p>Mon–Sat · 9:00 AM – 6:00 PM (Bhutan Time)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
