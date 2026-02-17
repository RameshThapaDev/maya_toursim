"use client";

import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import SiteLayout from "./components/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="4xl" textAlign="center">
          <Heading fontFamily="heading" size="2xl" mb={4}>
            This journey doesn't exist.
          </Heading>
          <Text color="blackAlpha.700" mb={8}>
            The tour you're looking for isn't available. Explore our curated journeys instead.
          </Text>
          <Button as={NextLink} href="/tours" colorScheme="green" bg="forest.600" color="white">
            Browse tours
          </Button>
        </Container>
      </Box>
    </SiteLayout>
  );
}
