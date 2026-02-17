import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DestinationCard({ destination }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={destination.image} alt={destination.name} className="h-44 w-full object-cover" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{destination.name}</h3>
          <p className="text-sm text-muted-foreground">{destination.description}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Best time:</span> {destination.bestTime}
          </p>
          <p>
            <span className="font-semibold text-foreground">Highlight:</span> {destination.highlights[0]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
