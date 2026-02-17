"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Image,
  Select,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useMemo, useState } from "react";

const durationOptions = [
  { label: "Any length", value: "all" },
  { label: "1-5 days", value: "short" },
  { label: "6-9 days", value: "medium" },
  { label: "10+ days", value: "long" }
];

export default function ToursExplorer({ tours, themes, difficulties }) {
  const [duration, setDuration] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [theme, setTheme] = useState("all");

  const filtered = useMemo(() => {
    return tours.filter((tour) => {
      const durationMatch = (() => {
        if (duration === "short") return tour.durationDays <= 5;
        if (duration === "medium") return tour.durationDays >= 6 && tour.durationDays <= 9;
        if (duration === "long") return tour.durationDays >= 10;
        return true;
      })();

      const difficultyMatch = difficulty === "all" ? true : tour.difficulty === difficulty;
      const themeMatch = theme === "all" ? true : tour.theme.includes(theme);

      return durationMatch && difficultyMatch && themeMatch;
    });
  }, [tours, duration, difficulty, theme]);

  return (
    <Box>
      <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={8}>
        <Select value={duration} onChange={(e) => setDuration(e.target.value)} bg="white">
          {durationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select value={theme} onChange={(e) => setTheme(e.target.value)} bg="white">
          <option value="all">Any theme</option>
          {themes.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </Select>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} bg="white">
          <option value="all">Any difficulty</option>
          {difficulties.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </Select>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filtered.map((tour) => (
          <Card
            key={tour.slug}
            borderRadius="2xl"
            boxShadow="sm"
            border="1px solid"
            borderColor="blackAlpha.100"
            overflow="hidden"
          >
            <Image src={tour.image} alt={tour.title} h="180px" w="100%" objectFit="cover" />
            <CardBody>
              <Stack spacing={3}>
                <Flex justify="space-between" align="center">
                  <Badge colorScheme="green" variant="subtle">
                    {tour.durationDays} days
                  </Badge>
                  <Badge colorScheme="orange" variant="outline">
                    {tour.difficulty}
                  </Badge>
                </Flex>
                <Heading size="md" fontFamily="heading">
                  {tour.title}
                </Heading>
                <Text fontSize="sm" color="blackAlpha.700">
                  {tour.summary}
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {tour.theme.map((item) => (
                    <Badge key={item} colorScheme="green">
                      {item}
                    </Badge>
                  ))}
                </HStack>
                <Button
                  as={NextLink}
                  href={`/tours/${tour.slug}`}
                  variant="ghost"
                  colorScheme="green"
                  alignSelf="flex-start"
                >
                  View tour
                </Button>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      {filtered.length === 0 && (
        <Box mt={8} p={6} bg="whiteAlpha.800" borderRadius="xl">
          <Text>No tours match those filters. Try a different combination.</Text>
        </Box>
      )}
    </Box>
  );
}
