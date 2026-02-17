"use client";

import {
  Box,
  Container,
  Heading,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList
} from "@chakra-ui/react";
import SiteLayout from "./SiteLayout";

export default function TravelInfoPage() {
  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <Stack spacing={10}>
            <Box>
              <Heading fontFamily="heading" size="2xl" mb={4}>
                Travel information
              </Heading>
              <Text color="blackAlpha.700" maxW="720px">
                Everything you need to know before visiting Bhutan, from visas and seasons to packing tips.
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
                <Heading size="md" fontFamily="heading" mb={3}>
                  Visas & permits
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Bhutan requires a visa and a licensed guide. We handle all permits once your itinerary is confirmed.
                </Text>
              </Box>
              <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
                <Heading size="md" fontFamily="heading" mb={3}>
                  Best seasons
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  Spring (Mar–May) and autumn (Sep–Nov) offer clear skies, festivals, and comfortable temperatures.
                </Text>
              </Box>
              <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
                <Heading size="md" fontFamily="heading" mb={3}>
                  Packing tips
                </Heading>
                <UnorderedList spacing={2} pl={4} fontSize="sm" color="blackAlpha.700">
                  <ListItem>Layered clothing for shifting mountain temperatures.</ListItem>
                  <ListItem>Comfortable walking shoes and a daypack.</ListItem>
                  <ListItem>Respectful attire for temples and monasteries.</ListItem>
                </UnorderedList>
              </Box>
              <Box bg="white" p={6} borderRadius="2xl" boxShadow="md">
                <Heading size="md" fontFamily="heading" mb={3}>
                  Currency & connectivity
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  The Bhutanese Ngultrum is used alongside the Indian Rupee. Wi-Fi is available in lodges, but expect
                  slower speeds in remote valleys.
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </SiteLayout>
  );
}
