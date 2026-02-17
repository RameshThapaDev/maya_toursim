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

export default function GuidesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/public/guides")
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
              Bhutan tour guides
            </Heading>
            <Text color="blackAlpha.700">
              Choose a guide to match your interests and leave ratings after your journey.
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {items.map((guide) => (
              <Card
                key={guide.slug}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="blackAlpha.100"
                overflow="hidden"
              >
                <Image src={guide.image} alt={guide.name} h="220px" w="100%" objectFit="cover" />
                <CardBody>
                  <Stack spacing={4}>
                    <Stack spacing={2}>
                      <Heading size="md" fontFamily="heading">
                        {guide.name}
                      </Heading>
                      <Badge colorScheme="green" alignSelf="flex-start">
                        {guide.region || "Bhutan"} {guide.specialty ? `· ${guide.specialty}` : ""}
                      </Badge>
                      <Text fontSize="sm" color="blackAlpha.700">
                        {guide.summary}
                      </Text>
                    </Stack>
                    <ReviewSection targetType="guide" targetSlug={guide.slug} />
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
