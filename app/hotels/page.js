"use client";

import {
  Badge,
  Box,
  Card,
  CardBody,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import SiteLayout from "../components/SiteLayout";
import ReviewSection from "../components/reviews/ReviewSection";
import { useEffect, useState } from "react";

export default function HotelsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/public/hotels")
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
              Hotel partners
            </Heading>
            <Text color="blackAlpha.700">
              Select a preferred stay and share your experience after traveling with us.
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {items.map((hotel) => (
              <Card
                key={hotel.slug}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="blackAlpha.100"
                overflow="hidden"
              >
                <Image src={hotel.image} alt={hotel.name} h="220px" w="100%" objectFit="cover" />
                <CardBody>
                  <Stack spacing={4}>
                    <Stack spacing={2}>
                      <Heading size="md" fontFamily="heading">
                        {hotel.name}
                      </Heading>
                      <Badge colorScheme="green" alignSelf="flex-start">
                        {hotel.location} {hotel.style ? `· ${hotel.style}` : ""}
                      </Badge>
                      <Text fontSize="sm" color="blackAlpha.700">
                        {hotel.summary}
                      </Text>
                    </Stack>
                    <ReviewSection targetType="hotel" targetSlug={hotel.slug} />
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
