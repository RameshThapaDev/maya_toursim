"use client";

import {
  Box,
  Card,
  CardBody,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import SiteLayout from "./SiteLayout";

export default function AboutPage() {
  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <Stack spacing={10}>
            <Box maxW="720px">
              <Heading fontFamily="heading" size="2xl" mb={4}>
                Our story
              </Heading>
              <Text color="blackAlpha.700" fontSize="lg">
                Maya Bliss Tours began as a collective of Bhutanese guides, storytellers, and hospitality
                families who wanted to share the kingdom's deeper rhythm with mindful travelers.
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card borderRadius="2xl" boxShadow="md">
                <CardBody>
                  <Heading size="md" fontFamily="heading" mb={3}>
                    Mission
                  </Heading>
                  <Text fontSize="sm" color="blackAlpha.700">
                    Create slow, meaningful journeys that honor Bhutanese culture while uplifting local communities.
                  </Text>
                </CardBody>
              </Card>
              <Card borderRadius="2xl" boxShadow="md">
                <CardBody>
                  <Heading size="md" fontFamily="heading" mb={3}>
                    Eco-tourism focus
                  </Heading>
                  <Text fontSize="sm" color="blackAlpha.700">
                    We partner with carbon-neutral lodges, support conservation initiatives, and keep groups small.
                  </Text>
                </CardBody>
              </Card>
              <Card borderRadius="2xl" boxShadow="md">
                <CardBody>
                  <Heading size="md" fontFamily="heading" mb={3}>
                    Local expertise
                  </Heading>
                  <Text fontSize="sm" color="blackAlpha.700">
                    Every itinerary is led by Bhutanese guides trained in cultural heritage and sustainable travel.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
            <Box bg="sand.100" p={6} borderRadius="2xl">
              <Heading size="md" fontFamily="heading" mb={2}>
                Why we do it
              </Heading>
              <Text color="blackAlpha.700">
                Bhutan's Gross National Happiness philosophy is a reminder that travel should be enriching, not
                extractive. We design journeys that prioritize respect, presence, and positive impact.
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>
    </SiteLayout>
  );
}
