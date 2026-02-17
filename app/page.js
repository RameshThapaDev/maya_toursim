import HomePage from "./components/HomePage";
import SiteLayout from "./components/SiteLayout";
import { getToursWithFallback } from "./lib/tours";

export const metadata = {
  title: "Maya Bliss Tours | Bhutan Travel Agency",
  description:
    "Curated Bhutan tours with local guides, cultural immersion, and mindful travel itineraries."
};

export default async function Page() {
  const tours = await getToursWithFallback();
  return (
    <SiteLayout>
      <HomePage tours={tours} />
    </SiteLayout>
  );
}
