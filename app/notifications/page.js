"use client";

import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Badge,
  Button
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SiteLayout from "../components/SiteLayout";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await fetch("/api/notifications/list");
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => {
    load();
    fetch("/api/notifications/read", { method: "POST" }).catch(() => null);
  }, []);

  return (
    <SiteLayout>
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="3xl">
          <Stack spacing={6}>
            <Heading fontFamily="heading" size="xl">
              Notifications
            </Heading>
            {items.length === 0 && (
              <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6}>
                <Text color="blackAlpha.700">
                  You don't have any notifications yet.
                </Text>
              </Box>
            )}
            {items.map((item) => (
              <Box
                key={item.id}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={5}
              >
                <Stack spacing={2}>
                  <Text fontWeight="600">{item.subject}</Text>
                  <Badge
                    colorScheme={item.status === "sent" ? "green" : item.status === "pending" ? "orange" : "red"}
                    alignSelf="flex-start"
                  >
                    {item.status}
                  </Badge>
                  {item.detail && (
                    <Text fontSize="sm" color="blackAlpha.600">
                      {item.detail}
                    </Text>
                  )}
                  <Text fontSize="sm" color="blackAlpha.600">
                    {new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </Text>
                </Stack>
              </Box>
            ))}
            <Button variant="outline" borderRadius="full" onClick={load} alignSelf="flex-start">
              Refresh
            </Button>
          </Stack>
        </Container>
      </Box>
    </SiteLayout>
  );
}
