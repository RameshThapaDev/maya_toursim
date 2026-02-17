import { notFound } from "next/navigation";
import SiteLayout from "../../components/SiteLayout";
import TourDetail from "../../components/TourDetail";
import { getTourBySlugWithFallback } from "../../lib/tours";
import { hotels } from "../../data/hotels";
import { guides } from "../../data/guides";
import { vehicles } from "../../data/vehicles";

export async function generateMetadata({ params }) {
  const tour = await getTourBySlugWithFallback(params.slug);
  if (!tour) {
    return {
      title: "Tour not found | Maya Bliss Tours"
    };
  }
  return {
    title: `${tour.title} | Maya Bliss Tours`,
    description: tour.summary
  };
}

export default async function TourDetailPage({ params }) {
  const tour = await getTourBySlugWithFallback(params.slug);

  if (!tour) {
    notFound();
  }

  return (
    <SiteLayout>
      <TourDetail tour={tour} hotels={hotels} guides={guides} vehicles={vehicles} />
    </SiteLayout>
  );
}
