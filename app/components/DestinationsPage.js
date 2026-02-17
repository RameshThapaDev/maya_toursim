"use client";

import {
  Badge,
  Box,
  Card,
  CardBody,
  Container,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import SiteLayout from "./SiteLayout";
import NextLink from "next/link";
import { useEffect, useState } from "react";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch("/api/public/destinations")
      .then((res) => res.json())
      .then((data) => setDestinations(data.items || []))
      .catch(() => setDestinations([]));
  }, []);

  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <Stack spacing={6} mb={10}>
            <Heading fontFamily="heading" size="xl">
              Bhutan destinations
            </Heading>
            <Text color="blackAlpha.700">
              Explore Bhutan's most iconic valleys and cultural centers, each with its own best season and story.
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {destinations.map((place) => (
              <LinkBox
                key={place.slug}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="blackAlpha.100"
                overflow="hidden"
                as={Card}
              >
                <Image src={place.image} alt={place.name} h="180px" w="100%" objectFit="cover" />
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="md" fontFamily="heading">
                      <LinkOverlay as={NextLink} href={`/destinations/${place.slug}`}>
                        {place.name}
                      </LinkOverlay>
                    </Heading>
                    <Badge colorScheme="green" alignSelf="flex-start">
                      Best time: {place.best_time || place.bestTime}
                    </Badge>
                    <Text fontSize="sm" color="blackAlpha.700">
                      {place.description}
                    </Text>
                    <Box>
                      <Text fontWeight="600" fontSize="sm" mb={2}>
                        Highlights
                      </Text>
                      <Stack spacing={1} fontSize="sm">
                        {place.highlights.map((item) => (
                          <Text key={item}>• {item}</Text>
                        ))}
                      </Stack>
                    </Box>
                    {(place.weather_info || place.seasonal_info) && (
                      <Box>
                        <Text fontWeight="600" fontSize="sm" mb={2}>
                          Weather & seasons
                        </Text>
                        {place.weather_info && (
                          <Text fontSize="sm" color="blackAlpha.700">
                            {place.weather_info}
                          </Text>
                        )}
                        {place.seasonal_info && (
                          <Text fontSize="sm" color="blackAlpha.700">
                            {place.seasonal_info}
                          </Text>
                        )}
                      </Box>
                    )}
                    {(place.travel_tips || place.transport_info) && (
                      <Box>
                        <Text fontWeight="600" fontSize="sm" mb={2}>
                          Travel tips & transport
                        </Text>
                        {place.travel_tips && (
                          <Text fontSize="sm" color="blackAlpha.700">
                            {place.travel_tips}
                          </Text>
                        )}
                        {place.transport_info && (
                          <Text fontSize="sm" color="blackAlpha.700">
                            {place.transport_info}
                          </Text>
                        )}
                      </Box>
                    )}
                    {Array.isArray(place.accommodations) && place.accommodations.length > 0 && (
                      <Box>
                        <Text fontWeight="600" fontSize="sm" mb={2}>
                          Accommodation listings
                        </Text>
                        <Stack spacing={1} fontSize="sm">
                          {place.accommodations.map((item) => (
                            <Text key={item}>• {item}</Text>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </CardBody>
              </LinkBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </SiteLayout>
  );
}
