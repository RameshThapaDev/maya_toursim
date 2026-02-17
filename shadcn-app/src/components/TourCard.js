import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function TourCard({ tour }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={tour.image} alt={tour.title} className="h-48 w-full object-cover" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{tour.durationDays} days</Badge>
          <Badge variant="outline">{tour.difficulty}</Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{tour.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{tour.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tour.theme.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">From ${tour.price}</span>
          <Button size="sm" asChild>
            <Link href={`/tours/${tour.slug}`}>View tour</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
