"use client";

import {
  Badge,
  Box,
  Container,
  Divider,
  Heading,
  ListItem,
  Image,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  Button
} from "@chakra-ui/react";
import InquiryForm from "./InquiryForm";
import ReviewSection from "./reviews/ReviewSection";
import NextLink from "next/link";

const monasteryVideoPreviews = [
  {
    name: "Taktsang (Tiger’s Nest)",
    destinationSlug: "paro",
    description: "Watch a short preview of the cliffside monastery and its legend.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    name: "Punakha Dzong",
    destinationSlug: "punakha",
    description: "See the riverside dzong with a cinematic walkthrough.",
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=900&q=80",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    name: "Tashichho Dzong",
    destinationSlug: "thimphu",
    description: "Preview the seat of Bhutan’s government and monastic body.",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=80",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  }
];

const getQrUrl = (data) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data)}`;

export default function TourDetail({ tour, hotels, guides, vehicles }) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8080";

  return (
    <Box py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack spacing={10}>
          <Box>
            <Stack spacing={3}>
              <Box borderRadius="2xl" overflow="hidden">
                <Image src={tour.image} alt={tour.title} objectFit="cover" w="100%" h={{ base: "220px", md: "320px" }} />
              </Box>
              <Badge colorScheme="green" alignSelf="flex-start">
                {tour.durationDays} days
              </Badge>
              <Heading fontFamily="heading" size="2xl">
                {tour.title}
              </Heading>
              <Text color="blackAlpha.700">{tour.summary}</Text>
              <Stack direction={{ base: "column", md: "row" }} spacing={3}>
                {tour.theme.map((item) => (
                  <Badge key={item} colorScheme="green" variant="outline">
                    {item}
                  </Badge>
                ))}
                <Badge colorScheme="orange" variant="subtle">
                  {tour.difficulty}
                </Badge>
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Heading size="lg" mb={3} fontFamily="heading">
              Overview
            </Heading>
            <Text>{tour.overview}</Text>
          </Box>

          {tour.videoUrl && (
            <Box>
              <Heading size="lg" mb={4} fontFamily="heading">
                Tour video preview
              </Heading>
              <Box borderRadius="2xl" overflow="hidden" border="1px solid" borderColor="blackAlpha.200" bg="white">
                <video
                  src={tour.videoUrl}
                  controls
                  poster={tour.image}
                  style={{ width: "100%", height: "360px", objectFit: "cover" }}
                />
              </Box>
            </Box>
          )}

          <Box>
            <Heading size="lg" mb={4} fontFamily="heading">
              Monastery video previews
            </Heading>
            <Text color="blackAlpha.700" mb={4}>
              Watch a short preview or scan the QR code to open the destination details.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {monasteryVideoPreviews.map((item) => {
                const destinationUrl = `${baseUrl}/destinations/${item.destinationSlug}`;
                return (
                  <Box key={item.name} borderRadius="2xl" overflow="hidden" bg="white" boxShadow="sm">
                    <Box position="relative">
                      <Image src={item.image} alt={item.name} h="160px" w="100%" objectFit="cover" />
                      <Box position="absolute" inset="0" bg="blackAlpha.300" />
                    </Box>
                    <Box p={4}>
                      <Heading size="sm" mb={1}>
                        {item.name}
                      </Heading>
                      <Text fontSize="sm" color="blackAlpha.700" mb={3}>
                        {item.description}
                      </Text>
                      <Box mb={3} borderRadius="lg" overflow="hidden" border="1px solid" borderColor="blackAlpha.200">
                        <video
                          src={item.video}
                          poster={item.image}
                          controls
                          style={{ width: "100%", height: "160px", objectFit: "cover" }}
                        />
                      </Box>
                      <Stack direction="row" spacing={3} align="center" justify="space-between">
                        <Image
                          src={getQrUrl(destinationUrl)}
                          alt={`QR for ${item.name}`}
                          boxSize="88px"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="blackAlpha.200"
                        />
                        <Button as={NextLink} href={`/destinations/${item.destinationSlug}`} size="sm" variant="outline">
                          View destination
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>

          <Box>
            <Heading size="lg" mb={4} fontFamily="heading">
              Itinerary
            </Heading>
            <Stack spacing={4}>
              {tour.itinerary.map((item) => (
                <Box key={item.day} p={4} borderRadius="xl" bg="white" boxShadow="sm">
                  <Text fontWeight="600">
                    {item.day} · {item.title}
                  </Text>
                  <Text fontSize="sm" color="blackAlpha.700">
                    {item.detail}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Heading size="md" mb={3} fontFamily="heading">
                Inclusions
              </Heading>
              <UnorderedList spacing={2} pl={4}>
                {tour.inclusions.map((item) => (
                  <ListItem key={item}>{item}</ListItem>
                ))}
              </UnorderedList>
            </Box>
            <Box>
              <Heading size="md" mb={3} fontFamily="heading">
                Exclusions
              </Heading>
              <UnorderedList spacing={2} pl={4}>
                {tour.exclusions.map((item) => (
                  <ListItem key={item}>{item}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          </SimpleGrid>

          <Box>
            <Heading size="lg" mb={3} fontFamily="heading">
              FAQ
            </Heading>
            <Stack spacing={4}>
              {tour.faq.map((item) => (
                <Box key={item.question} p={4} borderRadius="xl" bg="white" boxShadow="sm">
                  <Text fontWeight="600">{item.question}</Text>
                  <Text fontSize="sm" color="blackAlpha.700">
                    {item.answer}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Heading size="lg" mb={4} fontFamily="heading">
              Booking inquiry
            </Heading>
            <InquiryForm tourName={tour.title} hotels={hotels} guides={guides} vehicles={vehicles} />
          </Box>

          <Box>
            <Heading size="lg" mb={4} fontFamily="heading">
              Tour reviews
            </Heading>
            <ReviewSection targetType="tour" targetSlug={tour.slug} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
