import ToursPage from "../components/ToursPage";
import { getToursWithFallback } from "../lib/tours";

export const metadata = {
  title: "Bhutan Tours | Maya Bliss Tours",
  description:
    "Browse curated Bhutan tours filtered by duration, theme, and difficulty."
};

export default async function Page() {
  const tours = await getToursWithFallback();
  return <ToursPage tours={tours} />;
}
