import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-safe flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Page not found</p>
      <h1 className="text-3xl font-semibold">We can’t find that journey.</h1>
      <p className="text-sm text-muted-foreground">Try heading back to the homepage.</p>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </section>
  );
}
