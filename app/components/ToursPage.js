"use client";

import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import SiteLayout from "./SiteLayout";
import ToursExplorer from "./ToursExplorer";

export default function ToursPage({ tours, themes, difficulties }) {
  const derivedThemes =
    themes ||
    Array.from(
      new Set(
        (tours || []).flatMap((tour) => (Array.isArray(tour.theme) ? tour.theme : []))
      )
    );
  const derivedDifficulties =
    difficulties ||
    Array.from(
      new Set((tours || []).map((tour) => tour.difficulty).filter(Boolean))
    );

  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <Stack spacing={6} mb={10}>
            <Heading fontFamily="heading" size="xl">
              Explore Bhutan tours
            </Heading>
            <Text color="blackAlpha.700">
              Filter by travel style and duration. Each itinerary is customizable and led by local specialists.
            </Text>
          </Stack>
          <ToursExplorer tours={tours} themes={derivedThemes} difficulties={derivedDifficulties} />
        </Container>
      </Box>
    </SiteLayout>
  );
}
