"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";

const defaultDestinations = [
  {
    id: "paro",
    name: "Paro",
    highlight: "Tiger’s Nest & river valleys",
    description: "Gateway to Bhutan with iconic monasteries and alpine hikes."
  },
  {
    id: "thimphu",
    name: "Thimphu",
    highlight: "Capital culture & markets",
    description: "Modern Bhutanese life meets tradition, art, and heritage."
  },
  {
    id: "punakha",
    name: "Punakha",
    highlight: "Riverside dzongs",
    description: "Warm valleys with suspension bridges and riverside retreats."
  },
  {
    id: "bumthang",
    name: "Bumthang",
    highlight: "Spiritual heartland",
    description: "Ancient temples, meadows, and craft villages."
  },
  {
    id: "gangtey",
    name: "Gangtey & Phobjikha",
    highlight: "Crane sanctuaries",
    description: "Glacial valley with sweeping vistas and eco stays."
  }
];

const markerPositions = {
  paro: { x: 54, y: 64 },
  thimphu: { x: 50, y: 56 },
  punakha: { x: 58, y: 72 },
  bumthang: { x: 74, y: 60 },
  gangtey: { x: 64, y: 74 }
};

export default function InteractiveMap() {
  const [items, setItems] = useState(defaultDestinations);
  const [activeId, setActiveId] = useState(defaultDestinations[0].id);

  useEffect(() => {
    fetch("/api/public/destinations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          const mapped = data.items.map((item) => ({
            id: item.slug,
            name: item.name,
            highlight: item.best_time || "Best time to visit",
            description: item.description || "",
            x: markerPositions[item.slug]?.x ?? 50,
            y: markerPositions[item.slug]?.y ?? 50
          }));
          setItems(mapped);
          setActiveId(mapped[0].id);
        }
      })
      .catch(() => null);
  }, []);

  const active = useMemo(
    () => items.find((item) => item.id === activeId),
    [activeId, items]
  );

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="stretch">
      <Card
        borderRadius="lg"
        border="1px solid"
        borderColor="blackAlpha.100"
        bg="white"
        boxShadow="sm"
      >
        <CardBody>
          <Stack spacing={4}>
            <Heading size="md" fontFamily="heading">
              Bhutan destination map
            </Heading>
            <Text color="blackAlpha.700" fontSize="sm">
              Tap a marker to explore highlights and suggested experiences.
            </Text>
            <Box
              position="relative"
              w="100%"
              h={{ base: "280px", md: "360px" }}
              borderRadius="md"
              bg="sand.50"
              overflow="hidden"
              border="1px solid"
              borderColor="blackAlpha.100"
            >
              <Box
                as="img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzpr60cGOC7hCfPcHf3GKP7dRwwMvwYzamNg&s"
                alt="Bhutan map outline"
                width="100%"
                height="100%"
                objectFit="contain"
                opacity={0.9}
              />

              {items.map((place) => (
                <Button
                  key={place.id}
                  onClick={() => setActiveId(place.id)}
                  size="xs"
                  position="absolute"
                  left={`${place.x}%`}
                  top={`${place.y}%`}
                  transform="translate(-50%, -50%)"
                  bg={place.id === activeId ? "forest.600" : "white"}
                  color={place.id === activeId ? "white" : "blackAlpha.800"}
                  border="1px solid"
                  borderColor={place.id === activeId ? "forest.600" : "blackAlpha.200"}
                  borderRadius="full"
                  boxShadow="sm"
                  _hover={{ bg: "forest.600", color: "white" }}
                  aria-label={`Select ${place.name}`}
                >
                  {place.name}
                </Button>
              ))}
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card
        borderRadius="lg"
        border="1px solid"
        borderColor="blackAlpha.100"
        bg="white"
        boxShadow="sm"
      >
        <CardBody>
          <Stack spacing={4}>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Heading size="md" fontFamily="heading">
                  {active?.name}
                </Heading>
                <Text color="blackAlpha.600" fontSize="sm">
                  {active?.highlight}
                </Text>
              </Box>
              <Badge colorScheme="green">Destination</Badge>
            </HStack>
            <Text color="blackAlpha.700" fontSize="sm">
              {active?.description}
            </Text>
            <Stack spacing={2}>
              <Text fontSize="sm" fontWeight="600">
                Suggested experiences
              </Text>
              <Text fontSize="sm" color="blackAlpha.700">
                Cultural walks · Valley hikes · Local artisan visits
              </Text>
            </Stack>
            <Flex gap={3} flexWrap="wrap">
              <Button size="sm" colorScheme="green" borderRadius="full">
                View itineraries
              </Button>
              <Button size="sm" variant="outline" borderRadius="full">
                Add to trip plan
              </Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}
