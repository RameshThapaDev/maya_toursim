import { notFound } from "next/navigation";
import SiteLayout from "../../components/SiteLayout";
import { getPool } from "../../lib/db";
import {
  Badge,
  Box,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";

function getQrUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data)}`;
}

export async function generateMetadata({ params }) {
  const pool = getPool();
  const result = await pool.query("SELECT name, description FROM destinations WHERE slug = $1", [params.slug]);
  const destination = result.rows[0];
  if (!destination) {
    return { title: "Destination not found | Maya Bliss Tours" };
  }
  return {
    title: `${destination.name} | Maya Bliss Tours`,
    description: destination.description
  };
}

export default async function DestinationDetailPage({ params }) {
  const pool = getPool();
  const result = await pool.query("SELECT * FROM destinations WHERE slug = $1", [params.slug]);
  const place = result.rows[0];
  const sitesResult = await pool.query(
    "SELECT * FROM tourist_sites WHERE destination_slug = $1 ORDER BY created_at DESC",
    [params.slug]
  );

  if (!place) {
    notFound();
  }

  const highlights = Array.isArray(place.highlights) ? place.highlights : [];
  const sites = sitesResult.rows || [];
  const accommodations = Array.isArray(place.accommodations) ? place.accommodations : [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8080";
  const destinationUrl = `${baseUrl}/destinations/${place.slug}`;

  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <Stack spacing={8}>
            <Box borderRadius="2xl" overflow="hidden">
              <Image src={place.image} alt={place.name} h={{ base: "220px", md: "360px" }} w="100%" objectFit="cover" />
            </Box>

            <Stack spacing={4}>
              <Badge colorScheme="green" alignSelf="flex-start">
                Best time: {place.best_time || place.bestTime}
              </Badge>
              <Heading fontFamily="heading" size="2xl">
                {place.name}
              </Heading>
              <Text color="blackAlpha.700">{place.description}</Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
                <Heading size="md" mb={3} fontFamily="heading">
                  Highlights
                </Heading>
                <Stack spacing={2}>
                  {highlights.map((item) => (
                    <Text key={item}>• {item}</Text>
                  ))}
                </Stack>
              </Box>
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
                <Heading size="md" mb={3} fontFamily="heading">
                  Weather & seasons
                </Heading>
                {place.weather_info && <Text color="blackAlpha.700">{place.weather_info}</Text>}
                {place.seasonal_info && <Text color="blackAlpha.700">{place.seasonal_info}</Text>}
              </Box>
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
                <Heading size="md" mb={3} fontFamily="heading">
                  Travel tips
                </Heading>
                {place.travel_tips && <Text color="blackAlpha.700">{place.travel_tips}</Text>}
              </Box>
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
                <Heading size="md" mb={3} fontFamily="heading">
                  Transport
                </Heading>
                {place.transport_info && <Text color="blackAlpha.700">{place.transport_info}</Text>}
              </Box>
            </SimpleGrid>

            {accommodations.length > 0 && (
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
                <Heading size="md" mb={3} fontFamily="heading">
                  Accommodation listings
                </Heading>
                <Stack spacing={2}>
                  {accommodations.map((item) => (
                    <Text key={item}>• {item}</Text>
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Heading size="lg" mb={4} fontFamily="heading">
                QR codes for tourist sites
              </Heading>
              <Text color="blackAlpha.700" mb={4}>
                Scan a site QR to open details and travel tips for that place.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {(sites.length ? sites : highlights.map((item, index) => ({
                  name: item,
                  qr_data: `${destinationUrl}?site=${index + 1}`
                }))).map((item) => (
                  <Box
                    key={item.name}
                    bg="white"
                    borderRadius="2xl"
                    p={4}
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="blackAlpha.100"
                  >
                    <Text fontWeight="600" mb={2}>
                      {item.name}
                    </Text>
                    <Image
                      src={getQrUrl(item.qr_data || destinationUrl)}
                      alt={`QR for ${item.name}`}
                      boxSize="160px"
                      objectFit="cover"
                      borderRadius="lg"
                    />
                    {item.details && (
                      <Text fontSize="sm" color="blackAlpha.700" mt={3}>
                        {item.details}
                      </Text>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        </Container>
      </Box>
    </SiteLayout>
  );
}
