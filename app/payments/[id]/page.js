import SiteLayout from "../../components/SiteLayout";
import { getUserFromToken } from "../../lib/auth";
import { getPool } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import { buildQuoteForInquiry } from "../../lib/billing";
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import PaymentClient from "./PaymentClient";

export const metadata = {
  title: "Complete Payment | Maya Bliss Tours"
};

export default async function PaymentPage({ params }) {
  const user = getUserFromToken();
  const session = await getServerSession(authOptions);
  if (!user && !session?.user) {
    redirect("/login");
  }

  const pool = getPool();
  const inquiryResult = await pool.query(
    "SELECT id, status, tour_name, travel_date FROM booking_inquiries WHERE id = $1",
    [params.id]
  );
  const inquiry = inquiryResult.rows[0];
  if (!inquiry) {
    redirect("/");
  }

  const quote = await buildQuoteForInquiry(params.id);

  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="4xl">
          <Stack spacing={6}>
            <Heading fontFamily="heading" size="xl">
              Complete payment
            </Heading>
            <Text color="blackAlpha.700">
              Booking: {inquiry.tour_name || "Custom itinerary"} · {inquiry.travel_date}
            </Text>

            {inquiry.status !== "confirmed" && (
              <Box bg="yellow.50" borderRadius="xl" p={4}>
                <Text>
                  Your booking is not confirmed yet. Payment will be available once the status is confirmed.
                </Text>
              </Box>
            )}

            {quote && (
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
                <Heading size="md" mb={4} fontFamily="heading">
                  Charge breakdown
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  {quote.breakdown.map((item) => (
                    <Box key={item.label} border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={3}>
                      <Text fontWeight="600">{item.label}</Text>
                      <Text fontSize="sm" color="blackAlpha.700">
                        USD {Number(item.amount).toFixed(2)}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
                <Text fontWeight="600" fontSize="lg" mt={4}>
                  Total: USD {Number(quote.total).toFixed(2)}
                </Text>
              </Box>
            )}

            <PaymentClient inquiryId={params.id} disabled={inquiry.status !== "confirmed"} />
          </Stack>
        </Container>
      </Box>
    </SiteLayout>
  );
}
