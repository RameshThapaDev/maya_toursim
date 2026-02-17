"use client";

import {
  Badge,
  Box,
  Card,
  CardBody,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import SiteLayout from "../components/SiteLayout";
import ReviewSection from "../components/reviews/ReviewSection";
import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/public/vehicles")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="7xl">
          <Stack spacing={6} mb={10}>
            <Heading fontFamily="heading" size="xl">
              Travel vehicles
            </Heading>
            <Text color="blackAlpha.700">
              Pick the ride that suits your group and share feedback after your trip.
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {items.map((vehicle) => (
              <Card
                key={vehicle.slug}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="blackAlpha.100"
              >
                <CardBody>
                  <Stack spacing={4}>
                    <Stack spacing={2}>
                      <Heading size="md" fontFamily="heading">
                        {vehicle.name}
                      </Heading>
                      <Badge colorScheme="green" alignSelf="flex-start">
                        {vehicle.capacity} seats
                      </Badge>
                      <Text fontSize="sm" color="blackAlpha.700">
                        {vehicle.summary}
                      </Text>
                    </Stack>
                    <ReviewSection targetType="vehicle" targetSlug={vehicle.slug} />
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </SiteLayout>
  );
}
