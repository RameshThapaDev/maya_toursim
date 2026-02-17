"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Select,
  Input
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import NextLink from "next/link";

const testimonials = [
  {
    quote:
      "Every day felt intentional. Our guide transformed each monastery into a living story.",
    name: "Amelia R.",
    trip: "Happiness & Heritage"
  },
  {
    quote:
      "We wanted quiet, wonder, and real connection. Maya Bliss delivered all three.",
    name: "Vikram S.",
    trip: "Himalayan Slow Trail"
  }
];

const faqs = [
  {
    question: "Do I need a visa to visit Bhutan?",
    answer:
      "Yes. We handle visa processing once your itinerary is confirmed, including permits and guide assignments."
  },
  {
    question: "What is the best season to travel?",
    answer:
      "Spring (Mar–May) and autumn (Sep–Nov) offer clear skies, festivals, and comfortable temperatures."
  },
  {
    question: "Can the itinerary be customized?",
    answer:
      "Absolutely. Every journey is tailored to your pace, interests, and preferred accommodation style."
  }
];

export default function HomePage({ tours }) {
  const featured = tours.slice(0, 3);
  const [travelerType, setTravelerType] = useState("foreign");
  const [nights, setNights] = useState(3);
  const [people, setPeople] = useState(2);

  const rate = travelerType === "foreign" ? 100 : 1200;
  const currency = travelerType === "foreign" ? "USD" : "BTN";
  const total = useMemo(() => {
    const nightsNum = Number(nights) || 0;
    const peopleNum = Number(people) || 0;
    return rate * nightsNum * peopleNum;
  }, [rate, nights, people]);

  return (
    <Box>
      <Box py={{ base: 10, md: 16 }}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <Stack spacing={6}>
              <Text letterSpacing="0.3em" fontSize="xs" textTransform="uppercase" color="blackAlpha.600">
                Curated Bhutan Journeys
              </Text>
              <Heading fontFamily="heading" size="2xl">
                Travel softly, live fully, and meet Bhutan on its own terms.
              </Heading>
              <Text fontSize="lg" color="blackAlpha.700">
                Maya Bliss Tours crafts mindful itineraries across the Kingdom of Bhutan — from sacred
                monasteries to hidden valleys, guided by local hosts.
              </Text>
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as={NextLink}
                  href="/contact"
                  colorScheme="green"
                  bg="forest.600"
                  color="white"
                  borderRadius="full"
                >
                  Design My Journey
                </Button>
                <Button as={NextLink} href="/tours" variant="outline" borderRadius="full">
                  Explore Itineraries
                </Button>
              </HStack>
              <HStack spacing={8} color="forest.700">
                <Box>
                  <Heading size="md" fontFamily="heading">
                    4.9
                  </Heading>
                  <Text fontSize="sm">Guest rating</Text>
                </Box>
                <Box>
                  <Heading size="md" fontFamily="heading">
                    120+
                  </Heading>
                  <Text fontSize="sm">Curated departures</Text>
                </Box>
                <Box>
                  <Heading size="md" fontFamily="heading">
                    18
                  </Heading>
                  <Text fontSize="sm">Local specialists</Text>
                </Box>
              </HStack>
            </Stack>
            <Card borderRadius="2xl" bg="white" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100" overflow="hidden">
              <CardBody>
                <Stack spacing={6}>
                  <Box borderRadius="2xl" overflow="hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
                      alt="Bhutan landscape"
                      objectFit="cover"
                      w="100%"
                      h={{ base: "200px", md: "240px" }}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="blackAlpha.600">
                      Best season to travel
                    </Text>
                    <Heading size="lg" fontFamily="heading">
                      March – May
                    </Heading>
                    <Text fontSize="sm" color="blackAlpha.700">
                      Clear skies, flower valleys, vibrant festivals.
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="blackAlpha.600">
                      Private trips from
                    </Text>
                    <Heading size="lg" color="ember.500" fontFamily="heading">
                      $3,250
                    </Heading>
                    <Text fontSize="sm" color="blackAlpha.700">
                      All-inclusive with guide
                    </Text>
                  </Box>
                  <Button variant="solid" colorScheme="green" bg="forest.600" borderRadius="full" alignSelf="flex-start">
                    View pricing
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      <Box bg="white" py={{ base: 12, md: 16 }} mx={{ base: 4, md: 8 }} borderRadius="2xl" border="1px solid" borderColor="blackAlpha.100">
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box>
              <Heading fontFamily="heading" size="xl" mb={4}>
                Bhutan is measured in happiness, not haste.
              </Heading>
              <Text color="blackAlpha.700">
                With mindful tourism policies and deep respect for nature and culture, Bhutan is the perfect place
                for travelers seeking meaningful encounters.
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" fontFamily="heading" mb={2}>
                  Carbon-negative kingdom
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  More than 70% of the nation is forested, protected, and thriving.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" fontFamily="heading" mb={2}>
                  Sacred festivals
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Time your trip for masked dances, ceremonial drumming, and blessings.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" fontFamily="heading" mb={2}>
                  Warm local hosts
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Stay in boutique lodges, farmhouses, and monasteries with local caretakers.
                </Text>
              </Box>
              <Box>
                <Heading size="sm" fontFamily="heading" mb={2}>
                  Slow travel ethos
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Fewer stops, deeper connections, and time to breathe.
                </Text>
              </Box>
            </SimpleGrid>
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 12, md: 20 }}>
        <Stack spacing={8}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={3}>
              Featured Bhutan tours
            </Heading>
            <Text color="blackAlpha.700">
              Small-group and private itineraries with a focus on calm, culture, and connection.
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {featured.map((tour) => (
              <Card key={tour.slug} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100" overflow="hidden">
                <Image src={tour.image} alt={tour.title} h="180px" w="100%" objectFit="cover" />
                <CardBody>
                  <Stack spacing={3}>
                    <Badge colorScheme="green" alignSelf="flex-start">
                      {tour.durationDays} days
                    </Badge>
                    <Heading size="md" fontFamily="heading">
                      {tour.title}
                    </Heading>
                    <Text fontSize="sm" color="blackAlpha.700">
                      {tour.summary}
                    </Text>
                    <Button
                      as={NextLink}
                      href={`/tours/${tour.slug}`}
                      variant="ghost"
                      colorScheme="green"
                      alignSelf="flex-start"
                    >
                      View journey
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Box bg="white" py={{ base: 12, md: 16 }} borderTop="1px solid" borderColor="blackAlpha.100">
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <Stack spacing={4}>
              <Heading fontFamily="heading" size="xl">
                Travel with a local curator and your own tempo.
              </Heading>
              <Text color="blackAlpha.700">
                We plan your permits, guides, transport, and lodging so you can stay present. Every trip supports
                village cooperatives and conservation projects.
              </Text>
              <HStack spacing={6}>
                <Box>
                  <Heading size="md" fontFamily="heading">
                    24/7
                  </Heading>
                  <Text fontSize="sm">On-trip concierge</Text>
                </Box>
                <Box>
                  <Heading size="md" fontFamily="heading">
                    100%
                  </Heading>
                  <Text fontSize="sm">Bhutanese guides</Text>
                </Box>
                <Box>
                  <Heading size="md" fontFamily="heading">
                    7
                  </Heading>
                  <Text fontSize="sm">Heritage partners</Text>
                </Box>
              </HStack>
            </Stack>
            <Box bg="forest.600" color="white" p={6} borderRadius="2xl">
              <Heading size="md" fontFamily="heading" mb={3}>
                Signature stays
              </Heading>
              <Stack spacing={2}>
                <Text>Cliffside Paro lodge with Himalayan sunrise deck</Text>
                <Text>Riverside Punakha boutique retreat</Text>
                <Text>Phobjikha valley glamping camp</Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 12, md: 20 }}>
        <Stack spacing={8}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={3}>
              Traveler notes
            </Heading>
            <Text color="blackAlpha.700">Authentic journeys, lovingly planned.</Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {testimonials.map((item) => (
              <Card key={item.name} borderRadius="2xl" boxShadow="md">
                <CardBody>
                  <Stack spacing={3}>
                    <Text fontSize="lg" fontFamily="heading">
                      “{item.quote}”
                    </Text>
                    <Box>
                      <Text fontWeight="600">{item.name}</Text>
                      <Text fontSize="sm" color="blackAlpha.600">
                        {item.trip}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Container maxW="6xl" pb={{ base: 12, md: 16 }}>
        <Stack spacing={6}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={3}>
              A visual journey
            </Heading>
            <Text color="blackAlpha.700">
              Glimpses from forests, monasteries, and valley stays across Bhutan.
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {[
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80"
            ].map((src) => (
              <Box key={src} borderRadius="2xl" overflow="hidden">
                <Image src={src} alt="Bhutan scenic" objectFit="cover" w="100%" h="140px" />
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Container maxW="6xl" pb={{ base: 12, md: 16 }}>
        <Stack spacing={6}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={3}>
              Verified partners
            </Heading>
            <Text color="blackAlpha.700">
              Trusted local operators and eco-tourism certifications that keep your journey ethical and seamless.
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {[
              "Bhutan Tourism Council",
              "Carbon Neutral Lodges",
              "UNESCO Heritage Partners",
              "Local Guide Association"
            ].map((label) => (
              <Box
                key={label}
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={4}
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight="600">
                  {label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Box bg="sand.100" py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <Stack spacing={4}>
              <Heading fontFamily="heading" size="xl">
                Start your Bhutan journey
              </Heading>
              <Text color="blackAlpha.700">
                Tell us your ideal pace, travel dates, and interests. Our travel designers will reply within 24 hours
                with a tailored proposal.
              </Text>
              <Button
                as={NextLink}
                href="/contact"
                colorScheme="green"
                bg="forest.600"
                color="white"
                borderRadius="full"
                alignSelf="flex-start"
              >
                Plan my trip
              </Button>
            </Stack>
            <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
              <Stack spacing={3}>
                <Box borderRadius="xl" overflow="hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                    alt="Bhutan valley"
                    objectFit="cover"
                    w="100%"
                    h="160px"
                  />
                </Box>
                <Heading size="md" fontFamily="heading">
                  Private departures
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Choose your dates, accommodation style, and wellness add-ons.
                </Text>
                <Heading size="md" fontFamily="heading">
                  Small groups
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Maximum 10 guests for an intimate, local experience.
                </Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 12, md: 20 }}>
        <Stack spacing={6}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={3}>
              FAQs
            </Heading>
            <Text color="blackAlpha.700">
              Quick answers before you travel.
            </Text>
          </Box>
          <Accordion allowToggle>
            {faqs.map((item) => (
              <AccordionItem key={item.question} border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" mb={3}>
                <h3>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="600">
                      {item.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={4} color="blackAlpha.700">
                  {item.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>
      </Container>

      <Container maxW="6xl" pb={{ base: 12, md: 20 }}>
        <Stack spacing={6}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={3}>
              Bhutan SDF / Daily Tariff Calculator
            </Heading>
            <Text color="blackAlpha.700">
              Estimate the daily Sustainable Development Fee based on traveler type, nights, and group size.
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" color="blackAlpha.700" mb={2}>
                    Traveler type
                  </Text>
                  <Select value={travelerType} onChange={(e) => setTravelerType(e.target.value)}>
                    <option value="foreign">Foreign tourist — 100 USD / night</option>
                    <option value="regional">Regional tourist — 1200 / night</option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="sm" color="blackAlpha.700" mb={2}>
                    Nights
                  </Text>
                  <Input
                    type="number"
                    min="1"
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" color="blackAlpha.700" mb={2}>
                    Travelers
                  </Text>
                  <Input
                    type="number"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                  />
                </Box>
              </Stack>
            </Box>
            <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
              <Stack spacing={3}>
                <Text fontSize="sm" color="blackAlpha.600">
                  Rate
                </Text>
                <Text fontSize="2xl" fontWeight="600">
                  {rate} {currency} / night
                </Text>
                <Text fontSize="sm" color="blackAlpha.600">
                  Estimated total
                </Text>
                <Text fontSize="3xl" fontWeight="700">
                  {total.toLocaleString()} {currency}
                </Text>
                <Text fontSize="sm" color="blackAlpha.600">
                  Based on {people || 0} traveler(s) for {nights || 0} night(s).
                </Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
