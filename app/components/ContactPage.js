"use client";

import {
  Box,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import SiteLayout from "./SiteLayout";
import InquiryForm from "./InquiryForm";
import { hotels } from "../data/hotels";
import { guides } from "../data/guides";
import { vehicles } from "../data/vehicles";

export default function ContactPage() {
  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="start">
            <Stack spacing={4}>
              <Box borderRadius="2xl" overflow="hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
                  alt="Bhutan valley view"
                  objectFit="cover"
                  w="100%"
                  h={{ base: "200px", md: "240px" }}
                />
              </Box>
              <Heading fontFamily="heading" size="2xl">
                Plan your trip
              </Heading>
              <Text color="blackAlpha.700">
                Share your travel dates, interests, and pace. Our travel designers will craft a tailored proposal
                within 24 hours.
              </Text>
              <Box bg="sand.100" p={6} borderRadius="2xl">
                <Text fontWeight="600" mb={2}>
                  Contact details
                </Text>
                <Text fontSize="sm">hello@himalayanblisstours.com</Text>
                <Text fontSize="sm">+975 2 555 010</Text>
                <Text fontSize="sm">Thimphu, Bhutan</Text>
              </Box>
            </Stack>
            <InquiryForm hotels={hotels} guides={guides} vehicles={vehicles} />
          </SimpleGrid>
        </Container>
      </Box>
    </SiteLayout>
  );
}
